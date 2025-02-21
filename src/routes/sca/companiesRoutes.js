const express = require("express");
const { createCompany, getAllCompanies, getCompanyById, updateCompany } = require("../../controllers/sca/companiesController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/", createCompany);
router.get("/", authMiddleware, getAllCompanies);
router.get("/:id", authMiddleware, getCompanyById);
router.put("/:id", authMiddleware, updateCompany);

module.exports = router;
