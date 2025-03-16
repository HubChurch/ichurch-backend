const express = require("express");
const router = express.Router();
const FaceRecognitionController = require("../controllers/FaceRecognitionController");

// Criar endpoint para reconhecimento facial
router.post("/recognize", FaceRecognitionController.uploadImage, FaceRecognitionController.recognizeFace);

module.exports = router;
