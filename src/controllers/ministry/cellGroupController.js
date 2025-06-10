const CellGroup = require("../../models/ministry/CellGroups");
const Ministry = require("../../models/ministry/Ministries");
const {CellMember} = require("../../models/ministry");
const {People} = require("../../models/community");

/**
 * Cria uma nova célula vinculada a um ministério
 */
const createCellGroup = async (req, res) => {
    try {
        const { name, description, ministry_id, members } = req.body;

        const ministry = await Ministry.findOne({
            where: { id: ministry_id, company_id: req.company_id },
        });

        if (!ministry) {
            return res
                .status(404)
                .json({ error: "Ministério não encontrado ou não pertence a você" });
        }

        const cellGroup = await CellGroup.create({
            company_id: req.company_id,
            ministry_id,
            name,
            description,
        });

        // Verifica se membros foram enviados e cria as relações
        if (Array.isArray(members) && members.length > 0) {
            const cellMembersData = members.map((person_id) => ({
                cell_group_id: cellGroup.id,
                person_id,
                company_id: req.company_id,
            }));

            await CellMember.bulkCreate(cellMembersData);
        }

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



/**
 * @route   GET /ministry/cell-groups/:id/details
 * @desc    Retorna os dados de uma célula específica
 * @access  Protegido
 */

const getCellGroupById = async (req, res) => {
    try {
        const { id } = req.params;

        const cellGroup = await CellGroup.findOne({
            where: { id, company_id: req.company_id },
            include: [
                {
                    model: CellMember,
                    as: "members",
                },
            ],
        });

        if (!cellGroup) {
            return res.status(404).json({ error: "Célula não encontrada" });
        }

        const memberData = await Promise.all(
            cellGroup.members.map(async (member) => {
                const person = await People.findOne({
                    where: { id: member.person_id },
                    attributes: ["id", "name"],
                });

                return {
                    id: person?.id || member.person_id,
                    name: person?.name || "Desconhecido",
                    role: member.role,
                };
            })
        );

        const formatted = {
            id: cellGroup.id,
            name: cellGroup.name,
            description: cellGroup.description,
            members: memberData,
        };

        return res.status(200).json(formatted);
    } catch (error) {
        console.error("Erro ao buscar célula:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};


/**
 * @route   PUT /ministry/cell-groups/:id
 * @desc    Atualiza os dados de uma célula existente
 * @access  Protegido
 */
const updateCellGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, members } = req.body;

        const cellGroup = await CellGroup.findOne({
            where: { id, company_id: req.company_id },
        });

        if (!cellGroup) {
            return res.status(404).json({ error: "Célula não encontrada" });
        }

        // Atualiza nome e descrição
        cellGroup.name = name;
        cellGroup.description = description;
        await cellGroup.save();

        if (Array.isArray(members)) {
            // Remove todos os membros atuais
            await CellMember.destroy({
                where: { cell_group_id: id, company_id: req.company_id },
            });

            // Adiciona os novos membros
            const newMembers = members.map(({ id: person_id, role }) => ({
                company_id: req.company_id,
                cell_group_id: id,
                person_id,
                role,
            }));

            await CellMember.bulkCreate(newMembers);
        }

        return res.status(200).json({ message: "Célula atualizada com sucesso" });
    } catch (error) {
        console.error("Erro ao atualizar célula:", error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
};

module.exports = {
    createCellGroup,
    getCellGroupsByMinistry,
    updateCellGroup,
    getCellGroupById
};