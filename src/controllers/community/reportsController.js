const Attendance = require("../../models/community/Attendance");
const People = require("../../models/community/People");
const Events = require("../../models/community/Events");
const { Op, Sequelize } = require("sequelize");

/**
 * 📌 Estatísticas gerais de pessoas dentro da empresa do usuário autenticado
 */
exports.getPeopleStats = async (req, res) => {
    try {
        const companyId = req.company_id; // ✅ Pegando direto do `authMiddleware`

        const stats = await People.findAll({
            where: { company_id: companyId, status: "active" },
            attributes: [
                [Sequelize.literal("COUNT(*)"), "totalPeople"],
                [Sequelize.literal("SUM(type = 'visitor')"), "totalVisitors"],
                [Sequelize.literal("SUM(type = 'regular_attendee')"), "totalRegularAttendees"],
                [Sequelize.literal("SUM(type = 'member')"), "totalMembers"],
            ],
            raw: true,
        });

        return res.json(stats[0]);
    } catch (err) {
        console.error("Erro ao gerar estatísticas de pessoas:", err);
        return res.status(500).json({ error: "Erro ao gerar estatísticas de pessoas." });
    }
};

/**
 * 📌 Relatório de presença por evento
 */
exports.getEventPresenceReport = async (req, res) => {
    try {
        const { event_id } = req.params;
        const companyId = req.company_id;

        const event = await Events.findOne({ where: { id: event_id, company_id: companyId } });
        if (!event) {
            return res.status(404).json({ message: "Evento não encontrado." });
        }

        const attendance = await Attendance.findAll({
            where: { event_id },
            include: [{ model: People, as: "person", attributes: ["id", "name", "type"] }],
        });

        return res.json({
            event: {
                id: event.id,
                name: event.name,
                date: event.event_date,
            },
            totalAttendees: attendance.length,
            attendees: attendance.map((record) => record.person),
        });
    } catch (err) {
        console.error("Erro ao gerar relatório de presença por evento:", err);
        return res.status(500).json({ error: "Erro ao gerar relatório de presença por evento." });
    }
};

/**
 * 📌 Retorna aniversariantes da semana
 */
exports.getBirthdaysThisWeek = async (req, res) => {
    try {
        const companyId = req.company_id;
        const today = new Date();

        const startMonthDay = today.toISOString().slice(5, 10); // Ex: "02-15"
        today.setDate(today.getDate() + 6);
        const endMonthDay = today.toISOString().slice(5, 10); // Ex: "02-21"

        const birthdays = await People.findAll({
            where: {
                company_id: companyId,
                status: "active",
                [Op.and]: [
                    Sequelize.literal(`DATE_FORMAT(birth_date, '%m-%d') BETWEEN '${startMonthDay}' AND '${endMonthDay}'`),
                ],
            },
            order: [[Sequelize.literal("DATE_FORMAT(birth_date, '%m-%d')"), "ASC"]],
            attributes: ["id", "name", "birth_date"],
        });

        return res.json(birthdays);
    } catch (err) {
        console.error("Erro ao buscar aniversariantes da semana:", err);
        return res.status(500).json({ error: "Erro ao buscar aniversariantes da semana." });
    }
};

/**
 * 📌 Lista membros ausentes nos últimos dois eventos
 */
exports.getAbsentMembers = async (req, res) => {
    try {
        const companyId = req.company_id;

        // Busca os 2 últimos eventos
        const recentEvents = await Events.findAll({
            where: { company_id: companyId },
            order: [["event_date", "DESC"]],
            limit: 2,
            attributes: ["id"],
        });

        if (recentEvents.length < 2) {
            return res.status(400).json({ message: "São necessários pelo menos dois eventos para calcular a ausência." });
        }

        const eventIds = recentEvents.map((event) => event.id);

        // Obtém IDs das pessoas presentes nos dois últimos eventos
        const attendees = await Attendance.findAll({
            where: { event_id: { [Op.in]: eventIds } },
            attributes: ["person_id"],
            raw: true,
        });

        const attendeesIds = attendees.map((att) => att.person_id);

        // Obtém todos os membros ativos que não participaram dos dois eventos
        const absentMembers = await People.findAll({
            where: {
                company_id: companyId,
                type: "member",
                status: "active",
                id: { [Op.notIn]: attendeesIds },
            },
            attributes: ["id", "name"],
        });

        return res.json(absentMembers);
    } catch (err) {
        console.error("Erro ao verificar membros ausentes:", err);
        return res.status(500).json({ error: "Erro ao verificar membros ausentes." });
    }
};

/**
 * 📌 Estatísticas de presença por evento
 */
exports.getEventStats = async (req, res) => {
    try {
        const { event_id } = req.params;
        const companyId = req.company_id;

        const event = await Events.findOne({ where: { id: event_id, company_id: companyId } });
        if (!event) {
            return res.status(404).json({ message: "Evento não encontrado." });
        }

        // Obter dados de presença e total de pessoas na empresa
        const [totalPeople, presentPeople] = await Promise.all([
            People.count({ where: { company_id: companyId, status: "active" } }),
            Attendance.count({ where: { event_id } }),
        ]);

        // IDs das pessoas que marcaram presença
        const attendanceRecords = await Attendance.findAll({ where: { event_id }, attributes: ["person_id"], raw: true });
        const presentPeopleIds = attendanceRecords.map((record) => record.person_id);

        // Contar ausentes
        const absentPeople = await People.count({
            where: {
                company_id: companyId,
                status: "active",
                id: { [Op.notIn]: presentPeopleIds },
            },
        });

        // Contagem por tipo de pessoa presente
        const [totalVisitorsInEvent, totalRegularAttendeesInEvent, totalMembersInEvent] = await Promise.all([
            People.count({ where: { company_id: companyId, type: "visitor", id: { [Op.in]: presentPeopleIds } } }),
            People.count({ where: { company_id: companyId, type: "regular_attendee", id: { [Op.in]: presentPeopleIds } } }),
            People.count({ where: { company_id: companyId, type: "member", id: { [Op.in]: presentPeopleIds } } }),
        ]);

        return res.json({
            event: {
                id: event.id,
                name: event.name,
                date: event.event_date,
            },
            totalPeople,
            presentPeople,
            absentPeople,
            totalVisitorsInEvent,
            totalRegularAttendeesInEvent,
            totalMembersInEvent,
        });
    } catch (err) {
        console.error("Erro ao gerar estatísticas do evento:", err);
        return res.status(500).json({ error: "Erro ao gerar estatísticas do evento." });
    }
};
