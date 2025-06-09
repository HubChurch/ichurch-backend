const { Events } = require("../../models/community");
const { Attendance, People } = require("../../models/community");
const { Op } = require("sequelize");

// 📌 Criar um novo evento
exports.createEvent = async (req, res) => {
    try {
        const event = await Events.create({
            ...req.body,
            company_id: req.user.company_id,
            status: "scheduled",
        });
        res.status(201).json(event);
    } catch (err) {
        console.error("Erro ao criar evento:", err);
        res.status(500).json({ error: "Erro ao criar evento." });
    }
};

// 📌 Listar todos os eventos
const { sequelize } = require("../../models/community"); // ou onde seu sequelize está configurado

exports.getEvents = async (req, res) => {
    try {
        const { ministry_id, start_date, end_date, fields } = req.query;

        const where = [`e.company_id = :company_id`];
        const replacements = { company_id: req.user.company_id };

        if (ministry_id) {
            where.push(`e.ministry_id = :ministry_id`);
            replacements.ministry_id = ministry_id;
        }

        if (start_date) {
            where.push(`e.event_date >= :start_date`);
            replacements.start_date = start_date;
        }

        if (end_date) {
            where.push(`e.event_date <= :end_date`);
            replacements.end_date = end_date;
        }

        const selectFields = fields
            ? fields
                .split(",")
                .filter((f) =>
                    [
                        "id",
                        "name",
                        "description",
                        "event_date",
                        "ministry_id",
                        "company_id",
                        "status",
                        "type",
                        "created_at",
                        "updated_at",
                    ].includes(f),
                )
                .map((f) => `e.${f}`)
            : ["e.*"];

        // Inclui também o nome do ministério
        selectFields.push("m.name AS ministry_name");

        const query = `
      SELECT ${selectFields.join(", ")}
      FROM community.events e
      LEFT JOIN ministry.ministries m ON e.ministry_id = m.id
      WHERE ${where.join(" AND ")}
      ORDER BY e.event_date DESC
    `;

        const events = await sequelize.query(query, {
            replacements,
            type: sequelize.QueryTypes.SELECT,
        });

        return res.status(200).json(events);
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        return res.status(500).json({ message: "Erro interno no servidor." });
    }
};


// 📌 Buscar evento por ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Events.findOne({
            where: {
                id: req.params.id,
                company_id: req.user.company_id,
            },
        });
        if (!event)
            return res.status(404).json({ error: "Evento não encontrado." });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar evento." });
    }
};

// 📌 Atualizar evento
exports.updateEvent = async (req, res) => {
    try {
        const [updatedCount] = await Events.update(req.body, {
            where: { id: req.params.id, company_id: req.user.company_id },
        });
        if (!updatedCount)
            return res.status(404).json({ error: "Evento não encontrado." });
        res.json({ message: "Evento atualizado com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar evento." });
    }
};

// 📌 Exclusão lógica (Marcar como cancelado)
exports.deleteEvent = async (req, res) => {
    try {
        const [updatedCount] = await Events.update(
            { status: "cancelled" },
            {
                where: {
                    id: req.params.id,
                    company_id: req.user.company_id,
                },
            }
        );
        if (!updatedCount)
            return res.status(404).json({ error: "Evento não encontrado." });
        res.json({ message: "Evento cancelado com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao cancelar evento." });
    }
};

// 📌 Listar todas as pessoas de um evento (com presença ou não)
exports.getEventPeople = async (req, res) => {
    const { event_id } = req.params;

    try {
        const event = await Events.findOne({
            where: { id: event_id, company_id: req.user.company_id },
        });

        if (!event) {
            return res.status(404).json({ message: "Evento não encontrado." });
        }

        const allPeople = await People.findAll({
            where: { company_id: req.user.company_id, status: "active" },
            attributes: ["id", "name", "type", "photo"],
        });

        const attendanceList = await Attendance.findAll({
            where: { event_id },
            attributes: ["person_id"],
        });

        const presentPeopleIds = new Set(attendanceList.map((a) => a.person_id));

        const formattedPeople = allPeople.map((person) => ({
            id: person.id,
            name: person.name,
            type: person.type,
            photo: person.photo,
            present: presentPeopleIds.has(person.id),
        }));

        res.json(formattedPeople);
    } catch (err) {
        console.error("Erro ao buscar pessoas do evento:", err);
        res.status(500).json({ error: "Erro ao buscar participantes do evento." });
    }
};
