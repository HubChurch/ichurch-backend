const { Events } = require("../../models/community");

// 📌 Criar um novo evento
exports.createEvent = async (req, res) => {
    try {
        const event = await Events.create({ ...req.body, company_id: req.user.company_id });
        res.status(201).json(event);
    } catch (err) {
        console.error("Erro ao criar evento:", err);
        res.status(500).json({ error: "Erro ao criar evento." });
    }
};

// 📌 Listar todos os eventos ativos
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Events.findAll({
            where: { company_id: req.user.company_id, status: 'active' }
        });

        res.json(events);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar eventos." });
    }
};

// 📌 Buscar evento por ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Events.findOne({ where: { id: req.params.id, company_id: req.user.company_id, status: 'active' } });
        if (!event) return res.status(404).json({ error: "Evento não encontrado." });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar evento." });
    }
};

// 📌 Atualizar evento
exports.updateEvent = async (req, res) => {
    try {
        const updated = await Events.update(req.body, { where: { id: req.params.id, company_id: req.user.company_id } });
        if (!updated[0]) return res.status(404).json({ error: "Evento não encontrado." });
        res.json({ message: "Evento atualizado com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar evento." });
    }
};

// 📌 Exclusão lógica (Marcar como deletado)
exports.deleteEvent = async (req, res) => {
    try {
        const updated = await Events.update({ status: 'inactive' }, { where: { id: req.params.id, company_id: req.user.company_id } });
        if (!updated[0]) return res.status(404).json({ error: "Evento não encontrado." });
        res.json({ message: "Evento excluído com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao excluir evento." });
    }
};
