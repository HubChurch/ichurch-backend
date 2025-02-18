const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');
const People = require('./People');
const Events = require('./Events');

const Attendance = sequelize.define('Attendance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    person_id: {
        type: DataTypes.UUID,
        references: {
            model: People,
            key: 'id',
        },
        allowNull: false,
    },
    event_id: {
        type: DataTypes.UUID,
        references: {
            model: Events,
            key: 'id',
        },
        allowNull: false,
    },
    attendance_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'attendance',
    timestamps: true,
});

// Associações
Attendance.belongsTo(People, { foreignKey: 'person_id', as: 'person' });
Attendance.belongsTo(Events, { foreignKey: 'event_id', as: 'event' });

module.exports = Attendance;
