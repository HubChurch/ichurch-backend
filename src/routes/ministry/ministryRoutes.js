const express = require("express");
const {
    createMinistry,
    getAllMinistries,
    getMinistryById,
    getAvailablePeopleToAdd,
    updateMinistry,
    deleteMinistry, updateMinistryMembers,
} = require("../../controllers/ministry/ministryController");
const authMiddleware = require("../../middlewares/authMiddleware");
const {getMembersByMinistry} = require("../../controllers/ministry/ministryMemberController");
const {getCellGroupsByMinistry} = require("../../controllers/ministry/cellGroupController");

const router = express.Router();

/**
 * @route   POST /ministry/ministries/
 * @desc    Cria um novo ministério
 * @access  Público (ou pode ser restrito conforme a lógica de autenticação)
 */
router.post("/", authMiddleware, createMinistry);

/**
 * @route   GET /ministry/ministries/
 * @desc    Lista todos os ministérios cadastrados
 * @access  Público
 */
router.get("/", authMiddleware, getAllMinistries);

/**
 * @route   GET /ministry/ministries/:id
 * @desc    Obtém os detalhes de um ministério pelo ID
 * @access  Público
 */
router.get("/:id", authMiddleware, getMinistryById);

/**
 * @route   PUT /ministry/ministries/:id
 * @desc    Atualiza os dados de um ministério pelo ID
 * @access  Público (ou pode ser restrito a administradores)
 */
router.put("/:id", authMiddleware, updateMinistry);

/**
 * @route   DELETE /ministry/ministries/:id
 * @desc    Exclui um ministério pelo ID (pode ser exclusão lógica ou física)
 * @access  Público (ou pode ser restrito conforme necessidade)
 */
router.delete("/:id", authMiddleware, deleteMinistry);


router.patch("/:id/members", authMiddleware, updateMinistryMembers );
router.get("/:ministry_id/members", authMiddleware, getMembersByMinistry );
router.get("/:ministry_id/cell_groups", authMiddleware, getCellGroupsByMinistry );
router.get("/:ministry_id/available-people", authMiddleware, getAvailablePeopleToAdd );


module.exports = router;
