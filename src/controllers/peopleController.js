const People = require('../models/People');
const Members = require('../models/Members');
const RegularAttendees = require('../models/RegularAttendees');
const Visitors = require('../models/Visitors');

exports.getAllPeople = async (req, res) => {
    try {
        const people = await People.findAll();
        res.json(people);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar pessoas.' + err });
    }
};

exports.getPersonById = async (req, res) => {
    const { id } = req.params;
    try {
        const person = await People.findByPk(id);
        if (!person) return res.status(404).json({ message: 'Pessoa não encontrada.' });
        res.json(person);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar pessoa.' });
    }
};

exports.createPerson = async (req, res) => {
    const {
        name,
        phone,
        instagram,
        birth_date,
        guardian_name,
        guardian_phone,
        type, // Tipo da pessoa (member, regular_attendee, visitor)
        baptism_date, // Somente para membros
        membership_start, // Somente para membros
        first_visit_date, // Somente para frequentadores regulares
        notes // Somente para visitantes
    } = req.body;

    try {
        // Criar a pessoa na tabela `people`
        const person = await People.create({
            name,
            phone,
            instagram,
            birth_date,
            guardian_name,
            guardian_phone,
            type,
        });

        // Verificar o tipo e criar na tabela correspondente
        if (type === 'member') {
            await Members.create({
                id: person.id, // O ID da pessoa é usado como chave primária
                baptism_date,
                membership_start,
            });
        } else if (type === 'regular_attendee') {
            await RegularAttendees.create({
                id: person.id,
                first_visit_date,
            });
        } else if (type === 'visitor') {
            await Visitors.create({
                id: person.id,
                notes,
            });
        }

        res.status(201).json({
            message: `Pessoa criada como ${type} com sucesso.`,
            person,
        });
    } catch (err) {
        console.error('Erro ao criar pessoa:', err);
        res.status(500).json({ error: 'Erro ao criar pessoa.' });
    }
};

exports.updatePerson = async (req, res) => {
    const { id } = req.params;
    try {
        const person = await People.findByPk(id);
        if (!person) return res.status(404).json({ message: 'Pessoa não encontrada.' });
        await person.update(req.body);
        res.json(person);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar pessoa.' });
    }
};

exports.deletePerson = async (req, res) => {
    const { id } = req.params;
    try {
        const person = await People.findByPk(id);
        if (!person) return res.status(404).json({ message: 'Pessoa não encontrada.' });
        await person.destroy();
        res.json({ message: 'Pessoa excluída com sucesso.' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao excluir pessoa.' });
    }
};
