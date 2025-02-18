const { People } = require("../../models/community");
const {Logger} = require("../../service/logService");

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
        const people = await People.findAll({
            where: { company_id: req.user.company_id, status: "active" }
        });
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
