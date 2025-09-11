const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const resourcesRouter = require('./resources');
const registrationsRouter = require('./registrations');
const eventsRouter = require('./events');
const notificationsRouter = require('./notifications');
const reportsRouter = require('./reports');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/resources', resourcesRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/reports', reportsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
