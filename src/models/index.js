const {sequelize, worshipDB, scaDB,communityDB} = require("../config/db");
const Sca = require("../models/sca")
const community = require("../models/community")
module.exports = { sequelize,worshipDB,scaDB,...Sca,communityDB,...community };
