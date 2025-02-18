const { DataTypes } = require('sequelize');
const {sequelize} = require('../config/db');
const People = require('./People');

const Leader = sequelize.define('Leader', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
            model: People,
            key: 'id',
        },
    },
    role: {
        type: DataTypes.STRING, // Ex.: "Líder de Célula", "Líder de Ministério"
        allowNull: false,
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'leaders',
    timestamps: true,
});

// Associações
Leader.belongsTo(People, { foreignKey: 'id', as: 'person' });
People.hasOne(Leader, { foreignKey: 'id', as: 'leaderDetails' });

module.exports = Leader;
