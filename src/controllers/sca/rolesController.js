const { Users, Roles,UserRoles } = require("../../models/sca");
const { Logger } = require("../../service/logService");

// 📌 Listar as Roles do Usuário Autenticado
exports.getUserRoles = async (req, res) => {
    try {

        const user = await Users.findByPk(req.user.id, {
            include: [{ model: Roles, as: "roles", through: { attributes: [] } }],
        });
        if (!user) {
            console.error("Usuário não encontrado.");
            return res.status(404).json({ error: "Usuário não encontrado." });
        }


        res.json(user.roles);
    } catch (err) {
        console.error("Erro ao listar roles do usuário:", err);
        res.status(500).json({ error: "Erro ao listar roles do usuário." });
    }
};

exports.getRolePermissions = async (req, res) => {
    try {
        const { role_id } = req.params;

        const role = await Roles.findByPk(role_id, {
            include: {
                model: Permissions,
                as: "permissions",
                through: { attributes: [] }
            }
        });

        if (!role) {
            return res.status(404).json({ error: "Role não encontrada." });
        }

        res.json(role.permissions);
    } catch (err) {
        console.error("Erro ao listar permissões da role:", err);
        res.status(500).json({ error: "Erro ao listar permissões da role." });
    }
};

exports.updateUserRoles = async (req, res) => {
    try {
        if (!req.user.is_master) {
            return res.status(403).json({ error: "Acesso negado." });
        }

        const { user_id, role_ids } = req.body;

        const user = await Users.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        const existingRoles = await UserRoles.findAll({ where: { user_id } });
        const existingRoleIds = existingRoles.map(role => role.role_id);

        // Identificar roles para adicionar e para remover
        const rolesToAdd = role_ids.filter(roleId => !existingRoleIds.includes(roleId));
        const rolesToRemove = existingRoleIds.filter(roleId => !role_ids.includes(roleId));

        // Adicionar novas roles
        if (rolesToAdd.length > 0) {
            const newRoleEntries = rolesToAdd.map(roleId => ({ user_id, role_id: roleId }));
            await UserRoles.bulkCreate(newRoleEntries);
            await Logger(req.user.id, "CREATE", "/sca/roles/update", 200, `Adicionou roles: ${rolesToAdd.join(", ")} ao usuário ${user.name}`);
        }

        // Remover roles que não foram enviadas
        if (rolesToRemove.length > 0) {
            await UserRoles.destroy({ where: { user_id, role_id: rolesToRemove } });
            await Logger(req.user.id, "DELETE", "/sca/roles/update", 200, `Removeu roles: ${rolesToRemove.join(", ")} do usuário ${user.name}`);
        }

        res.json({ message: "Roles do usuário atualizadas com sucesso." });
    } catch (err) {
        console.error("Erro ao atualizar roles do usuário:", err);
        res.status(500).json({ error: "Erro ao atualizar roles do usuário." });
    }
};
