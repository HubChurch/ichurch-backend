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
    },
    {
        timestamps: true,
        underscored: true,

    }
);

module.exports = Ministries;
