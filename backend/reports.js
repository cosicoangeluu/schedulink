const express = require('express');
const multer = require('multer');
const path = require('path');
const { pool } = require('./database');

const router = express.Router();

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// POST /api/reports/upload - Upload a narrative report PDF
router.post('/upload', upload.single('report'), async (req, res) => {
  try {
    const { eventId, uploadedBy } = req.body;
    const filePath = req.file.path;

    if (!eventId || !uploadedBy) {
      return res.status(400).json({ error: 'eventId and uploadedBy are required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO reports (eventId, filePath, uploadedBy) VALUES (?, ?, ?)',
      [eventId, filePath, uploadedBy]
    );

    res.status(201).json({
      message: 'Report uploaded successfully',
      reportId: result.insertId
    });
  } catch (error) {
    console.error('Error uploading report:', error);
    res.status(500).json({ error: 'Failed to upload report' });
  }
});

// GET /api/reports - Get all reports
router.get('/', async (req, res) => {
  try {
    // Query all reports with event names
    const [reports] = await pool.execute(`
      SELECT r.*, e.name as eventName
      FROM reports r
      JOIN events e ON r.eventId = e.id
      ORDER BY r.uploadedAt DESC
    `);

    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

module.exports = router;
