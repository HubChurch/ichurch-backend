const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RegularAttendees = sequelize.define('RegularAttendees', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
            model: 'People',
            key: 'id',
        },
    },
    first_visit_date: DataTypes.DATE,
}, {
    tableName: 'regular_attendees',
    timestamps: true,
});
module.exports = RegularAttendees;
