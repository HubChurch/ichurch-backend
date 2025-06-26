const { DataTypes } = require("sequelize");
const { ministryDB } = require("../../config/db");

const Ministries = ministryDB.define(
    "cell_group",
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
        ministry_id: {
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
        config: {
            type: DataTypes.JSON,
            allowNull: true,
            comment: "Armazena configurações visuais: ícone, cor, etc.",
        },
        status: {
            type: DataTypes.ENUM("ativo", "inativo"),
            allowNull: false,
            defaultValue: "ativo",
        }
    },
    {
        timestamps: true,
        underscored: true,

    }
);

module.exports = Ministries;
