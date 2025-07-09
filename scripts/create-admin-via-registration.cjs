const { default: fetch } = require('node-fetch');
const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function createAdminViaRegistration() {
  try {
    console.log('🔧 CREATING ADMIN VIA PAYLOAD REGISTRATION\n');

    // Step 1: Create user via Payload's registration endpoint
    console.log('1️⃣ Creating user via Payload registration...');
    
    const registrationData = {
      name: 'Super Admin',
      email: 'superadmin@example.com',
      password: 'SuperAdmin123!'
    };

    const registerResponse = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData)
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('   ✅ User registered successfully via Payload!');
      console.log(`   👤 User: ${registerData.user ? registerData.user.name : registrationData.name}`);
      console.log(`   📧 Email: ${registrationData.email}`);
      console.log(`   🔑 Password: ${registrationData.password}`);
      
      // Step 2: Promote to admin in database
      console.log('\n2️⃣ Promoting user to admin...');
      const client = new Client({
        connectionString: process.env.DATABASE_URI
      });

      await client.connect();
      
      const promoteResult = await client.query(`
        UPDATE users 
        SET role = 'admin' 
        WHERE email = $1
        RETURNING id, name, email, role
      `, [registrationData.email]);

      if (promoteResult.rows.length > 0) {
        console.log('   ✅ User promoted to admin successfully!');
        console.log(`   👑 ${promoteResult.rows[0].name} is now an admin`);
      }

      await client.end();

      // Step 3: Test login
      console.log('\n3️⃣ Testing admin login...');
      const loginResponse = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registrationData.email,
          password: registrationData.password
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('   ✅ Admin login successful!');
        console.log(`   👤 Logged in as: ${loginData.user.name} (${loginData.user.role})`);
        console.log('   🎉 ADMIN ACCOUNT IS WORKING!');

        // Step 4: Test admin functionality
        console.log('\n4️⃣ Testing admin functionality...');
        const usersResponse = await fetch('http://localhost:3000/api/users', {
          headers: {
            'Authorization': `Bearer ${loginData.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          console.log('   ✅ Admin can access user management!');
          console.log(`   👥 Found ${usersData.docs.length} users in system`);
        }

        console.log('\n🎉 SUCCESS! WORKING ADMIN CREDENTIALS:');
        console.log(`   📧 Email: ${registrationData.email}`);
        console.log(`   🔑 Password: ${registrationData.password}`);
        console.log(`   👑 Role: admin`);

      } else {
        const loginError = await loginResponse.json();
        console.log('   ❌ Admin login failed');
        console.log(`   Error: ${loginError.message}`);
      }

    } else {
      const registerError = await registerResponse.json();
      console.log('   ❌ Registration failed');
      console.log(`   Error: ${registerError.message}`);
      
      if (registerError.message && registerError.message.includes('already exists')) {
        console.log('\n🔄 User already exists, trying to login...');
        const loginResponse = await fetch('http://localhost:3000/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: registrationData.email,
            password: registrationData.password
          })
        });

        if (loginResponse.ok) {
          const loginData = await loginResponse.json();
          console.log('   ✅ Existing user login successful!');
          console.log(`   👤 Logged in as: ${loginData.user.name} (${loginData.user.role})`);
        }
      }
    }

    console.log('\n🌐 Try logging in at: http://localhost:3000');
    console.log('   Use the credentials shown above');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAdminViaRegistration();
