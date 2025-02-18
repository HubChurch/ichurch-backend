const jwt = require("jsonwebtoken");

// 📌 Middleware para proteger rotas
exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ error: "Token não fornecido." });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // Adiciona o usuário ao request
        next();
    } catch (err) {
        res.status(401).json({ error: "Token inválido." });
    }
};
