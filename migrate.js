const mysql = require('mysql2');

async function migrate() {
  const connection = mysql.createConnection({
    host: '194.163.35.201',
    user: 'u579076463_schedulink',
    password: 'Schedulink2025!@',
    database: 'u579076463_schedulink_db'
  });

  try {
    // Add new columns to events table for resources section
    await connection.promise().execute('ALTER TABLE events ADD COLUMN requires_equipment BOOLEAN DEFAULT FALSE');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN chairs_qty INT DEFAULT 0');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN tables_qty INT DEFAULT 0');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN projector BOOLEAN DEFAULT FALSE');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN other_equipment TEXT');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN setup_days INT DEFAULT 0');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN setup_hours INT DEFAULT 0');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN cleanup_hours INT DEFAULT 0');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN total_hours INT DEFAULT 0');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN multi_day_schedule VARCHAR(255)');
    console.log('Migration completed: added resources columns to events table');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    connection.end();
  }
}

migrate();
