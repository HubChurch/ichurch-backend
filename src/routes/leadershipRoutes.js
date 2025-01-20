const express = require('express');
const leadershipController = require('../controllers/leadershipController');

const router = express.Router();

router.post('/', leadershipController.addLeader); // Adicionar líder
router.get('/', leadershipController.getAllLeaders); // Listar todos os líderes
router.put('/:id', leadershipController.updateLeader); // Atualizar líder
router.delete('/:id', leadershipController.removeLeader); // Remover líder

module.exports = router;
