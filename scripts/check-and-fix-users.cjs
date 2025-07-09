const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function checkAndFixUsers() {
  try {
    console.log('🔍 COMPREHENSIVE USER DATABASE CHECK\n');

    const client = new Client({
      connectionString: process.env.DATABASE_URI
    });

    await client.connect();
    
    // Check all users
    console.log('📋 All users in database:');
    const usersQuery = await client.query(`
      SELECT id, name, email, role, created_at, updated_at, hash, login_attempts, lock_until
      FROM users 
      ORDER BY created_at
    `);

    if (usersQuery.rows.length === 0) {
      console.log('   ❌ No users found in database!');
      console.log('\n🆘 CRITICAL: Database appears to be empty');
      console.log('   This might be a database connection issue or the users table is empty');
      await client.end();
      return;
    }

    usersQuery.rows.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email})`);
      console.log(`      Role: ${user.role}`);
      console.log(`      Hash: ${user.hash ? 'Present' : 'Missing'}`);
      console.log(`      Login attempts: ${user.login_attempts || 0}`);
      console.log(`      Locked until: ${user.lock_until || 'Not locked'}`);
      console.log(`      Created: ${user.created_at}`);
      console.log('');
    });

    // Reset all login attempts and locks
    console.log('🔓 Resetting all login attempts and locks...');
    await client.query(`
      UPDATE users 
      SET login_attempts = 0, lock_until = NULL 
      WHERE login_attempts > 0 OR lock_until IS NOT NULL
    `);
    console.log('   ✅ All accounts unlocked');

    await client.end();

    // Test login with each user that should work
    console.log('\n🧪 Testing login for known users...');
    
    const testUsers = [
      { email: 'testadmin@example.com', password: 'TestPassword123!' },
      { email: 'carlos@ai.rio.br', password: 'AdminPassword123!' }
    ];

    const { default: fetch } = require('node-fetch');
    
    for (const testUser of testUsers) {
      console.log(`\n🔐 Testing login: ${testUser.email}`);
      
      try {
        const loginResponse = await fetch('http://localhost:3000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testUser)
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log(`   ✅ Login successful!`);
          console.log(`   👤 User: ${loginData.user.name} (${loginData.user.role})`);
          console.log(`   🎯 This account is working!`);
          
          // If this is an admin, we can use it to create other users
          if (loginData.user.role === 'admin') {
            console.log(`   🔧 This admin account can be used to manage other users`);
          }
        } else {
          const loginError = await loginResponse.json();
          console.log(`   ❌ Login failed: ${loginError.message}`);
        }
      } catch (error) {
        console.log(`   ❌ Login error: ${error.message}`);
      }
    }

    console.log('\n💡 RECOMMENDATIONS:');
    console.log('1. If no logins work, we may need to create a fresh admin user');
    console.log('2. If one login works, use that admin to create/fix other users');
    console.log('3. The issue might be with Payload CMS password hashing vs manual bcrypt');

    console.log('\n🌐 Try logging in at: http://localhost:3000');
    console.log('   Use any of the credentials shown above that worked');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkAndFixUsers();
