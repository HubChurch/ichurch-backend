require('dotenv').config();
const { Sequelize } = require('sequelize');

// Configuração da conexão com o banco de dados
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        logging: process.env.DB_LOGGING === 'true', // Converte string para boolean
    }
);

// Testar conexão com o banco
sequelize
    .authenticate()
    .then(() => console.log('Conectado ao banco de dados com sucesso.'))
    .catch((err) => console.error('Erro ao conectar ao banco:', err));

module.exports = sequelize;
