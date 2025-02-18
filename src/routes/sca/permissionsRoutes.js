const express = require("express");
const { getUserPermissions } = require("../../controllers/sca/permissionsController");
const { authenticate } = require("../../middlewares/authMiddleware");

const router = express.Router();

// 📌 Listar as Permissões do Usuário Autenticado
router.get("/me", authenticate, getUserPermissions);

module.exports = router;
