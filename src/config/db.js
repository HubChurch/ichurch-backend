const { Sequelize } = require('sequelize');

// Configuração da conexão com o banco de dados
const sequelize = new Sequelize('ichurch', 'root', '31310801gG@', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Para evitar logs SQL no console
});

// Testar conexão com o banco
sequelize
    .authenticate()
    .then(() => console.log('Conectado ao banco de dados com sucesso.'))
    .catch((err) => console.error('Erro ao conectar ao banco:', err));

module.exports = sequelize;
