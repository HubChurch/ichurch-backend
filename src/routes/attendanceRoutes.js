const express = require('express');
const attendanceController = require('../controllers/attendanceController');

const router = express.Router();

router.post('/', attendanceController.markAttendance);
router.get('/by-event', attendanceController.getAttendanceByEvent);
router.get('/by-person', attendanceController.getAttendanceByPerson);
// Listar todas as pessoas e indicar presença no evento
router.get('/event/:event_id', attendanceController.getEventWithAttendance);

// Marcar presença para múltiplas pessoas
router.post('/mark-multiple', attendanceController.markMultipleAttendance);

// Alternar presença de uma pessoa no evento
router.post('/toggle', attendanceController.toggleAttendance);
module.exports = router;
