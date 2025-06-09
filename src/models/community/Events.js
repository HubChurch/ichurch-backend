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
    type: DataTypes.ENUM(
        "CULT",
        "PRAYER",
        "BIBLE_STUDY",
        "DISCIPLESHIP",
        "TRAINING",
        "CONFERENCE",
        "RETREAT",
        "CELL_GROUP",
        "OUTREACH",
        "LEADER_MEETING",
        "MINISTRY_MEETING",
        "ASSEMBLY"
    ),

    status: {
        type: DataTypes.ENUM("scheduled", "cancelled", "completed"),
        defaultValue: "scheduled"
    }
}, {
    timestamps: true,
    underscored: true
});

module.exports = Events;
