const express = require('express');
const attendanceController = require('../controllers/attendanceController');

const router = express.Router();

router.post('/', attendanceController.markAttendance);
router.get('/by-event', attendanceController.getAttendanceByEvent);
router.get('/by-person', attendanceController.getAttendanceByPerson);

module.exports = router;
