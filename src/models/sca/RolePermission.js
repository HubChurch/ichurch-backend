const {DataTypes} = require('sequelize');
const {scaDB} = require('../../config/db');

const RolePermission = scaDB.define('rolePermission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    role_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    permission_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true,
    underscored: true
});


module.exports = RolePermission;

