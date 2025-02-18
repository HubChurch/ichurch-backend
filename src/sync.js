const { gestorDB, scaDB, worshipDB,communityDB } = require("../src/models");

async function syncDatabases() {
    try {
        await gestorDB.sync({ alter: true });
        console.log("✅ Banco 'gestor' sincronizado!");

        await scaDB.sync({ alter: true });
        console.log("✅ Banco 'sca' sincronizado!");

        await communityDB.sync({ alter: true });
        console.log("✅ Banco 'community' sincronizado!");

        await worshipDB.sync({ alter: true });
        console.log("✅ Banco 'worship' sincronizado!");

    } catch (error) {
        console.error("❌ Erro ao sincronizar os bancos de dados:", error);
    } finally {
        process.exit();
    }
}

syncDatabases();
