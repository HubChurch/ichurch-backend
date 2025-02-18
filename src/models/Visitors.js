const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');

const Visitors = sequelize.define('Visitors', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
            model: 'People',
            key: 'id',
        },
    },
    visit_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    notes: DataTypes.TEXT,
}, {
    tableName: 'visitors',
    timestamps: true,
});
module.exports = Visitors;
