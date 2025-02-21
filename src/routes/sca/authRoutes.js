const express = require("express");
const { login, logout, getauthMiddlewaredUser } = require("../../controllers/sca/authController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

// 📌 Rota para Login
router.post("/login", login);

// 📌 Rota para Logout (Opcional, pode ser apenas frontend removendo o token)
router.post("/logout", authMiddleware, logout);

// 📌 Rota para obter os dados do usuário autenticado
router.get("/me", authMiddleware, getauthMiddlewaredUser);

module.exports = router;
