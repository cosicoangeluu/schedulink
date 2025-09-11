const express = require('express');
const db = require('./database');
const router = express.Router();

// GET all events
router.get('/', (req, res) => {
  db.all('SELECT * FROM events', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET single event by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json(row);
  });
});

// POST create new event
router.post('/', (req, res) => {
  const { name, date, venue, attendees, addedBy } = req.body;
  if (!name || !date || !venue || !addedBy) {
    res.status(400).json({ error: 'Name, date, venue, and addedBy are required' });
    return;
  }
  const status = 'pending'; // default status for new events

  db.run(`
    INSERT INTO events (name, date, venue, status, attendees, addedBy)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [name, date, venue, status, attendees || 0, addedBy], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Insert into notifications table
    const eventName = name;
    const studentName = req.body.studentName || 'Unknown';
    const course = req.body.course || 'Unknown';
    const studentId = req.body.studentId || 'Unknown';
    const submittedDate = new Date().toISOString();

    db.run(`
      INSERT INTO notifications (eventName, status, studentName, course, studentId, submittedDate)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [eventName, 'pending', studentName, course, studentId, submittedDate], function(notifErr) {
      if (notifErr) {
        console.error('Failed to insert notification:', notifErr.message);
      }
    });

    res.json({ id: this.lastID, message: 'Event created successfully and notification sent' });
  });
});

// PUT update event
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, date, venue, status, attendees, addedBy } = req.body;

  db.run(`
    UPDATE events SET
      name = COALESCE(?, name),
      date = COALESCE(?, date),
      venue = COALESCE(?, venue),
      status = COALESCE(?, status),
      attendees = COALESCE(?, attendees),
      addedBy = COALESCE(?, addedBy)
    WHERE id = ?
  `, [name, date, venue, status, attendees, addedBy, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json({ message: 'Event updated successfully' });
  });
});

// DELETE event
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM events WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Event not found' });
      return;
    }
    res.json({ message: 'Event deleted successfully' });
  });
});

module.exports = router;
