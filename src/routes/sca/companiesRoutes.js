const express = require("express");
const { createCompany, getAllCompanies, getCompanyById, updateCompany } = require("../../controllers/sca/companiesController");
const { authenticate } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/", createCompany);
router.get("/", authenticate, getAllCompanies);
router.get("/:id", authenticate, getCompanyById);
router.put("/:id", authenticate, updateCompany);

module.exports = router;
