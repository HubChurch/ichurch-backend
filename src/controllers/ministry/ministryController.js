const Ministry = require("../../models/ministry/Ministries");
const {Sequelize} = require("sequelize");
const {MinistryMember} = require("../../models/ministry");
const {getPeopleByIds} = require("../community/peopleController");
const {fetchPeopleByIds} = require("../../service/peopleService");

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
        const {name, description, type, visibility, plugins} = req.body;

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
        return res.status(500).json({error: "Erro interno do servidor"});
    }
};

/**
 * Lista todos os ministérios da empresa autenticada
 */

const getAllMinistries = async (req, res) => {
    try {
        const ministries = await Ministry.findAll({
            where: {company_id: req.company_id},
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(
        SELECT COUNT(*)
        FROM ministry_members AS mm
        WHERE
          mm.ministry_id = ministry.id
          AND mm.status = 'ativo'
      )`),
                        'peopleCount'
                    ],
                    [
                        Sequelize.literal(`(
        SELECT COUNT(*)
        FROM ministry_members AS mm
        WHERE
          mm.ministry_id = ministry.id
          AND mm.status = 'ativo'
          AND mm.role = 'LEADER'
      )`),
                        'leadersCount'
                    ],
                    [
                        Sequelize.literal(`(
        SELECT COUNT(*)
        FROM ministry_members AS mm
        WHERE
          mm.ministry_id = ministry.id
          AND mm.status = 'ativo'
          AND mm.role = 'AUX'
      )`),
                        'auxCount'
                    ],
                    [
                        Sequelize.literal(`(
        SELECT COUNT(*)
        FROM ministry_members AS mm
        WHERE
          mm.ministry_id = ministry.id
          AND mm.status = 'ativo'
          AND mm.role = 'MEMBER'
      )`),
                        'membersCount'
                    ],
                ],
            },

            order: [
                [Sequelize.literal(`type = 'core'`), 'DESC'],
                ['name', 'ASC'],
            ],
        });
        return res.json(ministries);
    } catch (error) {
        console.error(error);
        return res.status(500).json({error: "Erro ao buscar ministérios"});
    }
};


const getMinistryById = async (req, res) => {
    try {
        const { id } = req.params;

        // Busca ministério e membros (sem dados da pessoa)
        const ministry = await Ministry.findOne({
            where: {
                id,
                company_id: req.company_id,
            },
            include: [
                {
                    model: MinistryMember,
                    as: "members",
                    required: false,
                    where: { status: "ativo" },
                    attributes: ["id", "person_id", "role"],
                },
            ],
        });

        if (!ministry) {
            return res.status(404).json({ error: "Ministério não encontrado" });
        }

        const memberRecords = ministry.members || [];
        const personIds = memberRecords.map(m => m.person_id);
        let peopleData = [];


        if (personIds.length > 0) {
            peopleData = await fetchPeopleByIds(personIds, req.company_id);
        }

        // Montar membros juntando dados de pessoas
        const members = memberRecords.map(m => {
            const person = peopleData.find(p => p.id === m.person_id);
            return {
                id: person?.id ?? m.person_id,
                name: person?.name ?? "Usuário não encontrado",
                role: m.role,
                photo: person?.photo ?? null,
            };
        });

        return res.json({
            id: ministry.id,
            name: ministry.name,
            description: ministry.description,
            type: ministry.type,
            visibility: ministry.visibility,
            code: ministry.code,
            members,
        });
    } catch (error) {
        console.error("Erro no getMinistryById:", error);
        return res.status(500).json({ error: "Erro ao buscar ministério" });
    }
};

/**
 * Atualiza um ministério da empresa autenticada
 */
const updateMinistry = async (req, res) => {
    try {
        const {id} = req.params;

        const ministry = await Ministry.findOne({
            where: {id, company_id: req.company_id},
        });

        if (!ministry) {
            return res.status(404).json({error: "Ministério não encontrado"});
        }

        await ministry.update(req.body);
        return res.json(ministry);
    } catch (error) {
        return res.status(500).json({error: "Erro ao atualizar ministério"});
    }
};

/**
 * Remove um ministério da empresa autenticada
 */
const deleteMinistry = async (req, res) => {
    try {
        const {id} = req.params;

        const ministry = await Ministry.findOne({
            where: {id, company_id: req.company_id},
        });

        if (!ministry) {
            return res.status(404).json({error: "Ministério não encontrado"});
        }

        await ministry.destroy();
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({error: "Erro ao deletar ministério"});
    }
};

const updateMinistryMembers = async (req, res) => {
    const { id } = req.params;
    const { members } = req.body; // array de { id, role }

    if (!Array.isArray(members)) {
        return res.status(400).json({ error: "Formato inválido para membros." });
    }

    try {
        // Remove todos os membros antigos
        await MinistryMember.destroy({ where: { ministry_id: id } });

        // Cria nova lista com os dados recebidos
        const newMembers = members.map(({ id: person_id, role }) => ({
            ministry_id: id,
            person_id,
            role: role || "MEMBER", // role padrão
            status: "ativo",
            created_at: new Date(),
            updated_at: new Date(),
        }));

        // Insere os novos membros
        await MinistryMember.bulkCreate(newMembers);

        res.status(200).json({ message: "Membros atualizados com sucesso." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao atualizar membros." });
    }
};


module.exports = {
    createMinistry,
    getAllMinistries,
    getMinistryById,
    updateMinistry,
    deleteMinistry,
    updateMinistryMembers
};
