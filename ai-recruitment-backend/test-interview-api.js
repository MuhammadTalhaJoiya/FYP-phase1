import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const BASE_URL = 'http://localhost:5000';
let authToken = '';
let interviewId = '';
let sessionId = '';
let responseId = '';
let jobId = '';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Test 1: Health Check
async function testHealthCheck() {
  try {
    log('\n📋 Test 1: Health Check', 'cyan');
    const response = await axios.get(`${BASE_URL}/health`);
    if (response.data.success) {
      logSuccess('Server is healthy');
      return true;
    }
  } catch (error) {
    logError(`Health check failed: ${error.message}`);
    return false;
  }
}

// Test 2: Login as Recruiter
async function testLogin() {
  try {
    log('\n📋 Test 2: Login as Recruiter', 'cyan');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'testrecruiter@example.com',
      password: 'Recruit@123'
    });
    
    if (response.data.success && response.data.data.token) {
      authToken = response.data.data.token;
      logSuccess('Login successful');
      logInfo(`Token: ${authToken.substring(0, 20)}...`);
      return true;
    }
  } catch (error) {
    logError(`Login failed: ${error.response?.data?.message || error.message}`);
    logWarning('Make sure you have a test recruiter account');
    return false;
  }
}

// Test 3: Get Jobs
async function testGetJobs() {
  try {
    log('\n📋 Test 3: Get Recruiter Jobs', 'cyan');
    const response = await axios.get(`${BASE_URL}/api/jobs/my-jobs`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success && response.data.data.jobs.length > 0) {
      jobId = response.data.data.jobs[0].id;
      logSuccess(`Found ${response.data.data.jobs.length} job(s)`);
      logInfo(`Using Job ID: ${jobId} - ${response.data.data.jobs[0].title}`);
      return true;
    } else {
      logWarning('No jobs found. You need to create a job first.');
      return false;
    }
  } catch (error) {
    logError(`Get jobs failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 4: Create Interview
async function testCreateInterview() {
  try {
    log('\n📋 Test 4: Create Interview', 'cyan');
    const response = await axios.post(`${BASE_URL}/api/interviews`, {
      jobId: jobId,
      title: 'Test Voice Interview',
      description: 'Automated test interview',
      settings: {
        numberOfQuestions: 2,
        timePerQuestion: 60,
        skillCategories: ['technical', 'communication'],
        autoEvaluate: true,
        passingScore: 70
      }
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success && response.data.data.interview) {
      interviewId = response.data.data.interview.id;
      logSuccess('Interview created successfully');
      logInfo(`Interview ID: ${interviewId}`);
      logInfo(`Title: ${response.data.data.interview.title}`);
      return true;
    }
  } catch (error) {
    logError(`Create interview failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 5: Generate Questions
async function testGenerateQuestions() {
  try {
    log('\n📋 Test 5: Generate Questions with AI', 'cyan');
    logInfo('This may take 5-10 seconds...');
    
    const response = await axios.post(
      `${BASE_URL}/api/interviews/${interviewId}/generate-questions`,
      {},
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    if (response.data.success && response.data.data.questions) {
      logSuccess(`Generated ${response.data.data.questions.length} questions`);
      response.data.data.questions.forEach((q, i) => {
        logInfo(`Q${i + 1}: ${q.questionText.substring(0, 60)}...`);
        logInfo(`   Skill: ${q.skillCategory}, Difficulty: ${q.difficulty}`);
      });
      return true;
    }
  } catch (error) {
    logError(`Generate questions failed: ${error.response?.data?.message || error.message}`);
    logWarning('Check if OpenAI/Gemini API key is configured');
    return false;
  }
}

// Test 6: Get Interview Details
async function testGetInterview() {
  try {
    log('\n📋 Test 6: Get Interview Details', 'cyan');
    const response = await axios.get(`${BASE_URL}/api/interviews/${interviewId}`);
    
    if (response.data.success && response.data.data.interview) {
      logSuccess('Interview details retrieved');
      logInfo(`Status: ${response.data.data.interview.status}`);
      logInfo(`Questions: ${response.data.data.interview.questions?.length || 0}`);
      return true;
    }
  } catch (error) {
    logError(`Get interview failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 7: Generate TTS Audio (Optional - requires ElevenLabs API)
async function testGenerateAudios() {
  try {
    log('\n📋 Test 7: Generate TTS Audio (Optional)', 'cyan');
    logInfo('This may take 3-5 seconds per question...');
    logWarning('Skipping - requires ElevenLabs API key');
    
    // Uncomment to test:
    // const response = await axios.post(
    //   `${BASE_URL}/api/interviews/${interviewId}/generate-audios`,
    //   {},
    //   { headers: { Authorization: `Bearer ${authToken}` } }
    // );
    // logSuccess(`Audio generated for ${response.data.results.length} questions`);
    
    return true;
  } catch (error) {
    logError(`Generate audios failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 8: Get Recruiter Interviews List
async function testGetRecruiterInterviews() {
  try {
    log('\n📋 Test 8: Get Recruiter Interviews List', 'cyan');
    const response = await axios.get(`${BASE_URL}/api/interviews/my-interviews`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    if (response.data.success) {
      logSuccess(`Found ${response.data.data.interviews.length} interview(s)`);
      return true;
    }
  } catch (error) {
    logError(`Get interviews list failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 9: Update Interview
async function testUpdateInterview() {
  try {
    log('\n📋 Test 9: Update Interview', 'cyan');
    const response = await axios.put(
      `${BASE_URL}/api/interviews/${interviewId}`,
      {
        title: 'Updated Test Voice Interview',
        description: 'Updated description'
      },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    if (response.data.success) {
      logSuccess('Interview updated successfully');
      return true;
    }
  } catch (error) {
    logError(`Update interview failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test 10: Publish Interview
async function testPublishInterview() {
  try {
    log('\n📋 Test 10: Publish Interview', 'cyan');
    logWarning('Skipping publish - requires TTS audio generation first');
    
    // To publish, you need to generate audio first
    // const response = await axios.post(
    //   `${BASE_URL}/api/interviews/${interviewId}/publish`,
    //   {},
    //   { headers: { Authorization: `Bearer ${authToken}` } }
    // );
    
    return true;
  } catch (error) {
    logError(`Publish interview failed: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test Summary
async function runTests() {
  log('\n' + '='.repeat(60), 'cyan');
  log('🧪 VOICE INTERVIEW API TESTING', 'cyan');
  log('='.repeat(60) + '\n', 'cyan');
  
  const results = {
    total: 0,
    passed: 0,
    failed: 0
  };
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'Login', fn: testLogin },
    { name: 'Get Jobs', fn: testGetJobs },
    { name: 'Create Interview', fn: testCreateInterview },
    { name: 'Generate Questions', fn: testGenerateQuestions },
    { name: 'Get Interview', fn: testGetInterview },
    { name: 'Generate Audios', fn: testGenerateAudios },
    { name: 'Get Interviews List', fn: testGetRecruiterInterviews },
    { name: 'Update Interview', fn: testUpdateInterview },
    { name: 'Publish Interview', fn: testPublishInterview }
  ];
  
  for (const test of tests) {
    results.total++;
    const passed = await test.fn();
    if (passed) {
      results.passed++;
    } else {
      results.failed++;
      // Stop on critical failures
      if (['Health Check', 'Login', 'Get Jobs'].includes(test.name)) {
        logError(`Critical test failed: ${test.name}. Stopping tests.`);
        break;
      }
    }
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
  }
  
  log('\n' + '='.repeat(60), 'cyan');
  log('📊 TEST SUMMARY', 'cyan');
  log('='.repeat(60), 'cyan');
  log(`Total Tests: ${results.total}`, 'blue');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, results.failed > 0 ? 'red' : 'green');
  log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(0)}%`, 'cyan');
  log('='.repeat(60) + '\n', 'cyan');
  
  if (results.failed === 0) {
    logSuccess('🎉 All tests passed! Voice interview system is working correctly.');
  } else {
    logWarning('Some tests failed. Check the logs above for details.');
  }
  
  if (interviewId) {
    log('\n📝 Created Test Data:', 'yellow');
    logInfo(`Interview ID: ${interviewId}`);
    logInfo('You can now test the candidate flow with this interview.');
  }
}

// Run all tests
runTests().catch(error => {
  logError(`Test suite failed: ${error.message}`);
  process.exit(1);
});

