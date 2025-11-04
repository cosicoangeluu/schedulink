const mysql = require('mysql2');

async function migrateVenues() {
  const connection = mysql.createConnection({
    host: '194.163.35.201',
    user: 'u579076463_schedulink',
    password: 'Schedulink2025!@',
    database: 'u579076463_schedulink_db'
  });

  try {
    // Drop old columns and add new venues column
    await connection.promise().execute('ALTER TABLE events DROP COLUMN gymnasium');
    await connection.promise().execute('ALTER TABLE events DROP COLUMN sports_area');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN venues JSON DEFAULT NULL');
    console.log('Migration completed: updated events table for venues');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    connection.end();
  }
}

migrateVenues();
