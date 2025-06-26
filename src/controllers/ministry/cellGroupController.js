const CellGroup = require("../../models/ministry/CellGroups");
const Ministry = require("../../models/ministry/Ministries");
const {CellMember, MinistryMember} = require("../../models/ministry");
const {People} = require("../../models/community");
const { Op } = require("sequelize");
const {communityDB} = require("../../models");

/**
 * Cria uma nova célula vinculada a um ministério
 */
const createCellGroup = async (req, res) => {
    try {
        const { name, description, ministry_id, members ,config} = req.body;

        if (!name?.trim()) {
            return res.status(400).json({ error: "O nome da célula é obrigatório." });
        }

        const ministry = await Ministry.findOne({
            where: { id: ministry_id, company_id: req.company_id },
        });

        if (!ministry) {
            return res
                .status(404)
                .json({ error: "Ministério não encontrado ou não pertence a você." });
        }

        const cellGroup = await CellGroup.create({
            company_id: req.company_id,
            ministry_id,
            name,
            description,
            config: config || null,
        });

        // Criar relações com membros se fornecidos
        if (Array.isArray(members) && members.length > 0) {
            const memberIds = members.filter((id) => typeof id === "string");

            const cellMembersData = memberIds.map((person_id) => ({
                cell_group_id: cellGroup.id,
                person_id,
                company_id: req.company_id,
            }));

            await CellMember.bulkCreate(cellMembersData);
        }

        return res.status(201).json({ message: "Célula criada com sucesso", cellGroup });
    } catch (error) {
        console.error("Erro ao criar célula:", error);
        return res.status(500).json({ error: "Erro ao criar célula." });
    }
};


const getCellGroupsByMinistry = async (req, res) => {
    try {
        const { ministry_id } = req.params;

        const ministry = await Ministry.findOne({
            where: { id: ministry_id, company_id: req.company_id },
        });

        if (!ministry) {
            return res.status(404).json({ error: "Ministério não encontrado ou não pertence a você" });
        }

        // 1. Busca todas as células
        const cells = await CellGroup.findAll({
            where: { ministry_id },
            raw: true,
        });

        const cellGroupIds = cells.map((c) => c.id);
        if (cellGroupIds.length === 0) return res.json([]);

        // 2. Busca todos os membros dessas células
        const members = await CellMember.findAll({
            where: { cell_group_id: { [Op.in]: cellGroupIds } },
            raw: true,
        });

        // 3. Coleta todos os person_ids únicos
        const personIds = [...new Set(members.map((m) => m.person_id))];
        if (personIds.length === 0) {
            return res.json(cells.map((cell) => ({
                ...cell,
                totalMembers: 0,
                leader: null,
            })));
        }

        // 4. Consulta manual na outra base (schema `community`, por exemplo)
        const people = await communityDB.query(
            `
    SELECT id, name, photo
    FROM community.people
    WHERE id IN (:ids)
  `,
            {
                replacements: { ids: personIds },
                type: communityDB.QueryTypes.SELECT,
            }
        );

        const peopleMap = Object.fromEntries(people.map((p) => [p.id, p]));

        // 5. Organiza os dados finais
        const response = cells.map((cell) => {
            const cellMembers = members.filter((m) => m.cell_group_id === cell.id);
            const leader = cellMembers.find((m) => m.role === "LEADER" || m.role === "AUX");
            const leaderInfo = leader ? peopleMap[leader.person_id] || null : null;

            return {
                ...cell,
                totalMembers: cellMembers.length,
                leader: leaderInfo,
            };
        });

        return res.json(response);
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
                    attributes: ["id", "name", "photo"],
                });

                const ministryMember = await MinistryMember.findOne({
                    where: {
                        person_id: member.person_id,
                        ministry_id: cellGroup.ministry_id,
                    },
                    attributes: ["role"],
                });

                return {
                    id: person?.id || member.person_id,
                    name: person?.name || "Desconhecido",
                    photo: person?.photo || null,
                    role: ministryMember?.role || "MEMBER", // fallback
                };
            })
        );

        const formatted = {
            id: cellGroup.id,
            name: cellGroup.name,
            config: cellGroup.config,
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
        const { name, description, members,config } = req.body;

        const cellGroup = await CellGroup.findOne({
            where: { id, company_id: req.company_id },
        });

        if (!cellGroup) {
            return res.status(404).json({ error: "Célula não encontrada" });
        }

        // Atualiza nome e descrição
        cellGroup.name = name;
        cellGroup.description = description;
        if (config) cellGroup.config = config;
        await cellGroup.save();

        if (Array.isArray(members)) {
            // Remove membros antigos
            await CellMember.destroy({
                where: { cell_group_id: id, company_id: req.company_id },
            });

            // Cria novas relações com os membros
            const newMembers = members.map((person_id) => ({
                company_id: req.company_id,
                cell_group_id: id,
                person_id,
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