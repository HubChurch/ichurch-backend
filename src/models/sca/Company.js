const { DataTypes } = require('sequelize');
const {scaDB} = require('../../config/db');

const Company = scaDB.define('company', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    status: {
        type: DataTypes.ENUM("premium", "freemium"),
        allowNull: false,
        defaultValue: "freemium"
    },
    owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true // Cada empresa tem um único dono
    }
}, {
    timestamps: true,
});


module.exports = Company;
