const MinistryMember = require("../../models/ministry/MinistryMember");
const Ministry = require("../../models/ministry/Ministries");
const {People} = require("../../models/community");

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
// Supondo que você tenha dois Sequelize instances:

const getMembersByMinistry = async (req, res) => {
    try {
        const { ministry_id } = req.params;

        // Verifica se o ministério pertence à empresa
        const ministry = await Ministry.findOne({
            where: { id: ministry_id, company_id: req.company_id },
        });

        if (!ministry) {
            return res.status(404).json({ error: 'Ministério não encontrado ou não pertence a você' });
        }

        // 1. Busca membros do ministério
        const members = await MinistryMember.findAll({
            where: { ministry_id, status: 'ativo' },
            attributes: ['id', 'person_id', 'role', 'status'],
        });

        const personIds = members.map((m) => m.person_id);

        if (personIds.length === 0) return res.json([]);

        // 2. Busca os dados das pessoas no outro banco
        const people = await People.findAll({
            where: { id: personIds },
            attributes: ['id', 'name', 'email', 'photo'],
        });

        const peopleMap = Object.fromEntries(people.map((p) => [p.id, p]));

        // 3. Merge manual: junta membros com dados das pessoas
        const enriched = members.map((member) => ({
            ...member.toJSON(),
            "id": member.person_id,
            "email": peopleMap[member.person_id]?.email || null,
            "name": peopleMap[member.person_id]?.name || "Usuário não encontrado",
            "photo": peopleMap[member.person_id]?.photo || null,
        }));

        return res.json(enriched);
    } catch (error) {
        console.error('Erro ao buscar membros do ministério:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
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
