const mysql = require('mysql2/promise');

async function migrateReportsFileName() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: '153.92.15.6',
      user: 'u579076463_schedulink',
      password: 'Schedulink2025!@',
      database: 'u579076463_schedulink_db'
    });

    console.log('Starting migration: Adding fileName column to reports table...');

    // Check if fileName column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'reports'
      AND COLUMN_NAME = 'fileName'
    `);

    if (columns.length > 0) {
      console.log('fileName column already exists. Skipping migration.');
      return;
    }

    // Add fileName column
    await connection.execute(`
      ALTER TABLE reports
      ADD COLUMN fileName VARCHAR(255) NOT NULL AFTER filePath
    `);

    console.log('Migration completed: fileName column added to reports table.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateReportsFileName();
}

module.exports = { migrateReportsFileName };
