const People = require("../models/community/People");

async function fetchPeopleByIds(ids, companyId) {
    return await People.findAll({
        where: {
            id: ids,
            company_id: companyId,
            status: "active",
        },
        attributes: ["id", "name", "email", "photo", "user_id"],
    });
}

module.exports = { fetchPeopleByIds };
