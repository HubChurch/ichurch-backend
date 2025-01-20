const Events = require('../models/Events');

// Listar todos os eventos
exports.getAllEvents = async (req, res) => {
    try {
        const events = await Events.findAll();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar eventos.' });
    }
};

// Obter evento pelo ID
exports.getEventById = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Events.findByPk(id);
        if (!event) return res.status(404).json({ message: 'Evento não encontrado.' });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar evento.' });
    }
};

// Criar um novo evento
exports.createEvent = async (req, res) => {
    const { name, event_date, description } = req.body;
    try {
        const newEvent = await Events.create({ name, event_date, description });
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar evento.' });
    }
};

// Atualizar evento pelo ID
exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { name, event_date, description } = req.body;
    try {
        const event = await Events.findByPk(id);
        if (!event) return res.status(404).json({ message: 'Evento não encontrado.' });
        await event.update({ name, event_date, description });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar evento.' });
    }
};

// Excluir evento pelo ID
exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Events.findByPk(id);
        if (!event) return res.status(404).json({ message: 'Evento não encontrado.' });
        await event.destroy();
        res.json({ message: 'Evento excluído com sucesso.' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir evento.' });
    }
};
