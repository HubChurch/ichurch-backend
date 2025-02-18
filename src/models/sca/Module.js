const { DataTypes } = require('sequelize');
const {scaDB} = require('../../config/db');

const Module = scaDB.define('module', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
});

module.exports = Module;
