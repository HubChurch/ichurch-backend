const MinistryMember = require("../../models/ministry/MinistryMember");
const Ministry = require("../../models/ministry/Ministries");

/**
 * Adiciona uma pessoa a um ministério da empresa autenticada
 */
const addMemberToMinistry = async (req, res) => {
    try {
        const { ministry_id, person_id, role } = req.body;

        // Verifica se o ministério pertence à empresa do usuário autenticado
        const ministry = await Ministry.findOne({
            where: { id: ministry_id, company_id: req.company_id },
        });

        if (!ministry) {
            return res.status(404).json({ error: "Ministério não encontrado ou não pertence a você" });
        }

        const ministryMember = await MinistryMember.create({
            ministry_id,
            person_id,
            role,
        });

        return res.status(201).json(ministryMember);
    } catch (error) {
        console.error("Erro ao adicionar membro ao ministério:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

/**
 * Lista todos os membros de um ministério da empresa autenticada
 */
const getMembersByMinistry = async (req, res) => {
    try {
        const { ministry_id } = req.params;

        // Verifica se o ministério pertence ao usuário autenticado
        const ministry = await Ministry.findOne({
            where: { id: ministry_id, company_id: req.company_id },
        });

        if (!ministry) {
            return res.status(404).json({ error: "Ministério não encontrado ou não pertence a você" });
        }

        const members = await MinistryMember.findAll({ where: { ministry_id } });
        return res.json(members);
    } catch (error) {
        console.error("Erro ao buscar membros do ministério:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

/**
 * Atualiza o papel ou status de um membro dentro de um ministério
 */
const updateMemberRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, status } = req.body;

        const member = await MinistryMember.findByPk(id);

        if (!member) {
            return res.status(404).json({ error: "Membro não encontrado" });
        }

        // Verifica se o ministério pertence à empresa do usuário autenticado
        const ministry = await Ministry.findOne({
            where: { id: member.ministry_id, company_id: req.company_id },
        });

        if (!ministry) {
            return res.status(403).json({ error: "Acesso negado" });
        }

        await member.update({ role, status });
        return res.json(member);
    } catch (error) {
        console.error("Erro ao atualizar membro:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

/**
 * Remove uma pessoa de um ministério da empresa autenticada
 */
const removeMemberFromMinistry = async (req, res) => {
    try {
        const { id } = req.params;

        const member = await MinistryMember.findByPk(id);

        if (!member) {
            return res.status(404).json({ error: "Membro não encontrado" });
        }

        // Verifica se o ministério pertence à empresa do usuário autenticado
        const ministry = await Ministry.findOne({
            where: { id: member.ministry_id, company_id: req.company_id },
        });

        if (!ministry) {
            return res.status(403).json({ error: "Acesso negado" });
        }

        await member.destroy();
        return res.status(204).send();
    } catch (error) {
        console.error("Erro ao remover membro:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

module.exports = {
    addMemberToMinistry,
    getMembersByMinistry,
    updateMemberRole,
    removeMemberFromMinistry,
};
