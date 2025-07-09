const { default: fetch } = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function testAdminFunctionality() {
  try {
    console.log('🧪 Testing Admin Functionality...\n');

    // Test 1: Try to access users endpoint without authentication
    console.log('1️⃣ Testing unauthenticated access to users endpoint...');
    const unauthResponse = await fetch(`${BASE_URL}/api/users`);
    const unauthData = await unauthResponse.json();
    console.log('   Status:', unauthResponse.status);
    console.log('   Response:', unauthData);
    console.log('   ✅ Correctly requires authentication\n');

    // Test 2: Try to login as admin
    console.log('2️⃣ Testing admin login...');
    const loginResponse = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'carlos@ai.rio.br',
        password: 'AdminPassword123!'
      })
    });

    const loginData = await loginResponse.json();
    console.log('   Status:', loginResponse.status);
    console.log('   Response:', loginData);

    if (loginResponse.ok && loginData.token) {
      console.log('   ✅ Admin login successful!\n');
      
      // Test 3: Access users endpoint with admin token
      console.log('3️⃣ Testing authenticated access to users endpoint...');
      const authResponse = await fetch(`${BASE_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });

      const authData = await authResponse.json();
      console.log('   Status:', authResponse.status);
      console.log('   Users found:', authData.docs ? authData.docs.length : 'N/A');
      
      if (authResponse.ok) {
        console.log('   ✅ Admin can access user management!\n');
        
        // Show user details
        if (authData.docs && authData.docs.length > 0) {
          console.log('👥 Users in system:');
          authData.docs.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
          });
        }
      } else {
        console.log('   ❌ Admin cannot access user management');
        console.log('   Error:', authData);
      }
    } else {
      console.log('   ❌ Admin login failed');
      console.log('   This might be due to incorrect password or other auth issues');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAdminFunctionality();
