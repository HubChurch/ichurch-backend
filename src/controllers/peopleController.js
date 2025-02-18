const People = require('../models/People');
const Members = require('../models/Members');
const RegularAttendees = require('../models/RegularAttendees');
const Visitors = require('../models/Visitors');
const {Logger} = require('../service/logService');
const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const moment = require("moment");

const router = express.Router();
const upload = multer({dest: "uploads/"});
exports.getAllPeople = async (req, res) => {
    try {
        const {status} = req.query;

        let whereCondition = {};
        if (status !== undefined) {
            whereCondition.status = status === "true";
        }

        const people = await People.findAll({where: whereCondition});

        await Logger(1, "LIST", "/people", 200);
        res.json(people);
    } catch (err) {
        console.error("Erro ao listar pessoas:", err);
        res.status(500).json({error: "Erro ao listar pessoas."});
    }
};


exports.getPersonById = async (req, res) => {
    const {id} = req.params;
    try {
        const person = await People.findByPk(id);
        console.log('teste2')
        if (!person) return res.status(404).json({message: 'Pessoa não encontrada.'});
        res.json(person);
    } catch (err) {
        res.status(500).json({error: 'Erro ao buscar pessoa.'});
    }
};

exports.createPerson = async (req, res) => {
    const {
        name,
        phone,
        instagram,
        birth_date,
        guardian_name,
        guardian_phone,
        type, // Tipo da pessoa (member, regular_attendee, visitor)
        baptism_date, // Somente para membros
        membership_start, // Somente para membros
        first_visit_date, // Somente para frequentadores regulares
        notes // Somente para visitantes
    } = req.body;

    try {
        // Criar a pessoa na tabela `people`
        const person = await People.create({
            name,
            phone,
            instagram,
            birth_date,
            guardian_name,
            guardian_phone,
            type,
        });

        // Verificar o tipo e criar na tabela correspondente
        if (type === 'member') {
            await Members.create({
                id: person.id, // O ID da pessoa é usado como chave primária
                baptism_date,
                membership_start,
            });
        } else if (type === 'regular_attendee') {
            await RegularAttendees.create({
                id: person.id,
                first_visit_date,
            });
        } else if (type === 'visitor') {
            await Visitors.create({
                id: person.id,
                notes,
            });
        }

        res.status(201).json({
            message: `Pessoa criada como ${type} com sucesso.`,
            person,
        });
    } catch (err) {
        console.error('Erro ao criar pessoa:', err);
        res.status(500).json({error: 'Erro ao criar pessoa.'});
    }
};

exports.updatePerson = async (req, res) => {
    const {id} = req.params;
    try {
        const person = await People.findByPk(id);
        if (!person) return res.status(404).json({message: 'Pessoa não encontrada.'});
        await person.update(req.body);
        res.json(person);
    } catch (err) {
        res.status(500).json({error: 'Erro ao atualizar pessoa.'});
    }
};

exports.deletePerson = async (req, res) => {
    const {id} = req.params;

    try {
        const person = await People.findByPk(id);
        if (!person) {
            return res.status(404).json({message: 'Pessoa não encontrada.'});
        }

        // Atualiza o status para false (desativado)
        await person.update({status: false});

        res.json({message: 'Pessoa desativada com sucesso.'});

    } catch (err) {
        console.error('Erro ao desativar pessoa:', err);
        res.status(500).json({error: 'Erro ao desativar pessoa.'});
    }

    const {People} = require("../models");


};

// Inativar ou ativar uma pessoa
exports.togglePersonStatus = async (req, res) => {
    const {id} = req.params;

    try {
        const person = await People.findByPk(id);
        if (!person) {
            return res.status(404).json({message: "Pessoa não encontrada."});
        }

        // Alterna o status entre ativo e inativo
        person.status = !person.status;
        await person.save();

        res.json({message: `Pessoa ${person.status ? "ativada" : "inativada"} com sucesso.`, person});
    } catch (error) {
        console.error("Erro ao atualizar status da pessoa:", error);
        res.status(500).json({error: "Erro ao atualizar status da pessoa."});
    }
};

exports.importPeopleFile = async (req, res) => {
    try {
        console.log("Recebendo arquivo...");

        if (!req.file) {
            return res.status(400).json({error: "Nenhum arquivo enviado."});
        }

        // Lendo o arquivo Excel
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        console.log("Dados extraídos:", jsonData);

        const formattedData = jsonData
            .map((row) => {

                let birthDate = null;

                if (row["birth_date"]) {
                    if (!isNaN(row["birth_date"])) {
                        birthDate = moment("1900-01-01").add(row["birth_date"] - 2, "days").toISOString();
                    } else {
                        birthDate = moment(row["birth_date"], "DD/MM/YYYY").toISOString();
                    }
                }

                return ({
                    name: row["name"] || null,
                    type: "member",
                    birth_date: birthDate || null,
                    phone: row["phone"] || null,
                    guardian_name: row["parentName"] || null,
                    guardian_phone: row["parentPhone"] || null,
                    status: true,
                })
            })
            .filter((person) => person.name);

        if (formattedData.length === 0) {
            return res.status(400).json({error: "Nenhum dado válido encontrado no arquivo."});
        }

        console.log("Dados formatados:", formattedData);

        // Simulando a inserção no banco (Remova o comentário para ativar)
        await People.bulkCreate(formattedData);

        res.json({message: `${formattedData.length} pessoas importadas com sucesso!`});

    } catch (error) {
        console.error("Erro ao importar pessoas:", error);
        res.status(500).json({error: "Erro ao processar o arquivo."});
    }
};

exports.uploadMiddleware = upload.single("file");
