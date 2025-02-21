const express = require("express");
const { getUserPermissions } = require("../../controllers/sca/permissionsController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

// 📌 Listar as Permissões do Usuário Autenticado
router.get("/me", authMiddleware, getUserPermissions);

module.exports = router;
