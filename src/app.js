const express = require('express');
const cors = require('cors');
const peopleRoutes = require('./routes/community/peopleRoutes');
const membersRoutes = require('./routes/membersRoutes');
const regularAttendeesRoutes = require('./routes/regularAttendeesRoutes');
const visitorsRoutes = require('./routes/visitorsRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const utilityRoutes = require('./routes/utilityRoutes');
const leadershipRoutes = require('./routes/leadershipRoutes');
const authRoutes = require('./routes/sca/authRoutes');
const usersRoutes = require('./routes/sca/usersRoutes');
const companiesRoutes = require('./routes/sca/companiesRoutes');
const rolesRoutes = require('./routes/sca/rolesRoutes');
const permissionsRoutes = require('./routes/sca/permissionsRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/members', membersRoutes);
app.use('/regular-attendees', regularAttendeesRoutes);
app.use('/visitors', visitorsRoutes);
app.use('/events', eventsRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/reports', reportsRoutes);
app.use('/utility', utilityRoutes);
app.use('/leaders', leadershipRoutes);

app.use('/community/people', peopleRoutes);

app.use("/sca/auth", authRoutes);
app.use("/sca/users", usersRoutes);
app.use("/sca/companies", companiesRoutes);
app.use("/sca/roles", rolesRoutes);
app.use("/sca/permissions", permissionsRoutes);


// Middleware de erro
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
