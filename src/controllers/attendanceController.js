const Attendance = require('../models/Attendance');
const People = require('../models/People');
const Events = require('../models/Events');

// Registrar presença
exports.markAttendance = async (req, res) => {
    const { person_id, event_id } = req.body;
    try {
        const person = await People.findByPk(person_id);
        const event = await Events.findByPk(event_id);

        if (!person) return res.status(404).json({ message: 'Pessoa não encontrada.' });
        if (!event) return res.status(404).json({ message: 'Evento não encontrado.' });

        const attendance = await Attendance.create({ person_id, event_id });
        res.status(201).json(attendance);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao registrar presença.' });
    }
};

// Listar presenças por evento
exports.getAttendanceByEvent = async (req, res) => {
    const { event_id } = req.query;
    try {
        const attendance = await Attendance.findAll({
            where: { event_id },
            include: [{ model: People, as: 'person' }],
        });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar presenças.' });
    }
};

// Listar presenças de uma pessoa
exports.getAttendanceByPerson = async (req, res) => {
    const { person_id } = req.query;
    try {
        const attendance = await Attendance.findAll({
            where: { person_id },
            include: [{ model: Events, as: 'event' }],
        });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar presenças.' });
    }
};

// Listar todas as pessoas ativas e indicar presença no evento
exports.getEventWithAttendance = async (req, res) => {
    const { event_id } = req.params;

    try {
        const event = await Events.findByPk(event_id);
        if (!event) {
            return res.status(404).json({ message: "Evento não encontrado." });
        }

        // Buscar todas as pessoas ativas
        const people = await People.findAll({
            where: { status: true } // Filtra apenas as pessoas ativas
        });

        // Buscar todas as presenças registradas para o evento
        const attendanceRecords = await Attendance.findAll({
            where: { event_id },
        });

        // Criar um mapa de IDs das pessoas que marcaram presença
        const presentPeopleIds = attendanceRecords.map(record => record.person_id);

        // Mapear a lista de pessoas ativas com status de presença
        const peopleWithAttendance = people.map(person => ({
            id: person.id,
            name: person.name,
            type: person.type,
            present: presentPeopleIds.includes(person.id) // Indica se a pessoa já marcou presença
        }));

        res.json({
            event: {
                id: event.id,
                name: event.name,
                date: event.event_date,
                description: event.description
            },
            attendees: peopleWithAttendance
        });

    } catch (err) {
        console.error("Erro ao buscar lista de presença do evento:", err);
        res.status(500).json({ error: "Erro ao buscar lista de presença do evento." });
    }
};

// Marcar presença para múltiplas pessoas no evento
exports.markMultipleAttendance = async (req, res) => {
    const { event_id, person_ids } = req.body;

    try {
        const event = await Events.findByPk(event_id);
        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado.' });
        }

        const people = await People.findAll({ where: { id: person_ids } });

        if (people.length !== person_ids.length) {
            return res.status(400).json({
                message: 'Algumas pessoas não foram encontradas.',
                missingIds: person_ids.filter(id => !people.find(p => p.id === id))
            });
        }

        // Criar os registros de presença em massa
        const attendanceRecords = person_ids.map(person_id => ({
            event_id,
            person_id
        }));

        await Attendance.bulkCreate(attendanceRecords);

        res.status(201).json({
            message: 'Presença marcada com sucesso para as pessoas selecionadas.',
            attendedPeople: people.map(person => ({
                id: person.id,
                name: person.name
            }))
        });

    } catch (err) {
        console.error('Erro ao marcar presença:', err);
        res.status(500).json({ error: 'Erro ao marcar presença.' });
    }
};


// Alternar a presença de uma pessoa no evento
exports.toggleAttendance = async (req, res) => {
    const { event_id, person_id } = req.body;

    try {
        const event = await Events.findByPk(event_id);
        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado.' });
        }

        const person = await People.findByPk(person_id);
        if (!person) {
            return res.status(404).json({ message: 'Pessoa não encontrada.' });
        }

        // Verifica se a presença já está registrada
        const existingAttendance = await Attendance.findOne({
            where: { event_id, person_id }
        });

        if (existingAttendance) {
            // Se já estava presente, remove
            await existingAttendance.destroy();
            return res.status(200).json({ message: 'Presença removida.', present: false });
        } else {
            // Se não estava presente, adiciona
            await Attendance.create({ event_id, person_id });
            return res.status(201).json({ message: 'Presença registrada.', present: true });
        }
    } catch (err) {
        console.error('Erro ao alternar presença:', err);
        res.status(500).json({ error: 'Erro ao alternar presença.' });
    }
};


