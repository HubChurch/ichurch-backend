const Ministry = require("./Ministries");
const MinistryMember = require("./MinistryMember");
const CellGroup = require("./CellGroups");
const CellMember = require("./CellMembers");
const Person = require("../community/People"); // ajuste conforme o caminho real

// 📌 Relacionamento: Um Ministério tem vários membros
Ministry.hasMany(MinistryMember, {
    foreignKey: "ministry_id",
    as: "members",
});
MinistryMember.belongsTo(Ministry, {
    foreignKey: "ministry_id",
    as: "ministry",
});

// 📌 Relacionamento: Um Ministério tem várias células
Ministry.hasMany(CellGroup, {
    foreignKey: "ministry_id",
    as: "cell_groups",
});
CellGroup.belongsTo(Ministry, {
    foreignKey: "ministry_id",
    as: "ministry",
});

// 📌 Relacionamento: Uma célula tem vários membros
CellGroup.hasMany(CellMember, {
    foreignKey: "cell_group_id",
    as: "members",
});
CellMember.belongsTo(CellGroup, {
    foreignKey: "cell_group_id",
    as: "cell_group",
});

CellMember.belongsTo(Person, {
    foreignKey: "person_id",
    as: "person",
});


// 📌 Relacionamento com pessoa pode ser adicionado se quiser referenciar community.person futuramente

module.exports = {
    Ministry,
    MinistryMember,
    CellGroup,
    CellMember,
};
