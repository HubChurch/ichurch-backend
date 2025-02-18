const { People } = require("../../models/community");

// 📌 Criar uma nova pessoa
exports.createPerson = async (req, res) => {
    try {
        const person = await People.create({ ...req.body, company_id: req.user.company_id });
        res.status(201).json(person);
    } catch (err) {
        console.error("Erro ao criar pessoa:", err);
        res.status(500).json({ error: "Erro ao criar pessoa." });
    }
};

// 📌 Listar todas as pessoas ativas de uma empresa
exports.getAllPeople = async (req, res) => {
    try {
        const people = await People.findAll({
            where: { company_id: req.user.company_id, status: "active" }
        });
        res.json(people);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar pessoas." });
    }
};

// 📌 Buscar uma pessoa pelo ID
exports.getPersonById = async (req, res) => {
    try {
        const person = await People.findOne({ where: { id: req.params.id, company_id: req.user.company_id } });
        if (!person) return res.status(404).json({ error: "Pessoa não encontrada." });
        res.json(person);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar pessoa." });
    }
};

// 📌 Atualizar pessoa
exports.updatePerson = async (req, res) => {
    try {
        const updated = await People.update(req.body, { where: { id: req.params.id, company_id: req.user.company_id } });
        if (!updated[0]) return res.status(404).json({ error: "Pessoa não encontrada." });
        res.json({ message: "Pessoa atualizada com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar pessoa." });
    }
};

// 📌 Exclusão lógica (Desativar pessoa)
exports.deactivatePerson = async (req, res) => {
    try {
        const updated = await People.update({ status: "inactive" }, { where: { id: req.params.id, company_id: req.user.company_id } });
        if (!updated[0]) return res.status(404).json({ error: "Pessoa não encontrada." });
        res.json({ message: "Pessoa desativada com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao desativar pessoa." });
    }
};
