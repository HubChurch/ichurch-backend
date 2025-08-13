require('dotenv').config(); // Carrega o .env ANTES de tudo
const app = require("./app"); // Importa a instância do Express

if (require.main === module) {
    const PORT = 3000;
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

module.exports = app;
