const express = require('express');
const cellController = require('../controllers/cellController');

const router = express.Router();

// Criar célula
router.post('/', cellController.createCell);

// Listar células
router.get('/', cellController.getAllCells);

// Obter célula por ID
router.get('/:id', cellController.getCellById);

// Atualizar célula
router.put('/:id', cellController.updateCell);

// Remover célula
router.delete('/:id', cellController.deleteCell);

// Adicionar pessoa à célula
router.post('/add-person', cellController.addPersonToCell);

// Adicionar várias pessoas à célula
router.post('/add-people', cellController.addMultiplePeopleToCell);

// Listar membros de uma célula
router.get('/:cell_id/members', cellController.getCellMembers);


module.exports = router;
