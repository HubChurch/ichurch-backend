const express = require("express");
const router = express.Router();
const multer = require('multer');
const FaceRecognitionController = require("../controllers/FaceRecognitionController");
// Configuração do multer para receber múltiplas imagens
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Criar endpoint para reconhecimento facial
router.post("/recognize", FaceRecognitionController.uploadImages, FaceRecognitionController.recognizeFace);
router.post('/save', upload.array('images', 5), FaceRecognitionController.saveFaceImages);
router.get("/check/:userId", FaceRecognitionController.checkUserImages);

module.exports = router;
