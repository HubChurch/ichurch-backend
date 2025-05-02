const CellGroup = require("../../models/ministry/CellGroups");
const Ministry = require("../../models/ministry/Ministries");

/**
 * Cria uma nova célula vinculada a um ministério
 */
const createCellGroup = async (req, res) => {
    try {
        const { name, description, ministry_id } = req.body;

        const ministry = await Ministry.findOne({
            where: { id: ministry_id, company_id: req.company_id },
        });

        if (!ministry) {
            return res.status(404).json({ error: "Ministério não encontrado ou não pertence a você" });
        }

        const cellGroup = await CellGroup.create({
            company_id: req.company_id,
            ministry_id,
            name,
            description,
        });

        return res.status(201).json(cellGroup);
    } catch (error) {
        console.error("Erro ao criar célula:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

/**
 * Lista todas as células de um ministério
 */
const getCellGroupsByMinistry = async (req, res) => {
    try {
        const { ministry_id } = req.params;

        const ministry = await Ministry.findOne({
            where: { id: ministry_id, company_id: req.company_id },
        });

        if (!ministry) {
            return res.status(404).json({ error: "Ministério não encontrado ou não pertence a você" });
        }

        const cells = await CellGroup.findAll({
            where: { ministry_id },
        });

        return res.json(cells);
    } catch (error) {
        console.error("Erro ao buscar células:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

module.exports = {
    createCellGroup,
    getCellGroupsByMinistry,
};