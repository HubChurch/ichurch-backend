const Members = require('../models/Members');
const People = require('../models/People');

// Listar todos os membros
exports.getAllMembers = async (req, res) => {
    try {
        const members = await Members.findAll({
            include: [{ model: People, as: 'person' }],
        });
        res.json(members);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Erro ao listar membros.' });
    }
};

// Obter membro pelo ID
exports.getMemberById = async (req, res) => {
    const { id } = req.params;
    try {
        const member = await Members.findOne({
            where: { id },
            include: [{ model: People, as: 'person' }],
        });
        if (!member) return res.status(404).json({ message: 'Membro não encontrado.' });
        res.json(member);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar membro.' });
    }
};



// Criar um membro
exports.createMember = async (req, res) => {
    const { id, baptism_date, membership_start } = req.body;

    try {
        const person = await People.findByPk(id);
        if (!person) return res.status(404).json({ message: 'Pessoa não encontrada.' });

        if (person.type !== 'member') {
            person.type = 'member';
            await person.save();
        }

        const newMember = await Members.create({ id, baptism_date, membership_start });
        res.status(201).json(newMember);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar membro.' });
    }
};
