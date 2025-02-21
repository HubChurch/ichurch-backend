const Ministry = require("../../models/ministry/Ministries");

/**
 * Cria um novo ministério vinculado ao usuário autenticado
 */
const createMinistry = async (req, res) => {
    try {
        const { name, description } = req.body;

        console.log('name')
        const ministry = await Ministry.create({
            company_id: req.company_id, // ✅ Define automaticamente o company_id
            name,
            description,
        });

        return res.status(201).json(ministry);
    } catch (error) {
        console.error("Erro ao criar ministério:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

/**
 * Lista todos os ministérios da empresa autenticada
 */
const getAllMinistries = async (req, res) => {
    try {
        const ministries = await Ministry.findAll({
            where: { company_id: req.company_id }, // ✅ Filtrando automaticamente pelo company_id
        });

        return res.json(ministries);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar ministérios" });
    }
};

/**
 * Obtém detalhes de um ministério pelo ID
 */
const getMinistryById = async (req, res) => {
    try {
        const { id } = req.params;

        const ministry = await Ministry.findOne({
            where: { id, company_id: req.company_id }, // ✅ Garante que pertence ao usuário
        });

        if (!ministry) {
            return res.status(404).json({ error: "Ministério não encontrado" });
        }

        return res.json(ministry);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao buscar ministério" });
    }
};

/**
 * Atualiza um ministério da empresa autenticada
 */
const updateMinistry = async (req, res) => {
    try {
        const { id } = req.params;

        const ministry = await Ministry.findOne({
            where: { id, company_id: req.company_id },
        });

        if (!ministry) {
            return res.status(404).json({ error: "Ministério não encontrado" });
        }

        await ministry.update(req.body);
        return res.json(ministry);
    } catch (error) {
        return res.status(500).json({ error: "Erro ao atualizar ministério" });
    }
};

/**
 * Remove um ministério da empresa autenticada
 */
const deleteMinistry = async (req, res) => {
    try {
        const { id } = req.params;

        const ministry = await Ministry.findOne({
            where: { id, company_id: req.company_id },
        });

        if (!ministry) {
            return res.status(404).json({ error: "Ministério não encontrado" });
        }

        await ministry.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: "Erro ao deletar ministério" });
    }
};

module.exports = {
    createMinistry,
    getAllMinistries,
    getMinistryById,
    updateMinistry,
    deleteMinistry,
};
