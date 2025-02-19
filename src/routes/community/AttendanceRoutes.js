const express = require("express");
const router = express.Router();
const attendanceController = require("../../controllers/community/attendanceController");
const { authenticate } = require("../../middlewares/authMiddleware");

// 📌 Registrar presença individual
router.post("/", authenticate, attendanceController.markAttendance);

// 📌 Registrar presença para múltiplas pessoas
router.post("/mark-multiple", authenticate, attendanceController.markMultipleAttendance);

// 📌 Listar presenças por evento
router.get("/event/:event_id", authenticate, attendanceController.getAttendanceByEvent);

// 📌 Atualizar presença de uma pessoa em um evento
router.put("/:id", authenticate, attendanceController.updateAttendance);

router.get('/by-event',authenticate, attendanceController.getAttendanceByEvent);
router.get('/by-person',authenticate, attendanceController.getAttendanceByPerson);

router.post('/toggle',authenticate, attendanceController.toggleAttendance);
module.exports = router;
