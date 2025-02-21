const jwt = require("jsonwebtoken");

/**
 * 📌 Middleware para autenticação e extração do `company_id`
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido." });
    }

    const token = authHeader.split(" ")[1]; // O formato esperado é "Bearer <TOKEN>"

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica o token

        if (!decoded.company_id) {
            return res.status(403).json({ error: "Usuário não vinculado a uma empresa válida." });
        }

        req.user = decoded; // Adiciona os dados do usuário ao request
        req.company_id = decoded.company_id; // ✅ Adiciona `company_id` automaticamente a todas as requisições

        next(); // Passa para o próximo middleware/controller
    } catch (err) {
        console.error("Erro na autenticação:", err);
        return res.status(401).json({ error: "Token inválido ou expirado." });
    }
};

module.exports = authMiddleware;
