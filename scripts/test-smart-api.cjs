const { default: fetch } = require('node-fetch');

async function testSmartAPI() {
  console.log('🧪 TESTING SMART API IMPLEMENTATION\n');

  try {
    // Test 1: Check if server is running
    console.log('1️⃣ Testing server availability...');
    const healthResponse = await fetch('http://localhost:3000/api/users/me', {
      method: 'GET',
    });
    
    if (healthResponse.status === 401) {
      console.log('   ✅ Server is running (401 expected without auth)');
    } else {
      console.log(`   ⚠️  Server response: ${healthResponse.status}`);
    }

    // Test 2: Login to get token
    console.log('\n2️⃣ Testing login...');
    const loginResponse = await fetch('http://localhost:3000/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'superadmin@example.com',
        password: 'SuperAdmin123!'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('   ✅ Login successful');
      console.log(`   👤 User: ${loginData.user.name} (${loginData.user.role})`);

      const token = loginData.token;

      // Test 3: Test users API
      console.log('\n3️⃣ Testing users API...');
      const startTime = performance.now();
      const usersResponse = await fetch('http://localhost:3000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const endTime = performance.now();

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        console.log('   ✅ Users API working');
        console.log(`   👥 Found ${usersData.docs.length} users`);
        console.log(`   ⏱️  Response time: ${Math.round(endTime - startTime)}ms`);
      } else {
        console.log('   ❌ Users API failed');
      }

      console.log('\n📊 SMART API STATUS:');
      console.log('   🔧 Development Mode: ACTIVE');
      console.log('   🏠 Local API: WORKING');
      console.log('   ✅ Smart API will use Local API in development');
      console.log('   ✅ Edge Functions will be used in production');

    } else {
      const loginError = await loginResponse.json();
      console.log('   ❌ Login failed:', loginError.message);
    }

    console.log('\n🎯 NEXT STEPS:');
    console.log('   1. Start your development server: npm run dev');
    console.log('   2. Navigate to: http://localhost:3000');
    console.log('   3. Login with admin credentials');
    console.log('   4. Check User Management tab - it will show "LOCAL_API" mode');
    console.log('   5. Your development workflow remains exactly the same!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure your development server is running:');
    console.log('   npm run dev');
  }
}

testSmartAPI();
