require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrateReportsFK() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Starting migration to remove foreign key constraint from reports table...');

    // Check if the foreign key exists
    const [constraints] = await connection.execute(`
      SELECT CONSTRAINT_NAME
      FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
      WHERE TABLE_NAME = 'reports'
      AND TABLE_SCHEMA = DATABASE()
      AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    `);

    if (constraints.length > 0) {
      const constraintName = constraints[0].CONSTRAINT_NAME;
      console.log(`Dropping foreign key constraint: ${constraintName}`);

      await connection.execute(`ALTER TABLE reports DROP FOREIGN KEY ${constraintName}`);
      console.log('Foreign key constraint dropped successfully.');
    } else {
      console.log('No foreign key constraint found on reports table.');
    }

    console.log('Migration completed successfully.');
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
  migrateReportsFK();
}

module.exports = { migrateReportsFK };
