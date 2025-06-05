const Ministry = require("../../models/ministry/Ministries");
const {Sequelize} = require("sequelize");

/**
 * Cria um novo ministério vinculado ao usuário autenticado
 */
const createMinistry = async (req, res) => {
    function generateCode(length = 5) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < length; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }


    try {
        const { name, description, type, visibility, plugins } = req.body;

        const code = (visibility === "private" || visibility === "secret")
            ? generateCode()
            : null;

        const ministry = await Ministry.create({
            company_id: req.company_id,
            name,
            description,
            type,
            visibility,
            code,
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
            where: { company_id: req.company_id },
            order: [
                [Sequelize.literal(`type = 'core'`), 'DESC'],
                ['name', 'ASC'],
            ],
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
