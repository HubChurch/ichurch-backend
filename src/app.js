const express = require('express');
const peopleRoutes = require('./routes/peopleRoutes');
const membersRoutes = require('./routes/membersRoutes');
const regularAttendeesRoutes = require('./routes/regularAttendeesRoutes');
const visitorsRoutes = require('./routes/visitorsRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const utilityRoutes = require('./routes/utilityRoutes');
const leadershipRoutes = require('./routes/leadershipRoutes');
const cellRoutes = require('./routes/cellRoutes');

const app = express();
app.use(express.json());

// Rotas
app.use('/people', peopleRoutes);
app.use('/members', membersRoutes);
app.use('/regular-attendees', regularAttendeesRoutes);
app.use('/visitors', visitorsRoutes);
app.use('/events', eventsRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/reports', reportsRoutes);
app.use('/utility', utilityRoutes);
app.use('/leaders', leadershipRoutes);
app.use('/cells', cellRoutes);

// Middleware de erro
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

module.exports = app;
