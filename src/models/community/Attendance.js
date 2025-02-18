const {DataTypes} = require('sequelize');
const People = require('./People');
const {communityDB} = require("../../config/db");

const Attendance = communityDB.define('Attendance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    company_id: {
        type: DataTypes.UUID,
        allowNull: false // Vincula a empresa responsável pelo registro de presença
    },
    person_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    event_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    attendance_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'attendance',
    timestamps: true,
});

module.exports = Attendance;
