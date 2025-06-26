const express = require("express");
const { createUser, getUsersByCompany, changePassword} = require("../../controllers/sca/userController");
const authMiddleware = require("../../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware,createUser);
router.get("/company/:company_id", authMiddleware, getUsersByCompany);
router.put("/change-password", authMiddleware, changePassword);
module.exports = router;
