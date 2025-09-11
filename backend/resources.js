const express = require('express');
const db = require('./database');
const router = express.Router();

// GET all resources
router.get('/', (req, res) => {
  db.all('SELECT * FROM resources', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET single resource by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM resources WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    res.json(row);
  });
});

// POST create new resource
router.post('/', (req, res) => {
  const { name, total, available, inUse, status, location, condition } = req.body;
  if (!name || total === undefined || available === undefined || inUse === undefined || !status || !location || !condition) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  db.run(`
    INSERT INTO resources (name, total, available, inUse, status, location, condition)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [name, total, available, inUse, status, location, condition], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Resource created successfully' });
  });
});

// PUT update resource
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, total, available, inUse, status, location, condition } = req.body;

  db.run(`
    UPDATE resources SET
      name = COALESCE(?, name),
      total = COALESCE(?, total),
      available = COALESCE(?, available),
      inUse = COALESCE(?, inUse),
      status = COALESCE(?, status),
      location = COALESCE(?, location),
      condition = COALESCE(?, condition)
    WHERE id = ?
  `, [name, total, available, inUse, status, location, condition, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    res.json({ message: 'Resource updated successfully' });
  });
});

// DELETE resource
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM resources WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    res.json({ message: 'Resource deleted successfully' });
  });
});

module.exports = router;
