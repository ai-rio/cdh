const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function fixAdminLogin() {
  try {
    console.log('🔧 Fixing Admin Login Issue...\n');

    // First, let's check what users exist
    const client = new Client({
      connectionString: process.env.DATABASE_URI
    });

    await client.connect();
    console.log('📋 Current users in database:');
    
    const usersQuery = await client.query(`
      SELECT id, name, email, role, hash 
      FROM users 
      ORDER BY created_at
    `);

    usersQuery.rows.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email}) - ${user.role}`);
      console.log(`      Hash exists: ${user.hash ? 'Yes' : 'No'}`);
    });

    // Find the problematic admin user
    const adminUser = usersQuery.rows.find(u => u.email === 'carlos@ai.rio.br');
    
    if (adminUser) {
      console.log(`\n🎯 Found problematic admin: ${adminUser.name}`);
      
      // Delete the problematic admin user
      console.log('🗑️  Removing problematic admin user...');
      await client.query('DELETE FROM users WHERE email = $1', ['carlos@ai.rio.br']);
      console.log('   ✅ Problematic admin user removed');
    }

    await client.end();

    // Now create a fresh admin user using the API (which will use Payload's proper hashing)
    console.log('\n👤 Creating fresh admin user via API...');
    
    const { default: fetch } = require('node-fetch');
    
    // First login with the working test admin
    const loginResponse = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testadmin@example.com',
        password: 'TestPassword123!'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Could not login with test admin');
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;

    // Create new admin user with proper Payload authentication
    const createResponse = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Carlos Nunes',
        email: 'carlos@ai.rio.br',
        password: 'AdminPassword123!',
        role: 'admin'
      })
    });

    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('   ✅ Fresh admin user created successfully!');
      console.log(`   👤 User: ${createData.user ? createData.user.name : 'Carlos Nunes'}`);
      console.log(`   📧 Email: carlos@ai.rio.br`);
      console.log(`   🔑 Password: AdminPassword123!`);
      console.log(`   👑 Role: admin`);
    } else {
      const createError = await createResponse.json();
      console.log('   ❌ Failed to create fresh admin user');
      console.log(`   Error: ${createError.message}`);
    }

    // Test the login
    console.log('\n🧪 Testing login with fixed admin account...');
    const testLoginResponse = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'carlos@ai.rio.br',
        password: 'AdminPassword123!'
      })
    });

    if (testLoginResponse.ok) {
      const testLoginData = await testLoginResponse.json();
      console.log('   ✅ Login test successful!');
      console.log(`   👤 Logged in as: ${testLoginData.user.name} (${testLoginData.user.role})`);
      console.log('   🎉 Admin login issue is FIXED!');
    } else {
      const testLoginError = await testLoginResponse.json();
      console.log('   ❌ Login test failed');
      console.log(`   Error: ${testLoginError.message}`);
    }

    console.log('\n📋 WORKING ADMIN CREDENTIALS:');
    console.log('   Primary Admin:');
    console.log('   📧 Email: testadmin@example.com');
    console.log('   🔑 Password: TestPassword123!');
    console.log('');
    console.log('   Secondary Admin:');
    console.log('   📧 Email: carlos@ai.rio.br');
    console.log('   🔑 Password: AdminPassword123!');

    console.log('\n🌐 You can now login at: http://localhost:3000');

  } catch (error) {
    console.error('❌ Error fixing admin login:', error.message);
  }
}

fixAdminLogin();
