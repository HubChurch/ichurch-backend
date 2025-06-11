const express = require("express");
const router = express.Router();
const eventController = require("../../controllers/community/eventsController");
const authMiddleware = require("../../middlewares/authMiddleware");

// 📌 Criar um novo evento
router.post("/", authMiddleware, eventController.createEvent);

// 📌 Listar todos os eventos ativos
router.get("/", authMiddleware, eventController.getEvents);

// 📌 Buscar evento por ID
router.get("/:id", authMiddleware, eventController.getEventById);

// 📌 Atualizar um evento
router.put("/:id", authMiddleware, eventController.updateEvent);

// 📌 Excluir evento (exclusão lógica)
router.delete("/:id", authMiddleware, eventController.deleteEvent);

// 🔹 Listar todas as pessoas relacionadas a um evento
router.get("/:event_id/people", authMiddleware, eventController.getEventPeople);

// 📌 Verificar status de check-in do usuário logado para o evento
router.get("/:event_id/check-status", authMiddleware, eventController.getCheckinStatus);

// 📌 Confirmar presença no evento
router.post("/:event_id/checkin", authMiddleware, eventController.checkin);

router.get("/upcoming/:ministry_id", authMiddleware, eventController.getUpcomingEventsByMinistry);



module.exports = router;
