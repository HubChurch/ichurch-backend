const {gestorDB, worshipDB, scaDB,communityDB} = require("../config/db");
const {Sequelize} = require("sequelize");
const People = require("../models/People");
const Sca = require("../models/sca")
const community = require("../models/community")
module.exports = { gestorDB,worshipDB,scaDB,...Sca,communityDB,...community };
