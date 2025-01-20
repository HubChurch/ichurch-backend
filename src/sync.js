const sequelize = require('./config/db');
const People = require('./models/People');
const Members = require('./models/Members');
const RegularAttendees = require('./models/RegularAttendees');
const Visitors = require('./models/Visitors');
const Events = require('./models/Events');
const Attendance = require('./models/Attendance');
const Leader = require('./models/Leader');
const Cell = require('./models/Cell');
const CellPerson = require('./models/CellPerson');


Cell.belongsToMany(People, { through: CellPerson, foreignKey: 'cell_id', as: 'members' });
People.belongsToMany(Cell, { through: CellPerson, foreignKey: 'person_id', as: 'cells' });

(async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('Banco de dados sincronizado com sucesso.');
        process.exit(0);
    } catch (err) {
        console.error('Erro ao sincronizar o banco de dados:', err);
        process.exit(1);
    }
})();
