const { DataTypes } = require("sequelize");
const { scaDB } = require("../../config/db");

const Log = scaDB.define("log", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    action: {
        type: DataTypes.ENUM("CREATE", "UPDATE", "DELETE", "LIST", "GET", "LOGIN", "ERROR"),
        allowNull: false,
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 200,
    },
    endpoint: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    details: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },

}, {
    timestamps: false,
});

module.exports = Log;
