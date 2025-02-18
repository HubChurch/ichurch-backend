const People = require('./people');
const Events = require('./Events');
const Attendance = require('./attendance');

// 📌 Relacionamento entre People e Attendance
People.hasMany(Attendance, { foreignKey: "person_id", as: "attendances" });
Attendance.belongsTo(People, { foreignKey: "person_id", as: "person" });

// 📌 Relacionamento entre Events e Attendance
Events.hasMany(Attendance, { foreignKey: "Events_id", as: "attendances" });
Attendance.belongsTo(Events, { foreignKey: "Events_id", as: "Events" });

// 📌 Relacionamento Many-to-Many entre People e Events via Attendance
People.belongsToMany(Events, { through: Attendance, foreignKey: "person_id", as: "Events" });
Events.belongsToMany(People, { through: Attendance, foreignKey: "Events_id", as: "attendees" });

module.exports = {People, Events, Attendance};
