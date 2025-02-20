const express = require("express");
const router = express.Router();
const eventController = require("../../controllers/community/eventsController");
const { authenticate } = require("../../middlewares/authMiddleware");

// 📌 Criar um novo evento
router.post("/", authenticate, eventController.createEvent);

// 📌 Listar todos os eventos ativos
router.get("/", authenticate, eventController.getAllEvents);

// 📌 Buscar evento por ID
router.get("/:id", authenticate, eventController.getEventById);

// 📌 Atualizar um evento
router.put("/:id", authenticate, eventController.updateEvent);

// 📌 Excluir evento (exclusão lógica)
router.delete("/:id", authenticate, eventController.deleteEvent);

// 🔹 Listar todas as pessoas relacionadas a um evento
router.get("/:event_id/people", authenticate, eventController.getEventPeople);

module.exports = router;
