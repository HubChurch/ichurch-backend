const RegularAttendees = require('../models/RegularAttendees');
const People = require('../models/People');

// Listar todos os frequentadores regulares
exports.getAllRegularAttendees = async (req, res) => {
    try {
        const attendees = await RegularAttendees.findAll({
            include: [{ model: People, as: 'person' }],
        });
        res.json(attendees);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar frequentadores regulares.' });
    }
};

// Criar um frequentador regular
exports.createRegularAttendee = async (req, res) => {
    const { id, first_visit_date } = req.body;

    try {
        const person = await People.findByPk(id);
        if (!person) return res.status(404).json({ message: 'Pessoa não encontrada.' });

        if (person.type !== 'regular_attendee') {
            person.type = 'regular_attendee';
            await person.save();
        }

        const newAttendee = await RegularAttendees.create({ id, first_visit_date });
        res.status(201).json(newAttendee);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar frequentador regular.' });
    }
};
