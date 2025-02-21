const Ministries = require("./Ministries");
const MinistryMember = require("./MinistryMember");
const Event = require("../community/Events");

// 📌 Relacionamento: Um Ministério tem vários membros
Ministries.hasMany(MinistryMember, { foreignKey: "ministry_id", as: "members" });
MinistryMember.belongsTo(Ministries, { foreignKey: "ministry_id", as: "ministry" });

// 📌 Relacionamento: Um Ministério pode ter vários eventos
// Ministries.hasMany(Event, { foreignKey: "ministry_id", as: "events" });
// Event.belongsTo(Ministries, { foreignKey: "ministry_id", as: "ministry" });

// 📌 Relacionamento: Um membro pode estar em vários ministérios
module.exports = {
    Ministries,
    MinistryMember,
};
