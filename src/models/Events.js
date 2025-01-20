const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Events = sequelize.define('Events', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    event_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    description: DataTypes.TEXT,
}, {
    tableName: 'events',
    timestamps: true,
});
module.exports = Events;
