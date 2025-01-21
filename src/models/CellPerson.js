const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Cell = require('./Cell');
const People = require('./People');

const CellPerson = sequelize.define('CellPerson', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    cell_id: {
        type: DataTypes.UUID,
        references: {
            model: Cell,
            key: 'id',
        },
        allowNull: false,
    },
    person_id: {
        type: DataTypes.UUID,
        references: {
            model: People,
            key: 'id',
        },
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('member', 'leader', 'assistant'),
        allowNull: false,
        defaultValue: 'member',
    },
}, {
    tableName: 'cell_people',
    timestamps: true,
});

// Associações

module.exports = CellPerson;
