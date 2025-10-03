const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./database');
const eventsRouter = require('./events');
const notificationsRouter = require('./notifications');
const resourcesRouter = require('./resources');
const registrationsRouter = require('./registrations');
const reportsRouter = require('./reports');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/events', eventsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/reports', reportsRouter);

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeDatabase();
});
