const Logs = require("../models/sca/Log");

exports.Logger = async (user_id, action, endpoint, status,details="") => {
    try {
        await Logs.create({ user_id, action, endpoint, status,details });
    } catch (err) {
        console.error("Erro ao registrar log:", err);
    }
};
