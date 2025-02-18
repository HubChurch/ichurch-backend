const express = require("express");
const { getUserRoles, updateUserRoles, getRolePermissions } = require("../../controllers/sca/rolesController");
const { authenticate } = require("../../middlewares/authMiddleware");

const router = express.Router();

// 📌 Listar as Roles do Usuário Autenticado
router.get("/me", authenticate, getUserRoles);

// 📌 Atualizar Roles de um Usuário (Adicionar ou Remover) - Apenas Master
router.post("/update", authenticate, updateUserRoles);

// 📌 Listar permissões de uma Role
router.get("/:role_id/permissions", getRolePermissions);

module.exports = router;
