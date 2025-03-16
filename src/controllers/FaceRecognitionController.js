require("dotenv").config();
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { RekognitionClient, CompareFacesCommand } = require("@aws-sdk/client-rekognition");

// Configurar AWS S3 e Rekognition usando a nova SDK v3
const bucketName = process.env.AWS_BUCKET_NAME || "ichurch-storage";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const rekognition = new RekognitionClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Configurar upload com Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadImage = upload.single("image");

exports.recognizeFace = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "Nenhuma imagem enviada" });

    const imageKey = `faces/${Date.now()}.jpg`;

    try {
        // Enviar imagem para o S3
        await s3.send(
            new PutObjectCommand({
                Bucket: bucketName,
                Key: imageKey,
                Body: req.file.buffer,
                ContentType: "image/jpeg",
            })
        );

        console.log("Imagem enviada para S3:", imageKey);

        // Comparar imagens com Rekognition
        const params = {
            SourceImage: { S3Object: { Bucket: bucketName, Name: imageKey } },
            TargetImage: { S3Object: { Bucket: bucketName, Name: "faces/imagem1.jpg" } }, // Corrigido
            SimilarityThreshold: 80,
        };

        const command = new CompareFacesCommand(params);
        const response = await rekognition.send(command);

        if (response.FaceMatches.length > 0) {
            res.json({ success: true, message: "Usuário reconhecido!", data: response.FaceMatches });
        } else {
            res.json({ success: false, message: "Usuário não reconhecido" });
        }
    } catch (error) {
        console.error("Erro no reconhecimento:", error);
        res.status(500).json({ error: "Erro no processamento" });
    }
};

exports.saveFaceImages = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'UUID do usuário é obrigatório' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'Nenhuma imagem recebida' });
        }

        const uploadPromises = req.files.map(async (file, index) => {
            const imageKey = `faces/${userId}/face_${index}.jpg`;
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: imageKey,
                Body: file.buffer,
                ContentType: 'image/jpeg',
            };

            await s3.send(new PutObjectCommand(params));
            return imageKey;
        });

        const uploadedImages = await Promise.all(uploadPromises);

        res.json({ success: true, message: 'Imagens salvas com sucesso', images: uploadedImages });
    } catch (error) {
        console.error('Erro ao salvar imagens:', error);
        res.status(500).json({ success: false, message: 'Erro no servidor' });
    }
};
