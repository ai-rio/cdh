const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkUserPassword() {
  const client = new Client({
    connectionString: process.env.DATABASE_URI
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Check the admin user's password fields
    const userQuery = await client.query(`
      SELECT id, name, email, role, hash
      FROM users 
      WHERE email = 'carlos@ai.rio.br'
      LIMIT 1
    `);

    if (userQuery.rows.length === 0) {
      console.log('❌ Admin user not found');
      return;
    }

    const user = userQuery.rows[0];
    console.log('👤 User details:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Hash field: ${user.hash ? 'Present' : 'Empty'}`);
    if (user.hash) {
      console.log(`   Hash length: ${user.hash.length}`);
      console.log(`   Hash starts with: ${user.hash.substring(0, 10)}...`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

checkUserPassword();
