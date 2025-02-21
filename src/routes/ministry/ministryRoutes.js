const express = require("express");
const {
    createMinistry,
    getAllMinistries,
    getMinistryById,
    updateMinistry,
    deleteMinistry,
} = require("../../controllers/ministry/ministryController");
const authMiddleware = require("../../middlewares/authMiddleware");

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

module.exports = router;
