const Cell = require('../models/Cell');
const Leader = require('../models/Leader');

// Criar célula
exports.createCell = async (req, res) => {
    const { name, description, leader_id } = req.body;
    try {
        const leader = await Leader.findByPk(leader_id);
        if (!leader) {
            return res.status(404).json({ message: 'Líder não encontrado.' });
        }

        const newCell = await Cell.create({ name, description, leader_id });
        res.status(201).json(newCell);
    } catch (err) {
        console.error('Erro ao criar célula:', err);
        res.status(500).json({ error: 'Erro ao criar célula.' });
    }
};

// Listar células
exports.getAllCells = async (req, res) => {
    try {
        const cells = await Cell.findAll({
            include: [{ model: Leader, as: 'leader' }],
        });
        res.json(cells);
    } catch (err) {
        console.error('Erro ao listar células:', err);
        res.status(500).json({ error: 'Erro ao listar células.' });
    }
};

// Obter célula por ID
exports.getCellById = async (req, res) => {
    const { id } = req.params;
    try {
        const cell = await Cell.findByPk(id, {
            include: [{ model: Leader, as: 'leader' }],
        });
        if (!cell) {
            return res.status(404).json({ message: 'Célula não encontrada.' });
        }
        res.json(cell);
    } catch (err) {
        console.error('Erro ao obter célula:', err);
        res.status(500).json({ error: 'Erro ao obter célula.' });
    }
};

// Atualizar célula
exports.updateCell = async (req, res) => {
    const { id } = req.params;
    const { name, description, leader_id } = req.body;
    try {
        const cell = await Cell.findByPk(id);
        if (!cell) {
            return res.status(404).json({ message: 'Célula não encontrada.' });
        }

        if (leader_id) {
            const leader = await Leader.findByPk(leader_id);
            if (!leader) {
                return res.status(404).json({ message: 'Líder não encontrado.' });
            }
            cell.leader_id = leader_id;
        }

        cell.name = name || cell.name;
        cell.description = description || cell.description;
        await cell.save();

        res.json(cell);
    } catch (err) {
        console.error('Erro ao atualizar célula:', err);
        res.status(500).json({ error: 'Erro ao atualizar célula.' });
    }
};

// Remover célula
exports.deleteCell = async (req, res) => {
    const { id } = req.params;
    try {
        const cell = await Cell.findByPk(id);
        if (!cell) {
            return res.status(404).json({ message: 'Célula não encontrada.' });
        }

        await cell.destroy();
        res.json({ message: 'Célula removida com sucesso.' });
    } catch (err) {
        console.error('Erro ao remover célula:', err);
        res.status(500).json({ error: 'Erro ao remover célula.' });
    }
};

exports.addPersonToCell = async (req, res) => {
    const { cell_id, person_id, role } = req.body;

    try {
        const cell = await Cell.findByPk(cell_id);
        if (!cell) {
            return res.status(404).json({ message: 'Célula não encontrada.' });
        }

        const person = await People.findByPk(person_id);
        if (!person) {
            return res.status(404).json({ message: 'Pessoa não encontrada.' });
        }

        // Verifica se o papel é válido
        if (!['member', 'leader', 'assistant'].includes(role)) {
            return res.status(400).json({ message: 'Papel inválido. Use "member", "leader" ou "assistant".' });
        }

        // Adiciona a pessoa à célula com o papel especificado
        await CellPerson.create({ cell_id, person_id, role });

        res.status(201).json({ message: 'Pessoa adicionada à célula com sucesso.' });
    } catch (err) {
        console.error('Erro ao adicionar pessoa à célula:', err);
        res.status(500).json({ error: 'Erro ao adicionar pessoa à célula.' });
    }
};

exports.getCellMembers = async (req, res) => {
    const { cell_id } = req.params;

    try {
        const cell = await Cell.findByPk(cell_id, {
            include: [
                {
                    model: People,
                    as: 'members',
                    through: { attributes: ['role'] }, // Inclui o papel no resultado
                },
            ],
        });

        if (!cell) {
            return res.status(404).json({ message: 'Célula não encontrada.' });
        }

        res.json({
            cell: {
                id: cell.id,
                name: cell.name,
                description: cell.description,
            },
            members: cell.members.map((member) => ({
                id: member.id,
                name: member.name,
                role: member.CellPerson.role, // Papel do membro
            })),
        });
    } catch (err) {
        console.error('Erro ao listar membros da célula:', err);
        res.status(500).json({ error: 'Erro ao listar membros da célula.' });
    }
};

exports.addMultiplePeopleToCell = async (req, res) => {
    const { cell_id, people } = req.body;

    try {
        // Verifica se a célula existe
        const cell = await Cell.findByPk(cell_id);
        if (!cell) {
            return res.status(404).json({ message: 'Célula não encontrada.' });
        }

        // Validação e filtragem
        const personIds = people.map((p) => p.person_id);
        const validPeople = await People.findAll({
            where: { id: personIds },
        });

        if (validPeople.length !== personIds.length) {
            const missingIds = personIds.filter((id) => !validPeople.find((p) => p.id === id));
            return res.status(400).json({
                message: 'Algumas pessoas no array não foram encontradas.',
                missingIds,
            });
        }

        // Monta os dados para inserir na tabela de associação
        const cellPeopleData = people.map((p) => ({
            cell_id,
            person_id: p.person_id,
            role: p.role || 'member', // Default: "member" caso role não seja informado
        }));

        // Adiciona em massa as pessoas à célula
        await CellPerson.bulkCreate(cellPeopleData);

        res.status(201).json({
            message: 'Pessoas adicionadas à célula com sucesso.',
            addedPeople: cellPeopleData,
        });
    } catch (err) {
        console.error('Erro ao adicionar múltiplas pessoas à célula:', err);
        res.status(500).json({ error: 'Erro ao adicionar múltiplas pessoas à célula.' });
    }
};