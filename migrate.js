const mysql = require('mysql2/promise');

async function migrate() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'schedulink_db'
  });

  try {
    await connection.execute('ALTER TABLE events CHANGE date start_date DATETIME NOT NULL');
    console.log('Migration completed: renamed date to start_date');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await connection.end();
  }
}

migrate();
