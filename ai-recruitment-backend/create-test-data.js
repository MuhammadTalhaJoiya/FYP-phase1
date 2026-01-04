import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

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

async function createTestData() {
  log('\n🔧 Creating Test Data for Voice Interview System\n', 'cyan');
  
  try {
    // 1. Create Test Recruiter
    log('1️⃣  Creating test recruiter account...', 'blue');
    try {
      const recruiterResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
        email: 'testrecruiter@example.com',
        password: 'Recruit@123',
        fullName: 'Test Recruiter',
        role: 'recruiter',
        phone: '+923001234567',
        location: 'Karachi, Pakistan',
        companyName: 'Test Tech Company',
        companyWebsite: 'https://testtech.com'
      });
      
      if (recruiterResponse.data.success) {
        log('✅ Test recruiter created', 'green');
        const token = recruiterResponse.data.token;
        
        // 2. Create Test Job
        log('2️⃣  Creating test job posting...', 'blue');
        const jobResponse = await axios.post(`${BASE_URL}/api/jobs`, {
          title: 'Senior Frontend Developer',
          company: 'Test Tech Company',
          location: 'Karachi, Pakistan',
          jobType: 'full-time',
          experienceLevel: 'senior',
          salaryRange: 'Rs. 150,000 - Rs. 250,000',
          description: 'We are looking for an experienced Frontend Developer to join our team.',
          requirements: 'Strong experience with React, JavaScript, TypeScript, and modern web technologies. 5+ years of experience required.',
          responsibilities: 'Develop and maintain web applications, collaborate with team, code reviews.',
          skills: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Redux'],
          benefits: 'Health insurance, flexible hours, remote work options'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (jobResponse.data.success) {
          log('✅ Test job created', 'green');
          log(`   Job ID: ${jobResponse.data.job.id}`, 'blue');
          log(`   Title: ${jobResponse.data.job.title}`, 'blue');
        }
        
        // 3. Create Test Candidate
        log('3️⃣  Creating test candidate account...', 'blue');
        try {
          const candidateResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
            email: 'testcandidate@example.com',
            password: 'Test@123',
            fullName: 'Test Candidate',
            role: 'candidate',
            phone: '+923009876543',
            location: 'Lahore, Pakistan'
          });
          
          if (candidateResponse.data.success) {
            log('✅ Test candidate created', 'green');
          }
        } catch (error) {
          if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
            log('ℹ️  Test candidate already exists', 'yellow');
          } else {
            throw error;
          }
        }
        
        log('\n✅ Test data created successfully!\n', 'green');
        log('📝 Test Credentials:', 'cyan');
        log('   Recruiter:', 'blue');
        log('   - Email: testrecruiter@example.com', 'blue');
        log('   - Password: Recruit@123', 'blue');
        log('   Candidate:', 'blue');
        log('   - Email: testcandidate@example.com', 'blue');
        log('   - Password: Test@123\n', 'blue');
        
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
        log('ℹ️  Test recruiter already exists', 'yellow');
        
        // Login and create job if needed
        const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
          email: 'testrecruiter@example.com',
          password: 'Recruit@123'
        });
        
        const token = loginResponse.data.token;
        
        // Check if job exists
        const jobsResponse = await axios.get(`${BASE_URL}/api/jobs/my-jobs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (jobsResponse.data.jobs.length === 0) {
          log('2️⃣  Creating test job posting...', 'blue');
          const jobResponse = await axios.post(`${BASE_URL}/api/jobs`, {
            title: 'Senior Frontend Developer',
            company: 'Test Tech Company',
            location: 'Karachi, Pakistan',
            jobType: 'full-time',
            experienceLevel: 'senior',
            salaryRange: 'Rs. 150,000 - Rs. 250,000',
            description: 'We are looking for an experienced Frontend Developer to join our team.',
            requirements: 'Strong experience with React, JavaScript, TypeScript, and modern web technologies. 5+ years of experience required.',
            responsibilities: 'Develop and maintain web applications, collaborate with team, code reviews.',
            skills: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Redux'],
            benefits: 'Health insurance, flexible hours, remote work options'
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (jobResponse.data.success) {
            log('✅ Test job created', 'green');
            log(`   Job ID: ${jobResponse.data.job.id}`, 'blue');
          }
        } else {
          log('ℹ️  Test job already exists', 'yellow');
        }
        
        log('\n✅ Test data verified!\n', 'green');
        log('📝 Test Credentials:', 'cyan');
        log('   Recruiter:', 'blue');
        log('   - Email: testrecruiter@example.com', 'blue');
        log('   - Password: Recruit@123\n', 'blue');
      } else {
        throw error;
      }
    }
    
  } catch (error) {
    log(`\n❌ Error: ${error.response?.data?.message || error.message}`, 'red');
    process.exit(1);
  }
}

createTestData();

