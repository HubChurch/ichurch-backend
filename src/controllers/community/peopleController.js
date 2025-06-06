const {People} = require("../../models/community");
const {Logger} = require("../../service/logService");
const multer = require("multer");

const upload = multer({dest: "uploads/"});
// 📌 Criar uma nova pessoa
const uploadToS3 = require("../../utils/uploadService");
const Ministries = require("../../models/ministry/Ministries");
const {ministryDB} = require("../../config/db");
const {MinistryMember} = require("../../models/ministry");

exports.createPerson = async (req, res) => {
    try {
        const { photo, ...personData } = req.body;
        let imageUrl = null;

        // Upload imagem se houver
        if (req.file) {
            try {
                imageUrl = await uploadToS3(req.file, 'profile', personData.name);
            } catch (uploadError) {
                console.error("Erro ao fazer upload da imagem:", uploadError);
                return res.status(500).json({ error: "Erro ao enviar imagem para o S3." });
            }
        }

        // Cria pessoa
        const person = await People.create({
            ...personData,
            company_id: req.user.company_id,
            photo: imageUrl || null,
        });

        // Busca o ministério core da empresa
        const coreMinistry = await Ministries.findOne({
            where: {
                company_id: req.user.company_id,
                type: 'core',
            },
        });

        if (coreMinistry) {
            // Associa a pessoa ao ministério core como MEMBER
            await MinistryMember.create({
                ministry_id: coreMinistry.id,
                person_id: person.id,
                role: 'MEMBER',
                status: 'ativo',
                created_at: new Date(),
                updated_at: new Date(),
            });
        } else {
            console.warn(`Ministério core não encontrado para empresa ${req.user.company_id}`);
        }

        await Logger(req.user.id, "CREATE", "/people", 201, {
            ...req.body,
            company_id: req.user.company_id,
        }.toString());

        res.status(201).json(person);
    } catch (err) {
        await Logger(req.user.id, "CREATE", "/people", 500, err.toString());
        console.log(err)
        res.status(500).json({ error: err });
    }
};


// 📌 Listar todas as pessoas ativas de uma empresa
exports.getAllPeople = async (req, res) => {
    try {
        const {status} = req.query;
        const whereCondition = {company_id: req.user.company_id};

        if (status) {
            whereCondition.status = status;
        }

        const peopleRaw = await People.findAll({
            where: whereCondition,
            attributes: ['id', 'name', 'email', 'status', 'photo', 'user_id'],
        });

        const people = peopleRaw.map(person => ({
            ...person.toJSON(),
            hasAccount: !!person.user_id,
        }));

        await Logger(req.user.id, "GET", "/people", 200);
        res.json(people);
    } catch (err) {
        await Logger(req.user.id, "GET", "/people", 500, err.toString());
        res.status(500).json({error: "Erro ao buscar pessoas."});
    }
};

exports.getPersonById = async (req, res) => {
    try {
        // 1 - Buscar a pessoa no banco community
        const person = await People.findOne({
            where: {id: req.params.id, company_id: req.user.company_id},
            raw: true,  // traz um objeto plano para facilitar a montagem depois
        });

        if (!person) return res.status(404).json({error: "Pessoa não encontrada."});

        // 2 - Buscar os ministérios da pessoa no banco ministry usando raw query ou modelo ministry
        // Exemplo usando raw query no ministryDB Sequelize:

        const ministriesQuery = `
            SELECT m.id, m.name, m.description, mm.role, mm.status
            FROM ministry.ministries m
                     INNER JOIN ministry.ministry_members mm ON mm.ministry_id = m.id
            WHERE mm.person_id = :personId
              AND mm.status = 'ativo'
        `;

        console.log(ministriesQuery)

        const ministries = await ministryDB.query(ministriesQuery, {
            replacements: {personId: req.params.id},
            type: ministryDB.QueryTypes.SELECT,
        });

        // 3 - Montar resposta incluindo ministérios
        const personWithMinistries = {
            ...person,
            ministries: ministries,
        };

        await Logger(req.user.id, "GET", "/people/:id", 200);
        res.json(personWithMinistries);
    } catch (err) {
        await Logger(req.user.id, "GET", "/people/:id", 500, err.toString());
        res.status(500).json({error: "Erro ao buscar pessoa."});
    }
};

// 📌 Atualizar pessoa
exports.updatePerson = async (req, res) => {
    try {
        let imageUrl = null;

        // 📌 Se houver uma nova imagem, faz upload para o S3
        if (req.file) {
            try {
                imageUrl = await uploadToS3(req.file, "profile", req.body.name);
            } catch (uploadError) {
                console.error("Erro ao enviar imagem para o S3:", uploadError);
                return res.status(500).json({error: "Erro ao enviar imagem para o S3."});
            }
        }

        // 📌 Atualiza os dados da pessoa
        const updatedData = {...req.body};
        if (imageUrl) updatedData.photo = imageUrl; // 🔥 Atualiza a foto apenas se houver uma nova

        const [updated] = await People.update(updatedData, {
            where: {id: req.params.id, company_id: req.user.company_id},
        });

        if (!updated) return res.status(404).json({error: "Pessoa não encontrada."});

        await Logger(req.user.id, "UPDATE", "/people/:id", 200);
        res.json({message: "Pessoa atualizada com sucesso."});
    } catch (err) {
        await Logger(req.user.id, "UPDATE", "/people/:id", 500, err.toString());
        res.status(500).json({error: `Erro ao atualizar pessoa. - ${err.toString()}`});
    }
};

// 📌 Exclusão lógica (Desativar pessoa)
exports.deactivatePerson = async (req, res) => {
    try {
        const updated = await People.update({status: "inactive"}, {
            where: {
                id: req.params.id,
                company_id: req.user.company_id
            }
        });
        if (!updated[0]) return res.status(404).json({error: "Pessoa não encontrada."});
        await Logger(req.user.id, "DELETE", "/people/:id", 200);
        res.json({message: "Pessoa desativada com sucesso."});
    } catch (err) {
        await Logger(req.user.id, "DELETE", "/people/:id", 500, err.toString());
        res.status(500).json({error: "Erro ao desativar pessoa."});
    }
};

// 📌 Alternar o status de uma pessoa (Ativar/Inativar)
exports.togglePersonStatus = async (req, res) => {
    try {
        const person = await People.findOne({where: {id: req.params.id, company_id: req.user.company_id}});

        if (!person) {
            return res.status(404).json({error: "Pessoa não encontrada."});
        }

        const newStatus = person.status === "active" ? "inactive" : "active";
        await People.update({status: newStatus}, {where: {id: req.params.id}});

        await Logger(req.user.id, "PATCH", "/people/:id/toggle-status", 200, {id: req.params.id, newStatus});

        res.json({message: `Pessoa ${newStatus === "active" ? "ativada" : "desativada"} com sucesso.`});
    } catch (err) {
        await Logger(req.user.id, "PATCH", "/people/:id/toggle-status", 500, err.toString());
        res.status(500).json({error: "Erro ao alternar status da pessoa."});
    }
};

// 📌 Importar pessoas a partir de um arquivo Excel
exports.importPeopleFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: "Nenhum arquivo enviado."});
        }

        // 🔥 Aqui seria o processamento do Excel (por exemplo, usando xlsx ou papaparse)
        await Logger(req.user.id, "POST", "/people/import", 200, {filename: req.file.filename});

        res.status(200).json({message: "Arquivo recebido e processado com sucesso."});
    } catch (err) {
        await Logger(req.user.id, "POST", "/people/import", 500, err.toString());
        res.status(500).json({error: "Erro ao importar pessoas."});
    }
};

exports.uploadMiddleware = upload.single("file");
