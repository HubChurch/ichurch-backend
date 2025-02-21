const express = require("express");
const { createUser, getUsersByCompany } = require("../../controllers/sca/userController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/", createUser);
router.get("/company/:company_id", authMiddleware, getUsersByCompany);

module.exports = router;
