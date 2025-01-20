const Leader = require('../models/Leader');
const People = require('../models/People');

// Adicionar líder
exports.addLeader = async (req, res) => {
    const { id, role } = req.body;
    try {
        const person = await People.findByPk(id);
        if (!person) {
            return res.status(404).json({ message: 'Pessoa não encontrada.' });
        }

        const newLeader = await Leader.create({ id, role });
        res.status(201).json(newLeader);
    } catch (err) {
        console.error('Erro ao adicionar líder:', err);
        res.status(500).json({ error: 'Erro ao adicionar líder.' });
    }
};

// Listar todos os líderes
exports.getAllLeaders = async (req, res) => {
    try {
        const leaders = await Leader.findAll({
            include: [{ model: People, as: 'person' }],
        });
        res.json(leaders);
    } catch (err) {
        console.error('Erro ao listar líderes:', err);
        res.status(500).json({ error: 'Erro ao listar líderes.' });
    }
};

// Atualizar líder
exports.updateLeader = async (req, res) => {
    const { id } = req.params;
    const { role, active } = req.body;
    try {
        const leader = await Leader.findByPk(id);
        if (!leader) {
            return res.status(404).json({ message: 'Líder não encontrado.' });
        }

        leader.role = role || leader.role;
        leader.active = active !== undefined ? active : leader.active;
        await leader.save();

        res.json(leader);
    } catch (err) {
        console.error('Erro ao atualizar líder:', err);
        res.status(500).json({ error: 'Erro ao atualizar líder.' });
    }
};

// Remover líder
exports.removeLeader = async (req, res) => {
    const { id } = req.params;
    try {
        const leader = await Leader.findByPk(id);
        if (!leader) {
            return res.status(404).json({ message: 'Líder não encontrado.' });
        }

        await leader.destroy();
        res.json({ message: 'Líder removido com sucesso.' });
    } catch (err) {
        console.error('Erro ao remover líder:', err);
        res.status(500).json({ error: 'Erro ao remover líder.' });
    }
};
