const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'schedulink_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDatabase() {
  try {
    // Create database if not exists
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    await connection.execute('CREATE DATABASE IF NOT EXISTS schedulink_db');
    await connection.end();

    // Create tables
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATETIME NOT NULL,
        end_date DATETIME,
        status ENUM('pending', 'approved', 'declined') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        message TEXT,
        eventId INT,
        resourceId INT,
        bookingId INT,
        registrationId INT,
        status ENUM('pending', 'approved', 'declined') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (eventId) REFERENCES events(id),
        FOREIGN KEY (resourceId) REFERENCES resources(id),
        FOREIGN KEY (bookingId) REFERENCES resources(id),
        FOREIGN KEY (registrationId) REFERENCES registrations(id)
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100),
        availability BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        eventId INT NOT NULL,
        fullName VARCHAR(255) NOT NULL,
        studentId VARCHAR(50),
        year VARCHAR(10),
        course VARCHAR(100),
        status ENUM('registered', 'cancelled') DEFAULT 'registered',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (eventId) REFERENCES events(id)
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        eventId INT NOT NULL,
        filePath VARCHAR(255) NOT NULL,
        uploadedBy VARCHAR(50) NOT NULL,
        uploadedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (eventId) REFERENCES events(id)
      )
    `);

    console.log('Database initialized successfully');

    // Insert sample data
    await pool.execute(`
      INSERT INTO events (name, description, start_date, end_date, status) VALUES
      ('Orientation Day', 'Welcome event for new students', '2024-08-01 09:00:00', '2024-08-01 12:00:00', 'approved'),
      ('Science Fair', 'Annual science exhibition', '2024-09-15 10:00:00', '2024-09-15 16:00:00', 'approved'),
      ('Cultural Festival', 'Celebration of diverse cultures', '2024-10-20 14:00:00', '2024-10-21 18:00:00', 'approved')
    `);

    await pool.execute(`
      INSERT INTO resources (name, description, category, availability) VALUES
      ('Gymnasium', 'Main sports hall for indoor activities', 'Sports', TRUE),
      ('Function Hall', 'Large hall for events and gatherings', 'Events', TRUE),
      ('Recreational Hall', 'Space for recreational activities', 'Recreation', FALSE),
      ('EMRC Lab', 'Educational Media Resource Center', 'Education', TRUE),
      ('Auditorium', 'Theater-style hall for performances', 'Events', TRUE)
    `);

    await pool.execute(`
      INSERT INTO registrations (eventId, fullName, studentId, year, course, status) VALUES
      (1, 'John Doe', '2021001', '3rd', 'Computer Science', 'registered'),
      (1, 'Jane Smith', '2021002', '3rd', 'Information Technology', 'registered'),
      (2, 'John Doe', '2021001', '3rd', 'Computer Science', 'registered'),
      (3, 'Bob Johnson', '2021003', '2nd', 'Engineering', 'cancelled')
    `);

    await pool.execute(`
      INSERT INTO notifications (type, message, eventId, status) VALUES
      ('event_approval', 'New event "Science Fair" requires approval', 2, 'pending'),
      ('event_approval', 'New event "Cultural Festival" requires approval', 4, 'pending')
    `);

    await pool.execute(`
      INSERT INTO notifications (type, message, resourceId, bookingId, status) VALUES
      ('resource_booking', 'Resource "Recreational Hall" booking request', 3, 3, 'pending'),
      ('resource_booking', 'Resource "Auditorium" booking request', 5, 5, 'approved')
    `);

    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

module.exports = { pool, initializeDatabase };
