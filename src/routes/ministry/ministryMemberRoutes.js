const express = require("express");
const {
    addMemberToMinistry,
    getMembersByMinistry,
    updateMemberRole,
    removeMemberFromMinistry,
    addMembersToMinistryBulk
} = require("../../controllers/ministry/ministryMemberController");
const authMiddleware  = require("../../middlewares/authMiddleware");

const router = express.Router();

/**
 * @route   POST /ministry/members/
 * @desc    Adiciona uma pessoa a um ministério
 * @access  Público (ou pode ser restrito)
 */
router.post("/",authMiddleware, addMemberToMinistry);

/**
 * @route   GET /ministry/members/:ministry_id
 * @desc    Lista os membros de um ministério específico
 * @access  Público
 */
router.get("/:ministry_id",authMiddleware, getMembersByMinistry);

router.patch("/", authMiddleware, updateMemberRole);

/**
 * @route   DELETE /ministry/members/:id
 * @desc    Remove uma pessoa do ministério
 * @access  Público (ou pode ser restrito)
 */
router.delete("/:id",authMiddleware, removeMemberFromMinistry);


router.post("/bulk", authMiddleware, addMembersToMinistryBulk);
module.exports = router;
