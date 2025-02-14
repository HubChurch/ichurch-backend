const express = require('express');
const peopleController = require('../controllers/peopleController');

const router = express.Router();

router.get('/', peopleController.getAllPeople);
router.get('/:id', peopleController.getPersonById);
router.post('/', peopleController.createPerson);
router.put('/:id', peopleController.updatePerson);
router.delete('/:id', peopleController.deletePerson);
router.patch("/:id/toggle-status", peopleController.togglePersonStatus);
module.exports = router;
