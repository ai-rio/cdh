const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

async function createAdminUser() {
  try {
    console.log('👑 CREATING ADMIN USER\n');

    const client = new Client({
      connectionString: process.env.DATABASE_URI
    });

    await client.connect();

    // First, promote an existing user to admin temporarily
    console.log('1️⃣ Promoting existing user to admin...');
    const promoteResult = await client.query(`
      UPDATE users 
      SET role = 'admin' 
      WHERE email = 'carlos@apto.rio.br'
      RETURNING id, name, email, role
    `);

    if (promoteResult.rows.length > 0) {
      console.log('   ✅ Promoted carlos@apto.rio.br to admin');
      console.log(`   👤 ${promoteResult.rows[0].name} is now an admin`);
    }

    // Create a proper admin user with known credentials
    console.log('\n2️⃣ Creating dedicated admin user...');
    
    // Hash password properly
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);
    
    const createResult = await client.query(`
      INSERT INTO users (name, email, hash, role, created_at, updated_at, login_attempts)
      VALUES ($1, $2, $3, $4, NOW(), NOW(), 0)
      ON CONFLICT (email) DO UPDATE SET
        hash = EXCLUDED.hash,
        role = EXCLUDED.role,
        login_attempts = 0,
        lock_until = NULL,
        updated_at = NOW()
      RETURNING id, name, email, role
    `, ['Admin User', 'admin@example.com', hashedPassword, 'admin']);

    if (createResult.rows.length > 0) {
      console.log('   ✅ Admin user created/updated successfully');
      console.log(`   👤 ${createResult.rows[0].name} (${createResult.rows[0].email})`);
    }

    // Create the test admin user
    console.log('\n3️⃣ Creating test admin user...');
    const testHashedPassword = await bcrypt.hash('TestPassword123!', 10);
    
    const testCreateResult = await client.query(`
      INSERT INTO users (name, email, hash, role, created_at, updated_at, login_attempts)
      VALUES ($1, $2, $3, $4, NOW(), NOW(), 0)
      ON CONFLICT (email) DO UPDATE SET
        hash = EXCLUDED.hash,
        role = EXCLUDED.role,
        login_attempts = 0,
        lock_until = NULL,
        updated_at = NOW()
      RETURNING id, name, email, role
    `, ['Test Admin', 'testadmin@example.com', testHashedPassword, 'admin']);

    if (testCreateResult.rows.length > 0) {
      console.log('   ✅ Test admin user created/updated successfully');
      console.log(`   👤 ${testCreateResult.rows[0].name} (${testCreateResult.rows[0].email})`);
    }

    // Show all users
    console.log('\n📋 All users in database:');
    const allUsers = await client.query(`
      SELECT name, email, role, created_at
      FROM users 
      ORDER BY created_at
    `);

    allUsers.rows.forEach((user, index) => {
      const roleIcon = user.role === 'admin' ? '👑' : user.role === 'creator' ? '🎨' : '🏢';
      console.log(`   ${index + 1}. ${roleIcon} ${user.name} (${user.email}) - ${user.role.toUpperCase()}`);
    });

    await client.end();

    // Test login
    console.log('\n🧪 Testing admin login...');
    const { default: fetch } = require('node-fetch');
    
    const testCredentials = [
      { email: 'admin@example.com', password: 'AdminPassword123!', name: 'Admin User' },
      { email: 'testadmin@example.com', password: 'TestPassword123!', name: 'Test Admin' }
    ];

    for (const cred of testCredentials) {
      console.log(`\n🔐 Testing: ${cred.email}`);
      
      try {
        const loginResponse = await fetch('http://localhost:3000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cred.email,
            password: cred.password
          })
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log(`   ✅ Login successful!`);
          console.log(`   👤 Logged in as: ${loginData.user.name} (${loginData.user.role})`);
        } else {
          const loginError = await loginResponse.json();
          console.log(`   ❌ Login failed: ${loginError.message}`);
        }
      } catch (error) {
        console.log(`   ❌ Login error: ${error.message}`);
      }
    }

    console.log('\n🎉 ADMIN SETUP COMPLETE!');
    console.log('\n📋 WORKING ADMIN CREDENTIALS:');
    console.log('   Option 1:');
    console.log('   📧 Email: admin@example.com');
    console.log('   🔑 Password: AdminPassword123!');
    console.log('');
    console.log('   Option 2:');
    console.log('   📧 Email: testadmin@example.com');
    console.log('   🔑 Password: TestPassword123!');
    console.log('');
    console.log('   Option 3 (Promoted User):');
    console.log('   📧 Email: carlos@apto.rio.br');
    console.log('   🔑 Password: [original password]');

    console.log('\n🌐 Login at: http://localhost:3000');
    console.log('   Use any of the admin credentials above');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
}

createAdminUser();
