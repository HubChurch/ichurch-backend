const bcrypt = require("bcryptjs");
const { Users, Companies } = require("../../models/sca");
const {Logger} = require("../../service/logService");

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, company_id, is_master } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar usuário normalmente
        const user = await Users.create({ name, email, password: hashedPassword, company_id, is_master});

        // Se for o primeiro usuário (master), atualizar a empresa com o owner_id
        if (is_master) {
            await Companies.update({ owner_id: user.id }, { where: { id: company_id } });
        }

        res.status(201).json({ message: "Usuário criado com sucesso.", user });
    } catch (err) {
        console.error("Erro ao criar usuário:", err);
        res.status(500).json({ error: "Erro ao criar usuário." });
    }
};

// 📌 Listar todos os usuários de uma empresa
exports.getUsersByCompany = async (req, res) => {
    try {
        const users = await Users.findAll({ where: { company_id: req.params.company_id } });
        await Logger(req.user.id, "GET", "/sca/users", 200, "Listagem de usuários");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar usuários." });
    }
};
