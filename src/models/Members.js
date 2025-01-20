const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const People = require('./People');
const Members = sequelize.define('Members', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: {
            model: 'People',
            key: 'id',
        },
    },
    baptism_date: DataTypes.DATE,
    membership_start: DataTypes.DATE,
}, {
    tableName: 'members',
    timestamps: true,
});
Members.belongsTo(People, { foreignKey: 'id', as: 'person' });
People.hasOne(Members, { foreignKey: 'id', as: 'memberDetails' });
module.exports = Members;
