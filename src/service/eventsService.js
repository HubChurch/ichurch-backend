const db = require("../../db"); // ajuste para seu client real (ex: sequelize, knex)
const dayjs = require("dayjs");

const eventService = {
    async createEvent(data) {
        return db.event.create(data);
    },

    async getEvents() {
        return db.event.findAll({ where: { deleted_at: null } });
    },

    async getEventById(id) {
        return db.event.findByPk(id);
    },

    async updateEvent(id, data) {
        return db.event.update(data, { where: { id } });
    },

    async deleteEvent(id) {
        return db.event.update({ deleted_at: new Date() }, { where: { id } });
    },

    async getEventPeople(eventId) {
        return db.eventPeople.findAll({ where: { event_id: eventId } });
    },

    // ✅ Check-in: verificar se usuário já fez
    async hasCheckedIn(userId, eventId) {
        const checkin = await db.eventCheckin.findOne({
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

        return db.eventCheckin.create({
            user_id: userId,
            event_id: eventId,
            checkin_date: dayjs().toDate(),
        });
    },

    // (opcional) Listar check-ins
    async getCheckins(eventId) {
        return db.eventCheckin.findAll({
            where: { event_id: eventId },
            include: [{ model: db.user, attributes: ["id", "name", "email"] }],
        });
    },
};

module.exports = eventService;
