const CellMember = require("../../models/ministry/CellMembers");
const CellGroup = require("../../models/ministry/CellGroups");

/**
 * Adiciona uma pessoa a uma célula
 */
const addMemberToCell = async (req, res) => {
    try {
        const { cell_group_id, person_id, role } = req.body;

        const cellGroup = await CellGroup.findOne({
            where: { id: cell_group_id, company_id: req.company_id },
        });

        if (!cellGroup) {
            return res.status(404).json({ error: "Célula não encontrada ou não pertence à sua empresa" });
        }

        const member = await CellMember.create({
            company_id: req.company_id,
            cell_group_id,
            person_id,
            role,
        });

        return res.status(201).json(member);
    } catch (error) {
        console.error("Erro ao adicionar membro à célula:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

/**
 * Lista membros de uma célula
 */
const getMembersByCell = async (req, res) => {
    try {
        const { cell_group_id } = req.params;

        const cellGroup = await CellGroup.findOne({
            where: { id: cell_group_id, company_id: req.company_id },
        });

        if (!cellGroup) {
            return res.status(404).json({ error: "Célula não encontrada ou não pertence à sua empresa" });
        }

        const members = await CellMember.findAll({
            where: { cell_group_id },
        });

        return res.json(members);
    } catch (error) {
        console.error("Erro ao buscar membros da célula:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

/**
 * Atualiza papel ou status de membro
 */
const updateCellMember = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, status } = req.body;

        const member = await CellMember.findByPk(id);

        if (!member) {
            return res.status(404).json({ error: "Membro não encontrado" });
        }

        const cellGroup = await CellGroup.findOne({
            where: { id: member.cell_group_id, company_id: req.company_id },
        });

        if (!cellGroup) {
            return res.status(403).json({ error: "Acesso negado" });
        }

        await member.update({ role, status });
        return res.json(member);
    } catch (error) {
        console.error("Erro ao atualizar membro da célula:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

/**
 * Remove um membro da célula
 */
const removeMemberFromCell = async (req, res) => {
    try {
        const { id } = req.params;

        const member = await CellMember.findByPk(id);

        if (!member) {
            return res.status(404).json({ error: "Membro não encontrado" });
        }

        const cellGroup = await CellGroup.findOne({
            where: { id: member.cell_group_id, company_id: req.company_id },
        });

        if (!cellGroup) {
            return res.status(403).json({ error: "Acesso negado" });
        }

        await member.destroy();
        return res.status(204).send();
    } catch (error) {
        console.error("Erro ao remover membro da célula:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

module.exports = {
    addMemberToCell,
    getMembersByCell,
    updateCellMember,
    removeMemberFromCell,
};
