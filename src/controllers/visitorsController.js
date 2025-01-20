const Visitors = require('../models/Visitors');
const People = require('../models/People');

// Listar todos os visitantes
exports.getAllVisitors = async (req, res) => {
    try {
        const visitors = await Visitors.findAll({
            include: [{ model: People, as: 'person' }],
        });
        res.json(visitors);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar visitantes.' });
    }
};

// Registrar visita para visitante
exports.addVisit = async (req, res) => {
    const { id } = req.params;
    const { visit_date, notes } = req.body;

    try {
        const person = await People.findByPk(id);
        if (!person) return res.status(404).json({ message: 'Pessoa não encontrada.' });

        if (person.type !== 'visitor') {
            person.type = 'visitor';
            await person.save();
        }

        const newVisit = await Visitors.create({ id, visit_date, notes });
        res.status(201).json(newVisit);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao registrar visita.' });
    }
};
