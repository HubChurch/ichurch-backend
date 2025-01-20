const express = require('express');
const utilityController = require('../controllers/utilityController');

const router = express.Router();

router.get('/health', utilityController.checkHealth);

module.exports = router;
