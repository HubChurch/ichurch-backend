const {scaDB} = require('../../config/db');

const UserRole = scaDB.define('userRole', {

}, {
    timestamps: true,
    underscored: true
});
UserRole.associations= (models) => {
    models.User.belongsToMany(models.Roles, {
        as: 'roles',
        through: UserRole,
        foreignKey: 'user_id',
        otherKey: 'role_id',
    });
    models.Roles.belongsToMany(models.User, {
        as: 'users',
        through: UserRole,
        foreignKey: 'role_id',
        otherKey: 'user_id',
    });
}
module.exports = UserRole;

