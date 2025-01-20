const express = require('express');
const reportsController = require('../controllers/reportsController');

const router = express.Router();

// Estatísticas gerais de pessoas
router.get('/people-stats', reportsController.getPeopleStats);

// Relatório de presença por evento
router.get('/event-presence/:event_id', reportsController.getEventPresenceReport);

// Relatório de visitas de um visitante
router.get('/visitor-visits/:id', reportsController.getVisitorVisitsReport);

// Aniversariantes da semana
router.get('/birthdays-this-week', reportsController.getBirthdaysThisWeek);

// Membros ausentes nos dois últimos eventos
router.get('/absent-members', reportsController.getAbsentMembers);

module.exports = router;
