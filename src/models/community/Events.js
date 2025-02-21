const { DataTypes } = require("sequelize");
const { communityDB } = require("../../config/db");

const Events = communityDB.define("event", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    company_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    ministry_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    event_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM("active", "canceled"),
        defaultValue: "active"
    }
}, {
    timestamps: true,
    underscored: true
});

module.exports = Events;
