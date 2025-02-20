require('dotenv').config();
const { Sequelize } = require('sequelize');

// Configuração de conexão para cada schema
const sequelize = new Sequelize("ichurch", process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: 3306,
    logging: false
});

const scaDB = new Sequelize("sca", process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: 3306,
    logging: false
});

const worshipDB = new Sequelize("worship", process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: 3306,
    logging: false
});
const communityDB = new Sequelize("community", process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: 3306,
    logging: true
});

// Exporta as conexões
module.exports = { sequelize, worshipDB,scaDB,communityDB };
