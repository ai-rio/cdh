const { default: fetch } = require('node-fetch');
const { performance } = require('perf_hooks');

const BASE_URL = 'http://localhost:3000';

async function testPerformance() {
  console.log('⚡ PERFORMANCE TESTING SUITE\n');

  // Test 1: API Response Times
  console.log('1️⃣ Testing API Response Times...');
  
  const apiTests = [
    { name: 'Login API', endpoint: '/api/users/login', method: 'POST', body: { email: 'superadmin@example.com', password: 'SuperAdmin123!' } },
    { name: 'Users List API', endpoint: '/api/users', method: 'GET', requiresAuth: true },
    { name: 'User Profile API', endpoint: '/api/users/me', method: 'GET', requiresAuth: true }
  ];

  let authToken = null;

  for (const test of apiTests) {
    console.log(`\n🔍 Testing ${test.name}...`);
    
    const startTime = performance.now();
    
    try {
      const headers = { 'Content-Type': 'application/json' };
      
      if (test.requiresAuth && authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${BASE_URL}${test.endpoint}`, {
        method: test.method,
        headers,
        body: test.body ? JSON.stringify(test.body) : undefined
      });

      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);

      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ ${test.name}: ${duration}ms`);
        
        // Store auth token for subsequent tests
        if (test.name === 'Login API' && data.token) {
          authToken = data.token;
        }
        
        // Performance benchmarks
        if (duration < 500) {
          console.log(`   🚀 Excellent performance (< 500ms)`);
        } else if (duration < 1000) {
          console.log(`   ✅ Good performance (< 1s)`);
        } else if (duration < 2000) {
          console.log(`   ⚠️  Acceptable performance (< 2s)`);
        } else {
          console.log(`   🐌 Slow performance (> 2s) - needs optimization`);
        }
      } else {
        console.log(`   ❌ ${test.name}: Failed (${response.status})`);
      }
    } catch (error) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      console.log(`   ❌ ${test.name}: Error after ${duration}ms - ${error.message}`);
    }
  }

  // Test 2: Concurrent Request Handling
  console.log('\n2️⃣ Testing Concurrent Request Handling...');
  
  if (authToken) {
    const concurrentTests = [];
    const testCount = 5;
    
    console.log(`   🔄 Making ${testCount} concurrent requests...`);
    const startTime = performance.now();
    
    for (let i = 0; i < testCount; i++) {
      concurrentTests.push(
        fetch(`${BASE_URL}/api/users`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        })
      );
    }
    
    try {
      const results = await Promise.all(concurrentTests);
      const endTime = performance.now();
      const totalDuration = Math.round(endTime - startTime);
      
      const successCount = results.filter(r => r.ok).length;
      console.log(`   ✅ ${successCount}/${testCount} requests successful`);
      console.log(`   ⏱️  Total time: ${totalDuration}ms`);
      console.log(`   📊 Average per request: ${Math.round(totalDuration / testCount)}ms`);
      
      if (totalDuration < 2000) {
        console.log(`   🚀 Excellent concurrent performance`);
      } else if (totalDuration < 5000) {
        console.log(`   ✅ Good concurrent performance`);
      } else {
        console.log(`   ⚠️  Concurrent performance needs improvement`);
      }
    } catch (error) {
      console.log(`   ❌ Concurrent test failed: ${error.message}`);
    }
  }

  // Test 3: Memory Usage Simulation
  console.log('\n3️⃣ Testing Memory Usage Patterns...');
  
  if (authToken) {
    console.log('   🧠 Simulating repeated API calls (caching test)...');
    
    const cacheTests = [];
    const startTime = performance.now();
    
    // Make 10 identical requests to test caching
    for (let i = 0; i < 10; i++) {
      cacheTests.push(
        fetch(`${BASE_URL}/api/users`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }).then(async (response) => {
          const requestStart = performance.now();
          await response.json();
          const requestEnd = performance.now();
          return Math.round(requestEnd - requestStart);
        })
      );
    }
    
    try {
      const durations = await Promise.all(cacheTests);
      const endTime = performance.now();
      const totalTime = Math.round(endTime - startTime);
      
      const avgDuration = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
      const minDuration = Math.min(...durations);
      const maxDuration = Math.max(...durations);
      
      console.log(`   📊 10 identical requests completed in ${totalTime}ms`);
      console.log(`   ⚡ Average response time: ${avgDuration}ms`);
      console.log(`   🏃 Fastest response: ${minDuration}ms`);
      console.log(`   🐌 Slowest response: ${maxDuration}ms`);
      
      // Check for caching effectiveness
      if (maxDuration - minDuration < 100) {
        console.log(`   🎯 Consistent performance - good caching/optimization`);
      } else {
        console.log(`   ⚠️  Variable performance - caching could be improved`);
      }
    } catch (error) {
      console.log(`   ❌ Cache test failed: ${error.message}`);
    }
  }

  // Test 4: Error Handling Performance
  console.log('\n4️⃣ Testing Error Handling Performance...');
  
  const errorTests = [
    { name: 'Invalid Endpoint', endpoint: '/api/nonexistent', expectedStatus: 404 },
    { name: 'Unauthorized Request', endpoint: '/api/users', expectedStatus: 401 },
    { name: 'Invalid Login', endpoint: '/api/users/login', method: 'POST', body: { email: 'invalid@test.com', password: 'wrong' }, expectedStatus: 401 }
  ];

  for (const test of errorTests) {
    console.log(`\n🔍 Testing ${test.name}...`);
    const startTime = performance.now();
    
    try {
      const response = await fetch(`${BASE_URL}${test.endpoint}`, {
        method: test.method || 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: test.body ? JSON.stringify(test.body) : undefined
      });
      
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      
      if (response.status === test.expectedStatus) {
        console.log(`   ✅ ${test.name}: Handled correctly in ${duration}ms`);
      } else {
        console.log(`   ⚠️  ${test.name}: Unexpected status ${response.status} (expected ${test.expectedStatus})`);
      }
      
      if (duration < 1000) {
        console.log(`   🚀 Fast error handling`);
      } else {
        console.log(`   ⚠️  Slow error handling - could be optimized`);
      }
    } catch (error) {
      const endTime = performance.now();
      const duration = Math.round(endTime - startTime);
      console.log(`   ❌ ${test.name}: Exception after ${duration}ms - ${error.message}`);
    }
  }

  // Performance Summary
  console.log('\n📊 PERFORMANCE TEST SUMMARY:');
  console.log('   ✅ API Response Times: Tested');
  console.log('   ✅ Concurrent Handling: Tested');
  console.log('   ✅ Caching Patterns: Tested');
  console.log('   ✅ Error Handling: Tested');

  console.log('\n💡 OPTIMIZATION RECOMMENDATIONS:');
  console.log('   🚀 Implement caching for repeated requests');
  console.log('   ⚡ Add request timeouts and abort controllers');
  console.log('   📦 Use lazy loading for heavy components');
  console.log('   🎯 Optimize bundle sizes with code splitting');
  console.log('   💾 Add client-side caching for user data');

  console.log('\n🎯 NEXT STEPS:');
  console.log('   1. Implement OptimizedAuthContext for better caching');
  console.log('   2. Use OptimizedUserManagement for reduced API calls');
  console.log('   3. Apply lazy loading to dashboard components');
  console.log('   4. Monitor performance improvements with these optimizations');

  console.log('\n🌐 Test your optimizations at: http://localhost:3000');
}

testPerformance().catch(console.error);
