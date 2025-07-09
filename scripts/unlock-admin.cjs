const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function unlockAdminAccount() {
  const client = new Client({
    connectionString: process.env.DATABASE_URI
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Unlock the admin account by resetting login attempts and lock_until
    const unlockResult = await client.query(`
      UPDATE users 
      SET login_attempts = 0, lock_until = NULL, updated_at = NOW()
      WHERE email = 'carlos@ai.rio.br'
      RETURNING id, name, email, role, login_attempts, lock_until
    `);

    if (unlockResult.rows.length > 0) {
      const user = unlockResult.rows[0];
      console.log('✅ Admin account unlocked successfully!');
      console.log(`👤 User: ${user.name} (${user.email})`);
      console.log(`🔓 Login attempts reset to: ${user.login_attempts}`);
      console.log(`🔓 Lock until: ${user.lock_until || 'Not locked'}`);
      
      console.log('\n📧 You can now login with:');
      console.log('   Email: carlos@ai.rio.br');
      console.log('   Password: AdminPassword123!');
    } else {
      console.log('❌ Admin user not found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

unlockAdminAccount();
