const express = require("express");
const {
    createCellGroup,
    getCellGroupsByMinistry,
} = require("../../controllers/ministry/cellGroupController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

/**
 * @route   POST /ministry/cell-groups/
 * @desc    Cria uma nova célula vinculada a um ministério
 * @access  Protegido
 */
router.post("/", authMiddleware, createCellGroup);

/**
 * @route   GET /ministry/cell-groups/:ministry_id
 * @desc    Lista todas as células de um ministério
 * @access  Protegido
 */
router.get("/:ministry_id", authMiddleware, getCellGroupsByMinistry);

router.get("/:id/details", authMiddleware, getCellGroupById);

router.put("/:id", authMiddleware, updateCellGroup);

module.exports = router;
