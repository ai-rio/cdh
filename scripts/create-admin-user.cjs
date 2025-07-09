const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

async function createAdminUser() {
  const client = new Client({
    connectionString: process.env.DATABASE_URI
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Insert admin user
    const result = await client.query(`
      INSERT INTO users (name, email, password, role, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET
        role = EXCLUDED.role,
        "updatedAt" = NOW()
      RETURNING id, name, email, role;
    `, ['Admin User', 'admin@test.com', hashedPassword, 'admin']);

    console.log('Admin user created/updated:', result.rows[0]);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

createAdminUser();