const { Companies } = require("../../models/sca");

exports.createCompany = async (req, res) => {
    try {
        const { name, email, status } = req.body;

        const company = await Companies.create({ name, email, status });
        res.status(201).json({ message: "Empresa criada com sucesso.", company });
    } catch (err) {
        console.error("Erro ao criar empresa:", err);
        res.status(500).json({ error: "Erro ao criar empresa." });
    }
};

// 📌 Buscar todas as empresas
exports.getAllCompanies = async (req, res) => {
    try {
        const Company = await Companies.findAll();
        res.json(Company);
    } catch (err) {
        res.status(500).json({ error: "Erro ao listar empresas." });
    }
};

// 📌 Buscar empresa por ID
exports.getCompanyById = async (req, res) => {
    try {
        const company = await Companies.findByPk(req.params.id);
        if (!company) return res.status(404).json({ error: "Empresa não encontrada." });
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar empresa." });
    }
};

// 📌 Atualizar empresa
exports.updateCompany = async (req, res) => {
    try {
        const updated = await Companies.update(req.body, { where: { id: req.params.id } });
        if (!updated[0]) return res.status(404).json({ error: "Empresa não encontrada." });

        res.json({ message: "Empresa atualizada com sucesso." });
    } catch (err) {
        res.status(500).json({ error: "Erro ao atualizar empresa." });
    }
};
