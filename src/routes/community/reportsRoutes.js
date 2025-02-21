const express = require('express');
const reportsController = require('../../controllers/community/reportsController');
const authMiddleware  = require('../../middlewares/authMiddleware');
const router = express.Router();

// Estatísticas gerais de pessoas
router.get('/people-stats', authMiddleware, reportsController.getPeopleStats);

// Relatório de presença por evento
router.get('/event-presence/:event_id', authMiddleware, reportsController.getEventPresenceReport);

// Aniversariantes da semana
router.get('/birthdays-this-week', authMiddleware, reportsController.getBirthdaysThisWeek);

// Membros ausentes nos dois últimos eventos
router.get('/absent-members', authMiddleware, reportsController.getAbsentMembers);

router.get("/event-stats/:event_id", authMiddleware, reportsController.getEventStats);

module.exports = router;
