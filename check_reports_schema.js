require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkReportsSchema() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('Checking reports table schema...');

    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'reports'
      ORDER BY ORDINAL_POSITION
    `);

    console.log('Reports table columns:');
    columns.forEach(col => {
      console.log(`- ${col.COLUMN_NAME}: ${col.COLUMN_TYPE} ${col.IS_NULLABLE === 'NO' ? 'NOT NULL' : ''} ${col.COLUMN_DEFAULT ? `DEFAULT ${col.COLUMN_DEFAULT}` : ''}`);
    });

  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkReportsSchema();
