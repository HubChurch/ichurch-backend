const User = require("./User");
const Module = require("./Module");
const Role = require("./Role");
const UserRole = require("./UserRole");
const Permission = require("./Permission");
const RolePermission = require("./RolePermission");
const Company = require("./Company");

// Uma empresa tem muitos usuários
Company.hasMany(User, { foreignKey: "company_id", as: "users" });
User.belongsTo(Company, { foreignKey: "company_id", as: "company" });

// O dono da empresa é um usuário específico
Company.belongsTo(User, { foreignKey: "owner_id", as: "owner" });

// Um módulo pode ter várias roles e permissões
Module.hasMany(Role, { foreignKey: "module_id", as: "roles" });
Role.belongsTo(Module, { foreignKey: "module_id", as: "module" });

Module.hasMany(Permission, { foreignKey: "module_id", as: "permissions" });
Permission.belongsTo(Module, { foreignKey: "module_id", as: "module" });

// Relacionamento Many-to-Many entre Roles e Permissões
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "role_id", as: "permissions" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permission_id", as: "roles" });

// Relacionamento Many-to-Many entre Usuários e Roles
User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id", as: "roles" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id", as: "users" });

module.exports = {User, Module, Role, UserRole, Permission, RolePermission,Company};
