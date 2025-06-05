const { sequelize, scaDB, worshipDB,communityDB,ministryDB } = require("../src/models");

async function syncDatabases() {
    try {
        await scaDB.sync({ alter: true });
        console.log("✅ Banco 'sca' sincronizado!");

        await communityDB.sync({ alter: true });
        console.log("✅ Banco 'community' sincronizado!");

        await ministryDB.sync({ alter: true });
        console.log("✅ Banco 'ministry' sincronizado!");

    } catch (error) {
        console.error("❌ Erro ao sincronizar os bancos de dados:", error);
    } finally {
        process.exit();
    }
}

syncDatabases();
