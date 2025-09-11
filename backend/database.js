const sqlite3 = require('sqlite3').verbose();

// Create database connection
const db = new sqlite3.Database('./resources.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    createTables();
  }
});

// Create tables
function createTables() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        total INTEGER NOT NULL,
        available INTEGER NOT NULL,
        inUse INTEGER NOT NULL,
        status TEXT NOT NULL,
        location TEXT NOT NULL,
        condition TEXT NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fullName TEXT NOT NULL,
        studentId TEXT NOT NULL,
        course TEXT NOT NULL,
        eventName TEXT NOT NULL,
        registrationDate TEXT DEFAULT CURRENT_TIMESTAMP,
        email TEXT,
        phone TEXT,
        status TEXT NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        date TEXT NOT NULL,
        venue TEXT NOT NULL,
        status TEXT NOT NULL,
        attendees INTEGER DEFAULT 0,
        addedBy TEXT NOT NULL
      )
    `);

    // Add addedBy column to existing events table if it doesn't exist
    db.run(`
      ALTER TABLE events ADD COLUMN addedBy TEXT DEFAULT 'Unknown'
    `, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding addedBy column:', err.message);
      }
    });

    db.run(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eventName TEXT NOT NULL,
        status TEXT NOT NULL,
        studentName TEXT NOT NULL,
        course TEXT NOT NULL,
        studentId TEXT NOT NULL,
        submittedDate TEXT NOT NULL
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS reports (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eventName TEXT NOT NULL,
        date TEXT NOT NULL,
        attendees INTEGER NOT NULL
      )
    `);
  });
}

module.exports = db;
