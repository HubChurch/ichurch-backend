const { DataTypes } = require("sequelize");
const { ministryDB } = require("../../config/db");

const Ministries = ministryDB.define(
    "ministry",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        company_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        type: {
            type: DataTypes.ENUM(
                "core",
                "celula",
                "louvor",
                "diaconia",
                "cantina",
                "financeiro",
                "infantil",
                "intercessao",
                "evangelismo",
                "outro"
            ),
            allowNull: false,
        },
        visibility: {
            type: DataTypes.ENUM("public", "secret", "private"),
            allowNull: false,
            defaultValue: "private",
        },
        code: {
            type: DataTypes.STRING(12),
            allowNull: true,
        },
        plugins: {
            type: DataTypes.JSON, // Armazena array de plugins
            allowNull: false,
            defaultValue: [],
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'deleted'),
            defaultValue: 'active',
        }

    },
    {
        timestamps: true,
        underscored: true,
    }
);

module.exports = Ministries;
