const { default: fetch } = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function createTestUser() {
  try {
    console.log('🧪 Creating test user...');

    // Create a test user via the registration endpoint
    const registerResponse = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Admin',
        email: 'testadmin@example.com',
        password: 'TestPassword123!'
      })
    });

    const registerData = await registerResponse.json();
    console.log('Registration Status:', registerResponse.status);
    console.log('Registration Response:', registerData);

    if (registerResponse.ok && registerData.user) {
      console.log('✅ Test user created successfully!');
      
      // Now try to promote this user to admin via database
      const { Client } = require('pg');
      require('dotenv').config({ path: '.env.local' });
      
      const client = new Client({
        connectionString: process.env.DATABASE_URI
      });

      await client.connect();
      
      const updateResult = await client.query(`
        UPDATE users 
        SET role = 'admin'
        WHERE email = 'testadmin@example.com'
        RETURNING id, name, email, role
      `);

      if (updateResult.rows.length > 0) {
        console.log('✅ User promoted to admin:', updateResult.rows[0]);
        
        // Test login with the new admin user
        console.log('\n🔐 Testing login with new admin user...');
        const loginResponse = await fetch(`${BASE_URL}/api/users/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'testadmin@example.com',
            password: 'TestPassword123!'
          })
        });

        const loginData = await loginResponse.json();
        console.log('Login Status:', loginResponse.status);
        console.log('Login Response:', loginData);

        if (loginResponse.ok && loginData.token) {
          console.log('✅ Login successful! Testing user management access...');
          
          // Test accessing users endpoint
          const usersResponse = await fetch(`${BASE_URL}/api/users`, {
            headers: {
              'Authorization': `Bearer ${loginData.token}`,
              'Content-Type': 'application/json'
            }
          });

          const usersData = await usersResponse.json();
          console.log('Users API Status:', usersResponse.status);
          
          if (usersResponse.ok) {
            console.log('✅ Admin can access user management!');
            console.log(`Found ${usersData.docs ? usersData.docs.length : 0} users`);
          } else {
            console.log('❌ Admin cannot access user management');
            console.log('Error:', usersData);
          }
        }
      }
      
      await client.end();
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestUser();
