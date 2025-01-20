const express = require('express');
const regularAttendeesController = require('../controllers/regularAttendeesController');

const router = express.Router();

router.get('/', regularAttendeesController.getAllRegularAttendees);
router.post('/', regularAttendeesController.createRegularAttendee);

module.exports = router;
