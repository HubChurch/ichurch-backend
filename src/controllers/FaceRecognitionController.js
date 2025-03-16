require("dotenv").config();
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const multer = require("multer");

const bucketName = process.env.AWS_BUCKET_NAME || "ichurch-storage";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Configuração do upload com Multer (permite múltiplas imagens)
const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadImages = upload.array("images", 5); // No máximo 5 imagens

/**
 * Verifica se o usuário já tem imagens de reconhecimento facial no S3
 */
exports.checkUserImages = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, message: "ID do usuário é obrigatório" });
        }

        const params = {
            Bucket: bucketName,
            Prefix: `faces/${userId}/`, // Lista arquivos na pasta do usuário
        };

        const data = await s3.send(new ListObjectsV2Command(params));

        if (!data.Contents || data.Contents.length === 0) {
            return res.json({ success: true, images: [] });
        }

        // Montar URLs públicas das imagens (caso ACL permita)
        const imageUrls = data.Contents.map(file => `https://${bucketName}.s3.amazonaws.com/${file.Key}`);

        return res.json({ success: true, images: imageUrls });
    } catch (error) {
        console.error("Erro ao verificar imagens:", error);
        return res.status(500).json({ success: false, message: "Erro ao buscar imagens no S3" });
    }
};

/**
 * Salva as imagens de reconhecimento facial de um usuário no S3
 */
exports.saveFaceImages = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "ID do usuário é obrigatório" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "Nenhuma imagem recebida" });
        }

        const uploadPromises = req.files.map(async (file, index) => {
            const imageKey = `faces/${userId}/face_${index}.jpg`;
            const params = {
                Bucket: bucketName,
                Key: imageKey,
                Body: file.buffer,
                ContentType: "image/jpeg",
            };

            await s3.send(new PutObjectCommand(params));
            return imageKey;
        });

        const uploadedImages = await Promise.all(uploadPromises);

        res.json({ success: true, message: "Imagens salvas com sucesso", images: uploadedImages });
    } catch (error) {
        console.error("Erro ao salvar imagens:", error);
        res.status(500).json({ success: false, message: "Erro no servidor" });
    }
};



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
