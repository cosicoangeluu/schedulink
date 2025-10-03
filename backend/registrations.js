const express = require('express');
const { pool } = require('./database');

const router = express.Router();

// GET /api/registrations - Get all registrations
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT r.id, r.fullName, r.studentId, r.year, r.course, r.status, r.created_at as registrationDate, e.name as eventName
      FROM registrations r
      JOIN events e ON r.eventId = e.id
      ORDER BY r.created_at DESC
    `);
    console.log('Registrations fetched:', rows);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/registrations/:id - Get registration by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT r.id, r.fullName, r.studentId, r.year, r.course, r.status, r.created_at as registrationDate, e.name as eventName
      FROM registrations r
      JOIN events e ON r.eventId = e.id
      WHERE r.id = ?
    `, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/registrations - Create new registration
router.post('/', async (req, res) => {
  const { fullName, studentId, year, course, eventId, status } = req.body;
  console.log('POST registration:', req.body);
  try {
    // Check if registration already exists for this student and event
    const [existing] = await pool.execute(
      'SELECT id FROM registrations WHERE studentId = ? AND eventId = ?',
      [studentId, eventId]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Registration already exists for this student and event' });
    }

    const [result] = await pool.execute(
      'INSERT INTO registrations (fullName, studentId, year, course, eventId, status) VALUES (?, ?, ?, ?, ?, ?)',
      [fullName, studentId, year, course, eventId, status || 'registered']
    );
    const registrationId = result.insertId;
    console.log('Inserted registration ID:', registrationId);

    // Get the created registration with date
    const [newReg] = await pool.execute(`
      SELECT r.id, r.fullName, r.studentId, r.year, r.course, r.status, r.created_at as registrationDate, e.name as eventName
      FROM registrations r
      JOIN events e ON r.eventId = e.id
      WHERE r.id = ?
    `, [registrationId]);
    console.log('New registration data:', newReg[0]);
    res.status(201).json(newReg[0]);
  } catch (error) {
    console.error('Error creating registration:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/registrations/:id - Update registration
router.put('/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const [result] = await pool.execute(
      'UPDATE registrations SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json({ id: req.params.id, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/registrations/:id - Delete registration
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.execute('DELETE FROM registrations WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
