const express = require('express');
const db = require('./database');
const router = express.Router();

// GET all registrations
router.get('/', (req, res) => {
  db.all('SELECT * FROM registrations', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET single registration by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM registrations WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }
    res.json(row);
  });
});

// POST create new registration
router.post('/', (req, res) => {
  const { fullName, studentId, course, eventName, registrationDate, email, phone, status } = req.body;
  if (!fullName || !studentId || !course || !eventName || !status) {
    res.status(400).json({ error: 'Required fields are missing' });
    return;
  }

  db.run(`
    INSERT INTO registrations (fullName, studentId, course, eventName, registrationDate, email, phone, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [fullName, studentId, course, eventName, registrationDate || new Date().toISOString(), email, phone, status], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Registration created successfully' });
  });
});

// PUT update registration
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { fullName, studentId, course, eventName, registrationDate, email, phone, status } = req.body;

  db.run(`
    UPDATE registrations SET
      fullName = COALESCE(?, fullName),
      studentId = COALESCE(?, studentId),
      course = COALESCE(?, course),
      eventName = COALESCE(?, eventName),
      registrationDate = COALESCE(?, registrationDate),
      email = COALESCE(?, email),
      phone = COALESCE(?, phone),
      status = COALESCE(?, status)
    WHERE id = ?
  `, [fullName, studentId, course, eventName, registrationDate, email, phone, status, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }
    res.json({ message: 'Registration updated successfully' });
  });
});

// DELETE registration
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM registrations WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Registration not found' });
      return;
    }
    res.json({ message: 'Registration deleted successfully' });
  });
});

module.exports = router;
