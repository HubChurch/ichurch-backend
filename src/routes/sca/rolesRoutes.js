const express = require("express");
const { getUserRoles, updateUserRoles, getRolePermissions } = require("../../controllers/sca/rolesController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

// 📌 Listar as Roles do Usuário Autenticado
router.get("/me", authMiddleware, getUserRoles);

// 📌 Atualizar Roles de um Usuário (Adicionar ou Remover) - Apenas Master
router.post("/update", authMiddleware, updateUserRoles);

// 📌 Listar permissões de uma Role
router.get("/:role_id/permissions", getRolePermissions);

module.exports = router;
