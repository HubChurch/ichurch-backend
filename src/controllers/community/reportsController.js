const Attendance = require("../../models/community/Attendance");
const People = require("../../models/community/People");
const Events = require("../../models/community/Events");
const { Op, Sequelize } = require("sequelize");

// 📌 Estatísticas gerais de pessoas dentro da empresa do usuário autenticado
exports.getPeopleStats = async (req, res) => {
    try {
        const companyId = req.user.company_id;

        const totalPeople = await People.count({ where: { company_id: companyId, status : 'active' } });
        const totalVisitors = await People.count({ where: { company_id: companyId, type: "visitor" , status : 'active'} });
        const totalRegularAttendees = await People.count({ where: { company_id: companyId, type: "regular_attendee" , status : 'active'} });
        const totalMembers = await People.count({ where: { company_id: companyId, type: "member", status : 'active' } });

        res.json({ totalPeople, totalVisitors, totalRegularAttendees, totalMembers });
    } catch (err) {
        res.status(500).json({ error: "Erro ao gerar estatísticas de pessoas." });
    }
};

// 📌 Relatório de presença por evento
exports.getEventPresenceReport = async (req, res) => {
    const { event_id } = req.params;

    try {
        const event = await Events.findOne({ where: { id: event_id, company_id: req.user.company_id } });
        if (!event) {
            return res.status(404).json({ message: "Evento não encontrado." });
        }

        const attendance = await Attendance.findAll({
            where: { event_id },
            include: [{ model: People, as: "person" }],
        });

        const totalAttendees = attendance.length;
        const attendees = attendance.map((record) => ({
            person_id: record.person.id,
            name: record.person.name,
            type: record.person.type,
        }));

        res.json({
            event: {
                id: event.id,
                name: event.name,
                date: event.event_date,
            },
            totalAttendees,
            attendees,
        });
    } catch (err) {
        console.error("Erro ao gerar relatório de presença por evento:", err);
        res.status(500).json({ error: "Erro ao gerar relatório de presença por evento." });
    }
};

// 📌 Retornar aniversariantes da semana
exports.getBirthdaysThisWeek = async (req, res) => {
    try {
        const today = new Date();
        const startDate = new Date();
        startDate.setDate(today.getDate() - 6); // 🔥 6 dias atrás

        const endDate = new Date();
        endDate.setDate(today.getDate() + 6); // 🔥 6 dias à frente

        // 🔥 Formata MÊS-DIA para facilitar comparação sem o ano
        const startMonthDay = `${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`;
        const endMonthDay = `${String(endDate.getMonth() + 1).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

        const birthdays = await People.findAll({
            where: {
                company_id: req.user.company_id,
                status: "active", // 🔥 Filtra apenas pessoas ativas
                [Op.and]: [
                    Sequelize.literal(`DATE_FORMAT(birth_date, '%m-%d') BETWEEN '${startMonthDay}' AND '${endMonthDay}'`)
                ]
            },
            order: [[Sequelize.literal(`DATE_FORMAT(birth_date, '%m-%d')`), "ASC"]], // 🔥 Ordena por data de nascimento
        });

        res.json(birthdays);
    } catch (err) {
        console.error("Erro ao buscar aniversariantes da semana:", err);
        res.status(500).json({ error: "Erro ao buscar aniversariantes da semana." });
    }
};

// 📌 Listar membros ausentes nos últimos dois eventos
exports.getAbsentMembers = async (req, res) => {
    try {
        // Obter os dois eventos mais recentes da empresa do usuário
        const recentEvents = await Events.findAll({
            where: { company_id: req.user.company_id },
            order: [["event_date", "DESC"]],
            limit: 2,
        });

        if (recentEvents.length < 2) {
            return res.status(400).json({ message: "São necessários pelo menos dois eventos para calcular a ausência." });
        }

        const [event1, event2] = recentEvents;

        // Obter IDs das pessoas presentes nos dois eventos
        const attendeesEvent1 = await Attendance.findAll({ where: { event_id: event1.id } });
        const attendeesEvent2 = await Attendance.findAll({ where: { event_id: event2.id } });

        const attendeesIdsEvent1 = attendeesEvent1.map((attendance) => attendance.person_id);
        const attendeesIdsEvent2 = attendeesEvent2.map((attendance) => attendance.person_id);

        // Obter todos os membros da empresa do usuário
        const allMembers = await People.findAll({ where: { company_id: req.user.company_id, type: "member" } });

        // Filtrar membros ausentes nos dois eventos
        const absentMembers = allMembers.filter(
            (member) => !attendeesIdsEvent1.includes(member.id) && !attendeesIdsEvent2.includes(member.id)
        );

        res.json(absentMembers);
    } catch (err) {
        console.error("Erro ao verificar membros ausentes:", err);
        res.status(500).json({ error: "Erro ao verificar membros ausentes." });
    }
};

// 📌 Estatísticas de presença por evento
exports.getEventStats = async (req, res) => {
    const { event_id } = req.params;

    try {
        const event = await Events.findOne({ where: { id: event_id, company_id: req.user.company_id } });
        if (!event) {
            return res.status(404).json({ message: "Evento não encontrado." });
        }

        // Buscar todas as pessoas ativas no sistema da empresa do usuário
        const totalPeople = await People.count({ where: { company_id: req.user.company_id, status: "active" } });

        // Buscar todas as presenças registradas para o evento
        const presentPeople = await Attendance.count({ where: { event_id } });

        // Buscar IDs das pessoas que marcaram presença no evento
        const attendanceRecords = await Attendance.findAll({ where: { event_id } });
        const presentPeopleIds = attendanceRecords.map((record) => record.person_id);

        // Contar quantas pessoas estavam ausentes no evento
        const absentPeople = await People.count({
            where: {
                company_id: req.user.company_id,
                status: "active",
                id: { [Op.notIn]: presentPeopleIds }, // Quem NÃO está na lista de presença
            },
        });

        // Contar tipos de pessoas presentes no evento
        const totalVisitorsInEvent = await People.count({
            where: { company_id: req.user.company_id, type: "visitor", status: "active", id: { [Op.in]: presentPeopleIds } },
        });

        const totalRegularAttendeesInEvent = await People.count({
            where: { company_id: req.user.company_id, type: "regular_attendee", status: "active", id: { [Op.in]: presentPeopleIds } },
        });

        const totalMembersInEvent = await People.count({
            where: { company_id: req.user.company_id, type: "member", status: "active", id: { [Op.in]: presentPeopleIds } },
        });

        res.json({
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
        res.status(500).json({ error: "Erro ao gerar estatísticas do evento." });
    }
};
