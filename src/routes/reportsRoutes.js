const express = require('express');
const reportsController = require('../controllers/reportsController');

const router = express.Router();

// Estatísticas gerais de pessoas
router.get('/people-stats', reportsController.getPeopleStats);

// Relatório de presença por evento
router.get('/event-presence/:event_id', reportsController.getEventPresenceReport);


// Aniversariantes da semana
router.get('/birthdays-this-week', reportsController.getBirthdaysThisWeek);

// Membros ausentes nos dois últimos eventos
router.get('/absent-members', reportsController.getAbsentMembers);

router.get("/event-stats/:event_id", reportsController.getEventStats);

module.exports = router;
