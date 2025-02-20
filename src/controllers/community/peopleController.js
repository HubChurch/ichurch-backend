const { People } = require("../../models/community");
const {Logger} = require("../../service/logService");
const multer = require("multer");

const upload = multer({dest: "uploads/"});
// 📌 Criar uma nova pessoa
exports.createPerson = async (req, res) => {
    try {
        const person = await People.create({ ...req.body, company_id: req.user.company_id });
        await Logger(req.user.id, "CREATE", "/people", 201,{ ...req.body, company_id: req.user.company_id });
        res.status(201).json(person);
    } catch (err) {
        await Logger(req.user.id, "CREATE", "/people", 500,err.toString());
        res.status(500).json({ error: "Erro ao criar pessoa." });
    }
};

// 📌 Listar todas as pessoas ativas de uma empresa
exports.getAllPeople = async (req, res) => {
    try {
        console.log('procurando pessoas')
        console.log(req.user.company_id)
        const people = await People.findAll({
            where: { company_id: req.user.company_id, status: "active" }
        });
        console.log(people)
        await Logger(req.user.id, "GET", "/people", 200);
        res.json(people);
    } catch (err) {
        await Logger(req.user.id, "GET", "/people", 500,err.toString());
        res.status(500).json({ error: "Erro ao buscar pessoas." });
    }
};

// 📌 Buscar uma pessoa pelo ID
exports.getPersonById = async (req, res) => {
    try {
        const person = await People.findOne({ where: { id: req.params.id, company_id: req.user.company_id } });
        if (!person) return res.status(404).json({ error: "Pessoa não encontrada." });
        await Logger(req.user.id, "GET", "/people/:id", 200);
        res.json(person);
    } catch (err) {
        await Logger(req.user.id, "GET", "/people/:id", 500,err.toString());
        res.status(500).json({ error: "Erro ao buscar pessoa." });
    }
};

// 📌 Atualizar pessoa
exports.updatePerson = async (req, res) => {
    try {
        const updated = await People.update(req.body, { where: { id: req.params.id, company_id: req.user.company_id } });
        if (!updated[0]) return res.status(404).json({ error: "Pessoa não encontrada." });
        await Logger(req.user.id, "UPDATE", "/people/:id", 200);
        res.json({ message: "Pessoa atualizada com sucesso." });
    } catch (err) {
        await Logger(req.user.id, "UPDATE", "/people/:id", 500,err.toString());
        res.status(500).json({ error: "Erro ao atualizar pessoa." });
    }
};

// 📌 Exclusão lógica (Desativar pessoa)
exports.deactivatePerson = async (req, res) => {
    try {
        const updated = await People.update({ status: "inactive" }, { where: { id: req.params.id, company_id: req.user.company_id } });
        if (!updated[0]) return res.status(404).json({ error: "Pessoa não encontrada." });
        await Logger(req.user.id, "DELETE", "/people/:id", 200);
        res.json({ message: "Pessoa desativada com sucesso." });
    } catch (err) {
        await Logger(req.user.id, "DELETE", "/people/:id", 500,err.toString());
        res.status(500).json({ error: "Erro ao desativar pessoa." });
    }
};

// 📌 Alternar o status de uma pessoa (Ativar/Inativar)
exports.togglePersonStatus = async (req, res) => {
    try {
        const person = await People.findOne({ where: { id: req.params.id, company_id: req.user.company_id } });

        if (!person) {
            return res.status(404).json({ error: "Pessoa não encontrada." });
        }

        const newStatus = person.status === "active" ? "inactive" : "active";
        await People.update({ status: newStatus }, { where: { id: req.params.id } });

        await Logger(req.user.id, "PATCH", "/people/:id/toggle-status", 200, { id: req.params.id, newStatus });

        res.json({ message: `Pessoa ${newStatus === "active" ? "ativada" : "desativada"} com sucesso.` });
    } catch (err) {
        await Logger(req.user.id, "PATCH", "/people/:id/toggle-status", 500, err.toString());
        res.status(500).json({ error: "Erro ao alternar status da pessoa." });
    }
};

// 📌 Importar pessoas a partir de um arquivo Excel
exports.importPeopleFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Nenhum arquivo enviado." });
        }

        // 🔥 Aqui seria o processamento do Excel (por exemplo, usando xlsx ou papaparse)
        console.log("Arquivo recebido:", req.file.filename);

        await Logger(req.user.id, "POST", "/people/import", 200, { filename: req.file.filename });

        res.status(200).json({ message: "Arquivo recebido e processado com sucesso." });
    } catch (err) {
        await Logger(req.user.id, "POST", "/people/import", 500, err.toString());
        res.status(500).json({ error: "Erro ao importar pessoas." });
    }
};

exports.uploadMiddleware = upload.single("file");
