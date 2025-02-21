const {sequelize, worshipDB, scaDB,communityDB,ministryDB} = require("../config/db");
const Sca = require("../models/sca")
const community = require("../models/community")
const ministry = require("../models/ministry")
module.exports = { sequelize,worshipDB,scaDB,communityDB,ministryDB,...Sca,...community,...ministry };
