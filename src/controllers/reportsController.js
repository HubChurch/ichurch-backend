const Attendance = require('../models/Attendance');
const People = require('../models/People');
const Events = require('../models/Events');
const Visitors = require('../models/Visitors');
const { Op } = require('sequelize');

// Estatísticas gerais de pessoas
exports.getPeopleStats = async (req, res) => {
    try {
        const totalPeople = await People.count();
        const totalVisitors = await People.count({ where: { type: 'visitor' } });
        const totalRegularAttendees = await People.count({ where: { type: 'regular_attendee' } });
        const totalMembers = await People.count({ where: { type: 'member' } });

        res.json({ totalPeople, totalVisitors, totalRegularAttendees, totalMembers });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao gerar estatísticas de pessoas.' });
    }
};

exports.getEventPresenceReport = async (req, res) => {
    const { event_id } = req.params;

    try {
        const event = await Events.findByPk(event_id);
        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado.' });
        }

        const attendance = await Attendance.findAll({
            where: { event_id },
            include: [{ model: People, as: 'person' }],
        });

        const totalAttendees = attendance.length;
        const attendees = attendance.map((record) => ({
            person_id: record.person.id,
            name: record.person.name,
            type: record.person.type,
        }));

        res.json({
            event: {
                id: event.id,
                name: event.name,
                date: event.event_date,
            },
            totalAttendees,
            attendees,
        });
    } catch (err) {
        console.error('Erro ao gerar relatório de presença por evento:', err);
        res.status(500).json({ error: 'Erro ao gerar relatório de presença por evento.' });
    }
};

exports.getVisitorVisitsReport = async (req, res) => {
    const { id } = req.params;

    try {
        const person = await People.findByPk(id);
        if (!person || person.type !== 'visitor') {
            return res.status(404).json({ message: 'Visitante não encontrado.' });
        }

        const visits = await Visitors.findAll({
            where: { id },
            attributes: ['visit_date', 'notes'],
        });

        res.json({
            visitor: {
                id: person.id,
                name: person.name,
                phone: person.phone,
                instagram: person.instagram,
            },
            totalVisits: visits.length,
            visits,
        });
    } catch (err) {
        console.error('Erro ao gerar relatório de visitas de visitante:', err);
        res.status(500).json({ error: 'Erro ao gerar relatório de visitas de visitante.' });
    }
};

// Retornar aniversariantes da semana
exports.getBirthdaysThisWeek = async (req, res) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Domingo
        const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6)); // Sábado

        const birthdays = await People.findAll({
            where: {
                birth_date: {
                    [Op.between]: [
                        `${startOfWeek.getMonth() + 1}-${startOfWeek.getDate()}`,
                        `${endOfWeek.getMonth() + 1}-${endOfWeek.getDate()}`,
                    ],
                },
            },
        });

        res.json(birthdays);
    } catch (err) {
        console.error('Erro ao buscar aniversariantes da semana:', err);
        res.status(500).json({ error: 'Erro ao buscar aniversariantes da semana.' });
    }
};

exports.getAbsentMembers = async (req, res) => {
    try {
        // Obter os dois eventos mais recentes
        const recentEvents = await Events.findAll({
            order: [['event_date', 'DESC']],
            limit: 2,
        });

        if (recentEvents.length < 2) {
            return res.status(400).json({ message: 'São necessários pelo menos dois eventos para calcular a ausência.' });
        }

        const [event1, event2] = recentEvents;

        // Obter IDs das pessoas presentes nos dois eventos
        const attendeesEvent1 = await Attendance.findAll({ where: { event_id: event1.id } });
        const attendeesEvent2 = await Attendance.findAll({ where: { event_id: event2.id } });

        const attendeesIdsEvent1 = attendeesEvent1.map((attendance) => attendance.person_id);
        const attendeesIdsEvent2 = attendeesEvent2.map((attendance) => attendance.person_id);

        // Obter todos os membros
        const allMembers = await People.findAll({ where: { type: 'member' } });

        // Filtrar membros ausentes nos dois eventos
        const absentMembers = allMembers.filter(
            (member) => !attendeesIdsEvent1.includes(member.id) && !attendeesIdsEvent2.includes(member.id)
        );

        res.json(absentMembers);
    } catch (err) {
        console.error('Erro ao verificar membros ausentes:', err);
        res.status(500).json({ error: 'Erro ao verificar membros ausentes.' });
    }
};