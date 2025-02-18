const {Roles, Permissions, Users} = require("../../models/sca");

// 📌 Listar as Permissões do Usuário Autenticado
exports.getUserPermissions = async (req, res) => {
    try {
        console.log("Usuário autenticado:", req.user.id);

        const user = await Users.findByPk(req.user.id, {
            include: [{model: Roles, as: "roles", include: [{model: Permissions, as: "permissions", through: {attributes: []}}],}],
        });
        if (!user) return res.status(404).json({error: "Usuário não encontrado."});

        // Filtrando permissões sem duplicar
        const permissions = [...new Set(user.roles.flatMap(Roles => Roles.permissions))];

        res.json(permissions);
    } catch (err) {
        res.status(500).json({error: "Erro ao listar permissões do usuário."});
    }
};
