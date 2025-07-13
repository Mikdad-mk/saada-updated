const http = require('http');
const https = require('https');

console.log('🧪 Testing SA\'ADA Students\' Union Setup...\n');

const baseUrl = process.env.TEST_URL || 'http://localhost:3001';
const tests = [
  {
    name: 'Homepage',
    url: '/',
    expectedStatus: 200
  },
  {
    name: 'MongoDB Connection Test',
    url: '/api/test-mongodb',
    expectedStatus: 200,
    validateResponse: (data) => {
      try {
        const response = JSON.parse(data);
        return response.success === true;
      } catch {
        return false;
      }
    }
  },
  {
    name: 'Authentication Test Page',
    url: '/test-auth',
    expectedStatus: 200
  },
  {
    name: 'Login Page',
    url: '/login',
    expectedStatus: 200
  },
  {
    name: 'Signup Page',
    url: '/signup',
    expectedStatus: 200
  }
];

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          data: data,
          headers: res.headers
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runTests() {
  console.log(`📍 Testing against: ${baseUrl}\n`);
  
  let passedTests = 0;
  let totalTests = tests.length;
  
  for (const test of tests) {
    try {
      console.log(`🔍 Testing ${test.name}...`);
      const response = await makeRequest(`${baseUrl}${test.url}`);
      
      if (response.status === test.expectedStatus) {
        if (test.validateResponse) {
          if (test.validateResponse(response.data)) {
            console.log(`✅ ${test.name} - PASSED`);
            passedTests++;
          } else {
            console.log(`❌ ${test.name} - FAILED (Invalid response data)`);
          }
        } else {
          console.log(`✅ ${test.name} - PASSED`);
          passedTests++;
        }
      } else {
        console.log(`❌ ${test.name} - FAILED (Expected ${test.expectedStatus}, got ${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${test.name} - FAILED (${error.message})`);
    }
    
    console.log('');
  }
  
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Your setup is working correctly.');
    console.log('\n📝 Next steps:');
    console.log('1. Visit the homepage: ' + baseUrl);
    console.log('2. Test authentication: ' + baseUrl + '/test-auth');
    console.log('3. Try logging in with demo accounts');
    console.log('4. Explore the admin panel (if you have admin access)');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the setup guide.');
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure the development server is running');
    console.log('2. Check MongoDB connection');
    console.log('3. Verify environment variables');
    console.log('4. Clear cache: npm run clear-cache');
  }
}

// Check if server is running first
console.log('🔍 Checking if development server is running...\n');

makeRequest(baseUrl)
  .then(() => {
    console.log('✅ Development server is running!\n');
    return runTests();
  })
  .catch((error) => {
    console.log('❌ Development server is not running or not accessible');
    console.log('💡 Please start the development server first:');
    console.log('   npm run dev');
    console.log('\nThen run this test again.');
    process.exit(1);
  }); 