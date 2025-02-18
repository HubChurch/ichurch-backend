const {DataTypes} = require('sequelize');
const {scaDB} = require('../../config/db');

const UserRole = scaDB.define('userRole', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    role_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    timestamps: true,
    underscored: true
});


module.exports = UserRole;

