const express = require('express');
const db = require('./database');
const router = express.Router();

// GET all reports
router.get('/', (req, res) => {
  db.all('SELECT * FROM reports', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET single report by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM reports WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }
    res.json(row);
  });
});

// POST create new report
router.post('/', (req, res) => {
  const { eventName, date, attendees } = req.body;
  if (!eventName || !date || attendees === undefined) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  db.run(`
    INSERT INTO reports (eventName, date, attendees)
    VALUES (?, ?, ?)
  `, [eventName, date, attendees], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Report created successfully' });
  });
});

// PUT update report
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { eventName, date, attendees } = req.body;

  db.run(`
    UPDATE reports SET
      eventName = COALESCE(?, eventName),
      date = COALESCE(?, date),
      attendees = COALESCE(?, attendees)
    WHERE id = ?
  `, [eventName, date, attendees, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }
    res.json({ message: 'Report updated successfully' });
  });
});

// DELETE report
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM reports WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Report not found' });
      return;
    }
    res.json({ message: 'Report deleted successfully' });
  });
});

module.exports = router;
