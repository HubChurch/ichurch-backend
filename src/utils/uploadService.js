const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3");
require("dotenv").config();
const sanitize = require("../utils/sanitize");

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const uploadToS3 = async (file, directory, fileName = '') => {
    try {
        let finalFileName;

        if (fileName) {
            finalFileName = `${directory}/${sanitize(fileName)}-${Date.now()}-${sanitize(file.originalname)}`;
        } else {
            finalFileName = `${directory}/${Date.now()}-${sanitize(file.originalname)}`;
        }
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: finalFileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(params);
        await s3.send(command);

        // Retorna a URL pública do S3
        return finalFileName;
    } catch (error) {
        console.error("Erro no upload para o S3:", error);
        throw error;
    }
};

module.exports = uploadToS3;
