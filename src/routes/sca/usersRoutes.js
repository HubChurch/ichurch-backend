const express = require("express");
const { createUser, getUsersByCompany } = require("../../controllers/sca/userController");
const { authenticate } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/", createUser);
router.get("/company/:company_id", authenticate, getUsersByCompany);

module.exports = router;
