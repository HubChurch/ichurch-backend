const express = require("express");
const { login, logout, getAuthenticatedUser } = require("../../controllers/sca/authController");
const { authenticate } = require("../../middlewares/authMiddleware");

const router = express.Router();

// 📌 Rota para Login
router.post("/login", login);

// 📌 Rota para Logout (Opcional, pode ser apenas frontend removendo o token)
router.post("/logout", authenticate, logout);

// 📌 Rota para obter os dados do usuário autenticado
router.get("/me", authenticate, getAuthenticatedUser);

module.exports = router;
