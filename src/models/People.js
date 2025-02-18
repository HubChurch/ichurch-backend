const { DataTypes } = require('sequelize');
const {worshipDB} = require('../config/db');

const People = worshipDB.define('People', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: DataTypes.STRING,
    instagram: DataTypes.STRING,
    birth_date: DataTypes.DATE,
    guardian_name: DataTypes.STRING,
    guardian_phone: DataTypes.STRING,
    type: {
        type: DataTypes.ENUM('visitor', 'regular_attendee', 'member'),
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    timestamps: true,
    underscored: true,
    createdAt: "data_criacao",
    updatedAt: "data_atualizacao"

});
module.exports = People;
