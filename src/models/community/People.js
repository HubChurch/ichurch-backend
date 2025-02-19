const { DataTypes } = require("sequelize");
const {communityDB} = require('../../config/db');

const People = communityDB.define("people", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    company_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true // Pode ser null para visitantes não cadastrados no SCA
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING(30),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: { isEmail: true }
    },
    birth_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    type: {
        type: DataTypes.ENUM("visitor", "regular_attendee", "member"),
        allowNull: false
    },
    joined_at: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM("active", "inactive", "deleted"), // Delete lógico
        defaultValue: "active"
    },
    config: {
        type: DataTypes.JSON,
        allowNull: true // Pode armazenar configurações extras (ex: batismo, profissão)
    },
    // Informações de endereço
}, {
    timestamps: true,
    underscored: true
});

module.exports = People;
