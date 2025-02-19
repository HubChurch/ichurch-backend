const express = require("express");
const router = express.Router();
const peopleController = require("../../controllers/community/peopleController");
const { authenticate } = require("../../middlewares/authMiddleware");

// 📌 Criar uma nova pessoa
router.post("/", authenticate, peopleController.createPerson);

// 📌 Listar todas as pessoas ativas
router.get("/", authenticate, peopleController.getAllPeople);

// 📌 Buscar uma pessoa pelo ID
router.get("/:id", authenticate, peopleController.getPersonById);

// 📌 Atualizar uma pessoa
router.put("/:id", authenticate, peopleController.updatePerson);

// 📌 Desativar uma pessoa (exclusão lógica)
router.delete("/:id", authenticate, peopleController.deactivatePerson);

module.exports = router;
