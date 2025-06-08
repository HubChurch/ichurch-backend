const {Events} = require("../../models/community");
const {Attendance, People} = require("../../models/community");
const {Op} = require("sequelize");

// 📌 Criar um novo evento
exports.createEvent = async (req, res) => {
    try {
        const event = await Events.create({...req.body, company_id: req.user.company_id});
        res.status(201).json(event);
    } catch (err) {
        console.error("Erro ao criar evento:", err);
        res.status(500).json({error: "Erro ao criar evento."});
    }
};

// 📌 Listar todos os eventos ativos
exports.getAllEvents = async (req, res) => {
    try {
        const {ministry_id, start_date, end_date, fields} = req.query;

        // 🎯 Construção segura de condições
        const where = {};
        if (ministry_id) where.ministry_id = ministry_id;
        if (start_date) where.event_date = {[Op.gte]: new Date(start_date)};
        if (end_date) {
            where.event_date = {
                ...(where.event_date || {}),
                [Op.lte]: new Date(end_date),
            };
        }

        // 📌 Campos permitidos na resposta
        const allowedFields = [
            "id",
            "name",
            "description",
            "event_date",
            "ministry_id",
            "company_id",
            "status",
            "situation",
            "created_at",
            "updated_at",
        ];

        const attributes = fields
            ? fields
                .split(",")
                .map((f) => f.trim())
                .filter((f) => allowedFields.includes(f))
            : undefined;

        // 📥 Consulta principal
        const events = await Events.findAll({
            where,
            attributes,
            order: [["event_date", "DESC"]],
            // include: [] // Adicione relações aqui se necessário
        });

        res.status(200).json(events);
    } catch (error) {
        console.error("Erro ao buscar eventos:", error);
        res.status(500).json({message: "Erro interno no servidor."});
    }
};

// 📌 Buscar evento por ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Events.findOne({
            where: {
                id: req.params.id,
                company_id: req.user.company_id,
                status: 'active'
            }
        });
        if (!event) return res.status(404).json({error: "Evento não encontrado."});
        res.json(event);
    } catch (err) {
        res.status(500).json({error: "Erro ao buscar evento."});
    }
};

// 📌 Atualizar evento
exports.updateEvent = async (req, res) => {
    try {
        const updated = await Events.update(req.body, {where: {id: req.params.id, company_id: req.user.company_id}});
        if (!updated[0]) return res.status(404).json({error: "Evento não encontrado."});
        res.json({message: "Evento atualizado com sucesso."});
    } catch (err) {
        res.status(500).json({error: "Erro ao atualizar evento."});
    }
};

// 📌 Exclusão lógica (Marcar como deletado)
exports.deleteEvent = async (req, res) => {
    try {
        const updated = await Events.update({status: 'canceled'}, {
            where: {
                id: req.params.id,
                company_id: req.user.company_id
            }
        });
        if (!updated[0]) return res.status(404).json({error: "Evento não encontrado."});
        res.json({message: "Evento excluído com sucesso."});
    } catch (err) {
        res.status(500).json({error: "Erro ao excluir evento."});
    }
};

// 📌 Listar todas as pessoas de um evento (com presença ou não)
exports.getEventPeople = async (req, res) => {
    const {event_id} = req.params;

    try {
        // Verificar se o evento existe
        const event = await Events.findOne({
            where: {id: event_id, company_id: req.user.company_id}
        });

        if (!event) {
            return res.status(404).json({message: "Evento não encontrado."});
        }

        // 🔹 Buscar todas as pessoas da empresa
        const allPeople = await People.findAll({
            where: {company_id: req.user.company_id, status: 'active'},
            attributes: ["id", "name", "type", "photo"]
        });

        // 🔹 Buscar presenças desse evento
        const attendanceList = await Attendance.findAll({
            where: {event_id},
            attributes: ["person_id"]
        });

        // 🔹 Criar um conjunto de IDs das pessoas que marcaram presença
        const presentPeopleIds = new Set(attendanceList.map(a => a.person_id));

        // 🔹 Adicionar o campo "present" para indicar se a pessoa já marcou presença
        const formattedPeople = allPeople.map(person => ({
            id: person.id,
            name: person.name,
            type: person.type,
            photo: person.photo,
            present: presentPeopleIds.has(person.id) // Se o ID estiver na lista de presença, está presente
        }));

        res.json(formattedPeople);
    } catch (err) {
        console.error("Erro ao buscar pessoas do evento:", err);
        res.status(500).json({error: "Erro ao buscar participantes do evento."});
    }
};
