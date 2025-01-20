const express = require('express');
const visitorsController = require('../controllers/visitorsController');

const router = express.Router();

router.get('/', visitorsController.getAllVisitors);
router.post('/:id/visit', visitorsController.addVisit);

module.exports = router;
