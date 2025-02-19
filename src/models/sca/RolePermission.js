const {scaDB} = require('../../config/db');

const RolePermission = scaDB.define('rolePermission', {

}, {
    timestamps: true,
    underscored: true
});
RolePermission.associations= (models) => {
    models.Permissions.belongsToMany(models.Role, {
        as: 'roles',
        through: RolePermission,
        foreignKey: 'permission_id',
        otherKey: 'role_id',
    });
    models.Roles.belongsToMany(models.Permission, {
        as: 'permissions',
        through: RolePermission,
        foreignKey: 'role_id',
        otherKey: 'permission_id',
    });
}

module.exports = RolePermission;

