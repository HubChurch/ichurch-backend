const communityDB = require("../config/db"); // ajuste para seu client real (ex: sequelize, knex)
const dayjs = require("dayjs");
const { Events, Attendance} = require("../models/community");

const eventService = {
    async createEvent(data) {
        return Events.create(data);
    },

    async getEvents() {
        return Events.findAll({ where: { deleted_at: null } });
    },

    async getEventById(id) {
        return Events.findByPk(id);
    },

    async updateEvent(id, data) {
        return Events.update(data, { where: { id } });
    },

    async deleteEvent(id) {
        return Events.update({ deleted_at: new Date() }, { where: { id } });
    },

    async getEventPeople(eventId) {
        return Attendance.findAll({ where: { event_id: eventId } });
    },

    // ✅ Check-in: verificar se usuário já fez
    async hasCheckedIn(userId, eventId) {
        const checkin = await Attendance.findOne({
            where: {
                user_id: userId,
                event_id: eventId,
            },
        });

        return !!checkin;
    },

    // ✅ Check-in: registrar presença
    async registerCheckin(userId, eventId) {
        const alreadyChecked = await this.hasCheckedIn(userId, eventId);
        if (alreadyChecked) {
            throw new Error("Usuário já fez check-in neste evento.");
        }

        return Attendance.create({
            user_id: userId,
            event_id: eventId,
            checkin_date: dayjs().toDate(),
        });
    },

};

module.exports = eventService;
