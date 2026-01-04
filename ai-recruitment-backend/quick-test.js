import axios from 'axios';

async function quickTest() {
  const BASE_URL = 'http://localhost:5000';
  
  console.log('🧪 Quick Test\n');
  
  // Test 1: Register
  const email = `quicktest${Date.now()}@example.com`;
  const password = 'Test@12345';
  
  console.log('1. Registering new recruiter...');
  console.log('   Email:', email);
  try {
    const registerRes = await axios.post(`${BASE_URL}/api/auth/register`, {
      email: email,
      password: password,
      fullName: 'Quick Test Recruiter',
      role: 'recruiter',
      companyName: 'Test Company',
      phone: '+923001111111',
      location: 'Karachi'
    });
    console.log('✅ Registration successful');
    const token = registerRes.data.data.token;
    console.log('   Token:', token.substring(0, 30) + '...');
    
    // Test 2: Create Job
    console.log('\n2. Creating test job...');
    const jobRes = await axios.post(`${BASE_URL}/api/jobs`, {
      title: 'Test Position',
      company: 'Test Company',
      location: 'Karachi',
      jobType: 'full-time',
      experienceLevel: 'intermediate',
      salaryRange: 'Rs. 100,000 - Rs. 150,000',
      description: 'Test job description',
      requirements: 'Test requirements',
      responsibilities: 'Test responsibilities',
      skills: ['JavaScript', 'React', 'Node.js']
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Job created successfully');
    console.log('   Job ID:', jobRes.data.data.id);
    
    const jobId = jobRes.data.data.id;
    
    // Test 3: Create Interview
    console.log('\n3. Creating interview...');
    const interviewRes = await axios.post(`${BASE_URL}/api/interviews`, {
      jobId: jobId,
      title: 'Quick Test Interview',
      description: 'Test interview',
      settings: {
        numberOfQuestions: 2,
        timePerQuestion: 60,
        skillCategories: ['technical', 'communication']
      }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Interview created successfully');
    console.log('   Interview ID:', interviewRes.data.data.interview.id);
    
    const interviewId = interviewRes.data.data.interview.id;
    
    // Test 4: Generate Questions
    console.log('\n4. Generating questions (this may take 5-10 seconds)...');
    const questionsRes = await axios.post(
      `${BASE_URL}/api/interviews/${interviewId}/generate-questions`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ Questions generated successfully');
    console.log(`   Generated ${questionsRes.data.data.questions.length} questions`);
    questionsRes.data.data.questions.forEach((q, i) => {
      console.log(`   Q${i+1}: ${q.questionText.substring(0, 60)}...`);
    });
    
    // Test 5: Get Interview Details
    console.log('\n5. Getting interview details...');
    const detailsRes = await axios.get(`${BASE_URL}/api/interviews/${interviewId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Interview details retrieved');
    console.log(`   Title: ${detailsRes.data.data.interview.title}`);
    console.log(`   Status: ${detailsRes.data.data.interview.status}`);
    console.log(`   Questions: ${detailsRes.data.data.interview.questions.length}`);
    
    console.log('\n🎉 All voice interview endpoints working correctly!');
    console.log('\n📝 Test Data Created:');
    console.log(`   Interview ID: ${interviewId}`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    
  } catch (error) {
    if (error.response?.data?.message?.includes('already exists')) {
      console.log('ℹ️  User already exists, trying login...');
      
      try {
        const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
          email: 'quicktest@example.com',
          password: 'Test@12345'
        });
        console.log('✅ Login successful');
        console.log('   Token:', loginRes.data.token.substring(0, 30) + '...');
      } catch (loginError) {
        console.error('❌ Login failed:', loginError.response?.data?.message || loginError.message);
      }
    } else {
      console.error('❌ Error:', error.response?.data?.message || error.message);
      if (error.response?.data) {
        console.error('   Details:', JSON.stringify(error.response.data, null, 2));
      }
    }
  }
}

quickTest();

