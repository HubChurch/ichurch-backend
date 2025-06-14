const People = require("../models/community/People");
const {Op} = require("sequelize");

async function fetchPeopleByIds(ids, companyId) {
    return await People.findAll({
        where: {
            company_id: companyId,
            status: "active",
        },
        attributes: ["id", "name", "email", "photo", "user_id"],
    });
}
async function fetchPeopleNotInIds(ids, companyId) {
    return await People.findAll({
        where: {
            company_id: companyId,
            status: "active",
            ...(ids.length > 0 && { id: { [Op.notIn]: ids } }),
        },
        attributes: ["id", "name", "email", "photo", "user_id"],
        logging: console.log, // Mostra o SQL no console
    });
}


module.exports = { fetchPeopleByIds,fetchPeopleNotInIds };
