const express = require('express');
const cors = require('cors');
const reportsRoutes = require('./routes/community/reportsRoutes');
const utilityRoutes = require('./routes/utilityRoutes');
const authRoutes = require('./routes/sca/authRoutes');
const usersRoutes = require('./routes/sca/usersRoutes');
const companiesRoutes = require('./routes/sca/companiesRoutes');
const rolesRoutes = require('./routes/sca/rolesRoutes');
const permissionsRoutes = require('./routes/sca/permissionsRoutes');
const peopleRoutes = require('./routes/community/PeopleRoutes');
const eventsRoutes = require('./routes/community/EventsRoutes');
const attendanceRoutes = require('./routes/community/AttendanceRoutes');
const ministryRoutes = require('./routes/ministry/ministryRoutes');
const ministryMemberRoutes = require('./routes/ministry/ministryMemberRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/public', utilityRoutes);
// app.use('/community/reports', reportsRoutes);
app.use('/community/people', peopleRoutes);
app.use('/community/events', eventsRoutes);
app.use('/community/attendance', attendanceRoutes);

app.use("/sca/auth", authRoutes);
app.use("/sca/users", usersRoutes);
app.use("/sca/companies", companiesRoutes);
app.use("/sca/roles", rolesRoutes);
app.use("/sca/permissions", permissionsRoutes);

app.use("/ministry/", ministryRoutes);
app.use("/ministry/members", ministryMemberRoutes);

// Middleware de erro
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
