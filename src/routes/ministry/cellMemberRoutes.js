const express = require("express");
const {
    addMemberToCell,
    getMembersByCell,
    updateCellMember,
    removeMemberFromCell,
} = require("../../controllers/ministry/cellMemberController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

/**
 * @route   POST /ministry/cell-members/
 * @desc    Adiciona uma pessoa a uma célula
 * @access  Protegido
 */
router.post("/", authMiddleware, addMemberToCell);

/**
 * @route   GET /ministry/cell-members/:cell_group_id
 * @desc    Lista os membros de uma célula
 * @access  Protegido
 */
router.get("/:cell_group_id", authMiddleware, getMembersByCell);

/**
 * @route   PATCH /ministry/cell-members/:id
 * @desc    Atualiza o papel ou status de um membro de célula
 * @access  Protegido
 */
router.patch("/:id", authMiddleware, updateCellMember);

/**
 * @route   DELETE /ministry/cell-members/:id
 * @desc    Remove um membro da célula
 * @access  Protegido
 */
router.delete("/:id", authMiddleware, removeMemberFromCell);

module.exports = router;
