const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

async function resetAdminPassword() {
  const client = new Client({
    connectionString: process.env.DATABASE_URI
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Find the admin user
    const adminQuery = await client.query(`
      SELECT id, name, email, role 
      FROM users 
      WHERE role = 'admin' 
      LIMIT 1
    `);

    if (adminQuery.rows.length === 0) {
      console.log('❌ No admin user found');
      return;
    }

    const admin = adminQuery.rows[0];
    console.log(`📋 Found admin user: ${admin.name} (${admin.email})`);

    // Hash the new password
    const newPassword = 'AdminPassword123!';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    const updateResult = await client.query(`
      UPDATE users 
      SET hash = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, name, email
    `, [hashedPassword, admin.id]);

    if (updateResult.rows.length > 0) {
      console.log('✅ Admin password updated successfully!');
      console.log(`📧 Email: ${admin.email}`);
      console.log(`🔑 New Password: ${newPassword}`);
      console.log('\nYou can now login with these credentials.');
    } else {
      console.log('❌ Failed to update password');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

resetAdminPassword();
