const express = require('express');
const reportsController = require('../../controllers/community/reportsController');
const {authenticate} = require("../../middlewares/authMiddleware");

const router = express.Router();

// Estatísticas gerais de pessoas
router.get('/people-stats', authenticate, reportsController.getPeopleStats);

// Relatório de presença por evento
router.get('/event-presence/:event_id', authenticate, reportsController.getEventPresenceReport);

// Aniversariantes da semana
router.get('/birthdays-this-week', authenticate, reportsController.getBirthdaysThisWeek);

// Membros ausentes nos dois últimos eventos
router.get('/absent-members', authenticate, reportsController.getAbsentMembers);

router.get("/event-stats/:event_id", authenticate, reportsController.getEventStats);

module.exports = router;
