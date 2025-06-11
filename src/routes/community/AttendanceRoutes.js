const express = require("express");
const router = express.Router();
const attendanceController = require("../../controllers/community/attendanceController");
const authMiddleware = require("../../middlewares/authMiddleware");

// 📌 Registrar presença individual
router.post("/", authMiddleware, attendanceController.markAttendance);

// 📌 Registrar presença para múltiplas pessoas
router.post("/mark-multiple", authMiddleware, attendanceController.markMultipleAttendance);

// Nova rota para marcar presenças da célula
router.post('/cell-groups', authMiddleware, attendanceController.markCellGroupAttendance);

// 📌 Listar presenças por evento
router.get("/event/:event_id", authMiddleware, attendanceController.getAttendanceByEvent);

// 📌 Atualizar presença de uma pessoa em um evento
router.put("/:id", authMiddleware, attendanceController.updateAttendance);

router.get('/:event_id/by-event',authMiddleware, attendanceController.getAttendanceByEvent);
router.get('/by-person',authMiddleware, attendanceController.getAttendanceByPerson);

router.post('/toggle',authMiddleware, attendanceController.toggleAttendance);
module.exports = router;
