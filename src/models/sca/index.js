const Users = require("./User");
const Modules = require("./Module");
const Roles = require("./Role");
const UserRoles = require("./UserRole");
const Permissions = require("./Permission");
const RolePermissions = require("./RolePermission");
const Companies = require("./Company");
const Log = require("./Log");

// 🔹 Uma empresa pode ter vários usuários
Companies.hasMany(Users, { foreignKey: "company_id", as: "users" });  // ✅ Corrigido para plural
Users.belongsTo(Companies, { foreignKey: "company_id", as: "company" });

// 🔹 Um módulo pode ter várias roles e permissões
Modules.hasMany(Roles, { foreignKey: "module_id", as: "roles" });
Roles.belongsTo(Modules, { foreignKey: "module_id", as: "module" });

// 🔹 Relacionamento Many-to-Many entre Roles e Permissões
Roles.belongsToMany(Permissions, { through: RolePermissions, foreignKey: "role_id", as: "permissions" });
Permissions.belongsToMany(Roles, { through: RolePermissions, foreignKey: "permission_id", as: "roles" });

// 🔹 Relacionamento Many-to-Many entre Usuários e Roles
Users.belongsToMany(Roles, { through: UserRoles, foreignKey: "user_id", otherKey: "role_id", as: "roles" });
Roles.belongsToMany(Users, { through: UserRoles, foreignKey: "role_id", otherKey: "user_id", as: "users" });

// 🔹 Relacionamento entre Logs e User (FORA DO MODELO)
Users.hasMany(Log, { foreignKey: "user_id", as: "logs" });
Log.belongsTo(Users, { foreignKey: "user_id", as: "user" });

// Exportação dos modelos
module.exports = { Users, Modules, Roles, UserRoles, Permissions, RolePermissions, Companies, Log };
