const express = require('express');
const db = require('./database');
const router = express.Router();

// GET all notifications
router.get('/', (req, res) => {
  db.all('SELECT * FROM notifications', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET single notification by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM notifications WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }
    res.json(row);
  });
});

// POST create new notification
router.post('/', (req, res) => {
  const { eventName, status, studentName, course, studentId, submittedDate } = req.body;
  if (!eventName || !status || !studentName || !course || !studentId || !submittedDate) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  db.run(`
    INSERT INTO notifications (eventName, status, studentName, course, studentId, submittedDate)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [eventName, status, studentName, course, studentId, submittedDate], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Notification created successfully' });
  });
});

// PUT update notification
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { eventName, status, studentName, course, studentId, submittedDate } = req.body;

  db.run(`
    UPDATE notifications SET
      eventName = COALESCE(?, eventName),
      status = COALESCE(?, status),
      studentName = COALESCE(?, studentName),
      course = COALESCE(?, course),
      studentId = COALESCE(?, studentId),
      submittedDate = COALESCE(?, submittedDate)
    WHERE id = ?
  `, [eventName, status, studentName, course, studentId, submittedDate, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }
    res.json({ message: 'Notification updated successfully' });
  });
});

// DELETE notification
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM notifications WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }
    res.json({ message: 'Notification deleted successfully' });
  });
});

module.exports = router;
