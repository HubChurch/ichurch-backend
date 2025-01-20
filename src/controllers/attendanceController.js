const Attendance = require('../models/Attendance');
const People = require('../models/People');
const Events = require('../models/Events');

// Registrar presença
exports.markAttendance = async (req, res) => {
    const { person_id, event_id } = req.body;
    try {
        const person = await People.findByPk(person_id);
        const event = await Events.findByPk(event_id);

        if (!person) return res.status(404).json({ message: 'Pessoa não encontrada.' });
        if (!event) return res.status(404).json({ message: 'Evento não encontrado.' });

        const attendance = await Attendance.create({ person_id, event_id });
        res.status(201).json(attendance);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao registrar presença.' });
    }
};

// Listar presenças por evento
exports.getAttendanceByEvent = async (req, res) => {
    const { event_id } = req.query;
    try {
        const attendance = await Attendance.findAll({
            where: { event_id },
            include: [{ model: People, as: 'person' }],
        });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar presenças.' });
    }
};

// Listar presenças de uma pessoa
exports.getAttendanceByPerson = async (req, res) => {
    const { person_id } = req.query;
    try {
        const attendance = await Attendance.findAll({
            where: { person_id },
            include: [{ model: Events, as: 'event' }],
        });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar presenças.' });
    }
};
