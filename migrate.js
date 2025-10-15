const mysql = require('mysql2');

async function migrate() {
  const connection = mysql.createConnection({
    host: '194.163.35.201',
    user: 'u579076463_schedulink',
    password: 'Schedulink2025!@',
    database: 'u579076463_schedulink_db'
  });

  try {
    // Add new columns to events table
    await connection.promise().execute('ALTER TABLE events ADD COLUMN gymnasium BOOLEAN DEFAULT FALSE');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN sports_area BOOLEAN DEFAULT FALSE');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN application_date DATE');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN rental_date DATE');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN behalf_of VARCHAR(255)');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN contact_info VARCHAR(255)');
    await connection.promise().execute('ALTER TABLE events ADD COLUMN nature_of_event TEXT');
    console.log('Migration completed: added new columns to events table');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    connection.end();
  }
}

migrate();
