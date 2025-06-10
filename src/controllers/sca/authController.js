const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {Users, Companies} = require("../../models/sca");
const {Logger} = require("../../service/logService");
const Ministries = require("../../models/ministry/Ministries");
const { People} = require("../../models/community");

exports.login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await Users.findOne({where: {email}, include: {model: Companies, as: "company"}});
        if (!user) return res.status(401).json({error: "Usuário ou senha inválidos."});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({error: "Usuário ou senha inválidos."});

        const people = await People.findOne({where : {user_id: user.id}});

        token = jwt.sign(
            {id: user.id, company_id: user.company_id, is_master: user.is_master, email: user.email, people_id: people?.id ?? undefined},
            process.env.JWT_SECRET,
            {expiresIn: "8h"}
        );
        await Logger(user.id, "LOGIN", "/sca/auth/login", 200, "Usuário logou no sistema");

        res.json({token, user});

    } catch (err) {
        console.error("Erro no login:", err);
        res.status(500).json({error: "Erro ao realizar login."});
    }
};

exports.logout = async (req, res) => {
    try {
        await Logger(req.user.id, "LOGOUT", "/sca/auth/logout", 200);
        res.json({message: "Logout realizado. Remova o token do frontend."});
    } catch (err) {
        res.status(500).json({error: "Erro ao realizar logout."});
    }
};

exports.getauthMiddlewaredUser = async (req, res) => {
    try {
        const user = await Users.findByPk(req.user.id, {include: {model: Companies, as: "company"}});
        if (!user) return res.status(404).json({error: "Usuário não encontrado."});

        res.json(user);
    } catch (err) {
        res.status(500).json({error: "Erro ao buscar dados do usuário autenticado."});
    }
};


exports.registerChurch = async (req, res) => {
    const {churchName, adminName, email, password} = req.body;

    try {
        // 🔍 Verificar se o email já está em uso por qualquer usuário
        const existingUser = await Users.findOne({where: {email}});
        if (existingUser) {
            return res.status(400).json({error: "Este email já está em uso por outro usuário."});
        }

        // 🔐 Criptografar senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // 🏢 Criar empresa (igreja)
        const company = await Companies.create({name: churchName, email});

        // 👤 Criar usuário master
        const user = await Users.create({
            name: adminName,
            email,
            password: hashedPassword,
            company_id: company.id,
            is_master: true,
        });

        // 🔁 Atualizar empresa com owner_id
        await company.update({owner_id: user.id});

        // ✝️ Criar ministério padrão com nome da igreja
        await Ministries.create({
            company_id: company.id,
            name: churchName,
            description: "Ministério padrão da igreja",
            type: "core",
        });


        res.status(201).json({message: "Igreja e usuário master criados com sucesso."});

    } catch (err) {
        console.error("Erro ao registrar igreja:", err);
        res.status(500).json({error: "Erro ao registrar igreja."});
    }
};
