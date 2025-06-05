const express = require("express");
const { login, logout, getauthMiddlewaredUser,registerChurch } = require("../../controllers/sca/authController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

// 📌 Rota para Login
router.post("/login", login);

// 📌 Rota para Logout (Opcional, pode ser apenas frontend removendo o token)
router.post("/logout", authMiddleware, logout);

// 📌 Rota para obter os dados do usuário autenticado
router.get("/me", authMiddleware, getauthMiddlewaredUser);

// 📌 Rota para registrar uma nova igreja (ainda não implementada)
router.post("/register-church", registerChurch);
module.exports = router;
