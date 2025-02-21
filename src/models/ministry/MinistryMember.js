const {DataTypes} = require("sequelize");
const {ministryDB} = require("../../config/db");

const MinistryMember = ministryDB.define(
    "ministry_member",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        ministry_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        person_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM("LEADER", "AUX", "MEMBER"),
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("ativo", "inativo"),
            allowNull: false,
            defaultValue: "ativo",
        },
    },
    {
        timestamps: true,
        underscored: true,
    }
);

module.exports = MinistryMember;
