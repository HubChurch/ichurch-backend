const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const CellPerson = require('./CellPerson');

const Cell = sequelize.define('Cell', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: DataTypes.TEXT,
}, {
    tableName: 'cells',
    timestamps: true,
});

Cell.belongsToMany(require('./People'), { through: CellPerson, foreignKey: 'cell_id', as: 'members' });

module.exports = Cell;
