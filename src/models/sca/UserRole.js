const {DataTypes} = require('sequelize');
const {scaDB} = require('../../config/db');
const Role = require("./Role");
const Users = require("./User");

const UserRole = scaDB.define('userRole', {

}, {
    timestamps: true,
    underscored: true
});
UserRole.associations= (models) => {
    models.User.belongsToMany(models.Role, {
        as: 'roles',
        through: UserRole,
        foreignKey: 'user_id',
        otherKey: 'role_id',
    });
    models.Role.belongsToMany(models.User, {
        as: 'users',
        through: UserRole,
        foreignKey: 'role_id',
        otherKey: 'user_id',
    });
}
module.exports = UserRole;

