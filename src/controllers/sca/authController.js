const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Users, Companies } = require("../../models/sca");
const { Logger } = require("../../service/logService");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    console.log('INICIANDO LOGIN');
    try {
        const user = await Users.findOne({ where: { email }, include: { model: Companies, as: "company" } });
        if (!user) return res.status(401).json({ error: "Usuário ou senha inválidos." });

        console.log(user)

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Usuário ou senha inválidos." });

        const token = jwt.sign(
            { id: user.id, company_id: user.company_id, is_master: user.id === user.company.owner_id },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );
        console.log('TOKEN GER', token);
        await Logger(user.id, "LOGIN", "/sca/auth/login", 200, "Usuário logou no sistema");

        res.json({ token, user });

    } catch (err) {
        console.error("Erro no login:", err);
        res.status(500).json({ error: "Erro ao realizar login." });
    }
};

exports.logout = async (req, res) => {
    try {
        await Logger(req.user.id, "LOGOUT", "/sca/auth/logout", 200);
        res.json({ message: "Logout realizado. Remova o token do frontend." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao realizar logout." });
    }
};

exports.getAuthenticatedUser = async (req, res) => {
    try {
        const user = await Users.findByPk(req.user.id, { include: { model: Companies, as: "company" } });
        if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar dados do usuário autenticado." });
    }
};
