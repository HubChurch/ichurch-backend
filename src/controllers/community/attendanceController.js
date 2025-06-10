const { Attendance, People, Events } = require("../../models/community");

// 📌 Registrar presença individual
exports.markAttendance = async (req, res) => {
    const { person_id, event_id } = req.body;

    try {
        const event = await Events.findOne({ where: { id: event_id, company_id: req.user.company_id } });
        if (!event) return res.status(404).json({ error: "Evento não encontrado." });

        const person = await People.findOne({ where: { id: person_id, company_id: req.user.company_id, status: "active" } });
        if (!person) return res.status(404).json({ error: "Pessoa não encontrada." });

        const attendance = await Attendance.create({ person_id, event_id, company_id: req.user.company_id });
        res.status(201).json(attendance);
    } catch (err) {
        res.status(500).json({ error: "Erro ao registrar presença." });
    }
};

// 📌 Registrar presença para múltiplas pessoas no evento
exports.markMultipleAttendance = async (req, res) => {
    const { event_id, person_ids } = req.body;

    try {
        // 1. Verifica se o evento existe
        const event = await Events.findByPk(event_id);
        if (!event) {
            return res.status(404).json({ message: 'Evento não encontrado.' });
        }

        // 2. Busca todas as pessoas informadas
        const people = await People.findAll({ where: { id: person_ids } });
        const foundIds = people.map(p => p.id);
        const missingIds = person_ids.filter(id => !foundIds.includes(id));

        console.log(person_ids)
        if (missingIds.length > 0) {
            return res.status(400).json({
                message: 'Algumas pessoas não foram encontradas.',
                missingIds,
            });
        }

        // 3. Busca presenças já registradas
        const existing = await Attendance.findAll({
            where: {
                event_id,
                person_id: person_ids,
            },
        });

        const alreadyMarked = existing.map((a) => a.person_id);
        const newIds = person_ids.filter(id => !alreadyMarked.includes(id));

        // 4. Cria somente as que ainda não existem
        const attendanceRecords = newIds.map(person_id => ({
            event_id,
            person_id,
            company_id: req.user.company_id,
        }));

        if (attendanceRecords.length > 0) {
            await Attendance.bulkCreate(attendanceRecords);
        }

        // 5. Retorno completo
        res.status(201).json({
            message: 'Presença registrada com sucesso.',
            newMarked: newIds,
            alreadyMarked,
            totalRequested: person_ids.length,
            totalSaved: attendanceRecords.length,
        });

    } catch (err) {
        console.error('Erro ao marcar presença:', err);
        res.status(500).json({ error: 'Erro ao marcar presença.' });
    }
};


// 📌 Listar presenças por evento
exports.getAttendanceByEvent = async (req, res) => {
    const { event_id } = req.params;
    console.log(req.params);
    try {
        const attendance = await Attendance.findAll({
            where: { event_id, company_id: req.user.company_id },
            include: [{ model: People, as: 'person' }],
        });

        res.json(attendance);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Erro ao listar presenças.' });
    }
};

// 📌 Listar presenças de uma pessoa
exports.getAttendanceByPerson = async (req, res) => {
    const { person_id } = req.params;
    try {
        const attendance = await Attendance.findAll({
            where: { person_id, company_id: req.user.company_id },
            include: [{ model: Events, as: 'event', attributes: ["id", "name", "event_date"] }],
        });
        res.json(attendance);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar presenças.' });
    }
};

// 📌 Atualizar presença de uma pessoa em um evento
exports.updateAttendance = async (req, res) => {
    try {
        const updated = await Attendance.update(req.body, { where: { id: req.params.id, company_id: req.user.company_id } });
        if (!updated[0]) return res.status(404).json({ error: "Registro de presença não encontrado." });
        res.json({ message: "Presença atualizada com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar presença." });
    }
};

// 📌 Alternar a presença de uma pessoa no evento
exports.toggleAttendance = async (req, res) => {
    const { event_id, person_id } = req.body;

    try {
        const event = await Events.findOne({ where: { id: event_id, company_id: req.user.company_id } });
        if (!event) return res.status(404).json({ message: "Evento não encontrado." });

        const person = await People.findOne({ where: { id: person_id, company_id: req.user.company_id, status: "active" } });
        if (!person) return res.status(404).json({ message: "Pessoa não encontrada." });

        const existingAttendance = await Attendance.findOne({ where: { event_id, person_id, company_id: req.user.company_id } });

        if (existingAttendance) {
            await existingAttendance.destroy();
            return res.status(200).json({ message: "Presença removida.", present: false });
        } else {
            await Attendance.create({ event_id, person_id, company_id: req.user.company_id });
            return res.status(201).json({ message: "Presença registrada.", present: true });
        }
    } catch (err) {
        console.error("Erro ao alternar presença:", err);
        res.status(500).json({ error: "Erro ao alternar presença." });
    }
};
