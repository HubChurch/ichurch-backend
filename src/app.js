const express = require('express');
const cors = require('cors');
const membersRoutes = require('./routes/membersRoutes');
const regularAttendeesRoutes = require('./routes/regularAttendeesRoutes');
const visitorsRoutes = require('./routes/visitorsRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const utilityRoutes = require('./routes/utilityRoutes');
const leadershipRoutes = require('./routes/leadershipRoutes');
const authRoutes = require('./routes/sca/authRoutes');
const usersRoutes = require('./routes/sca/usersRoutes');
const companiesRoutes = require('./routes/sca/companiesRoutes');
const rolesRoutes = require('./routes/sca/rolesRoutes');
const permissionsRoutes = require('./routes/sca/permissionsRoutes');
const peopleRoutes = require('./routes/community/PeopleRoutes');
// const eventsRoutes = require('./routes/community/eventsRoutes');
// const attendanceRoutes = require('./routes/community/attendanceRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/members', membersRoutes);
app.use('/regular-attendees', regularAttendeesRoutes);
app.use('/visitors', visitorsRoutes);
app.use('/reports', reportsRoutes);
app.use('/utility', utilityRoutes);
app.use('/leaders', leadershipRoutes);

app.use('/community/people', peopleRoutes);
// app.use('/community/events', eventsRoutes);
// app.use('/community/attendance', attendanceRoutes);


app.use("/sca/auth", authRoutes);
app.use("/sca/users", usersRoutes);
app.use("/sca/companies", companiesRoutes);
app.use("/sca/roles", rolesRoutes);
app.use("/sca/permissions", permissionsRoutes);


// Middleware de erro
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
