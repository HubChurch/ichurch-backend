const { Attendance, People, Events } = require("../../models/community");
const {CellMember} = require("../../models/ministry");

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

        // 2. Verifica se as pessoas existem
        const people = await People.findAll({ where: { id: person_ids } });
        const foundIds = people.map(p => p.id);
        const missingIds = person_ids.filter(id => !foundIds.includes(id));

        if (missingIds.length > 0) {
            return res.status(400).json({
                message: 'Algumas pessoas não foram encontradas.',
                missingIds,
            });
        }

        // 3. Busca todas as presenças existentes para o evento
        const existingAttendances = await Attendance.findAll({
            where: { event_id },
        });

        const existingIds = existingAttendances.map(a => a.person_id);

        // 4. Identifica o que precisa ser adicionado e removido
        const toAdd = person_ids.filter(id => !existingIds.includes(id));
        const toRemove = existingIds.filter(id => !person_ids.includes(id));

        // 5. Remove presenças que não estão mais na lista
        if (toRemove.length > 0) {
            await Attendance.destroy({
                where: {
                    event_id,
                    person_id: toRemove,
                },
            });
        }

        // 6. Adiciona novas presenças
        const newRecords = toAdd.map(person_id => ({
            event_id,
            person_id,
            company_id: req.user.company_id,
        }));

        if (newRecords.length > 0) {
            await Attendance.bulkCreate(newRecords);
        }

        // 7. Retorna status
        res.status(200).json({
            message: 'Presenças sincronizadas com sucesso.',
            added: toAdd,
            removed: toRemove,
            totalNow: person_ids.length,
        });

    } catch (err) {
        console.error('Erro ao sincronizar presenças:', err);
        res.status(500).json({ error: 'Erro ao sincronizar presenças.' });
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

// Controller para sincronizar presenças dos membros ativos da célula no evento
exports.markCellGroupAttendance = async (req, res) => {
    const { event_id, cell_group_id, person_ids } = req.body;

    if (!event_id || !cell_group_id || !Array.isArray(person_ids)) {
        return res.status(400).json({ message: 'Parâmetros inválidos' });
    }

    try {


        // 1) Buscar IDs dos membros ativos da célula
        const cellMembers = await CellMember.findAll({
            where: {
                cell_group_id,
                status: 'ativo',
                company_id: req.user.company_id,
            },
            attributes: ['person_id'],
        });
        const cellMemberIds = cellMembers.map(m => m.person_id);

        // 2) Buscar presenças atuais no evento apenas dos membros da célula
        const existingAttendances = await Attendance.findAll({
            where: {
                event_id,
                person_id: cellMemberIds,
                company_id: req.user.company_id,
            }
        });
        const existingPersonIds = existingAttendances.map(a => a.person_id);

        // 3) Calcular quem remover (presentes antes, mas não selecionados agora)
        const toRemove = existingPersonIds.filter(id => !person_ids.includes(id));

        // 4) Calcular quem adicionar (selecionados agora, mas não marcados antes)
        const toAdd = person_ids.filter(id => !existingPersonIds.includes(id));

        // 5) Remover presenças
        if (toRemove.length > 0) {
            await Attendance.destroy({
                where: {
                    event_id,
                    person_id: toRemove,
                    company_id: req.user.company_id,
                }
            });
        }

        // 6) Adicionar novas presenças
        if (toAdd.length > 0) {
            const now = new Date();
            const newRecords = toAdd.map(person_id => ({
                event_id,
                person_id,
                company_id: req.user.company_id,
                attendanceDate: now,
                createdAt: now,
                updatedAt: now,
            }));
            await Attendance.bulkCreate(newRecords);
        }

        return res.status(200).json({
            message: 'Presenças da célula atualizadas com sucesso',
            added: toAdd,
            removed: toRemove,
            totalNow: person_ids.length,
        });
    } catch (error) {
        console.error('Erro ao atualizar presenças da célula:', error);
        return res.status(500).json({ message: 'Erro interno ao atualizar presenças da célula' });
    }
};
