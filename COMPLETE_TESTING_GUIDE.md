# 🧪 Complete Project Testing Guide

Your AI Recruitment Platform is running and ready to test!

---

## ✅ System Status

| Component | Status | URL |
|-----------|--------|-----|
| **Frontend** | ✅ Running | http://localhost:3000 |
| **Backend API** | ✅ Running | http://localhost:5000 |
| **MySQL Database** | ✅ Connected | localhost:3306 |
| **Cloudinary** | ✅ Configured | Cloud Storage Ready |
| **Gemini AI** | ✅ Configured | AI Features Active |

---

## 🎯 Quick Start Testing

### 1. Open the Application

**Open in your browser:**
```
http://localhost:3000
```

You should see the landing page with:
- Hero section
- Features showcase
- Get Started / Login buttons

---

## 👤 Test Accounts

### Candidate Account
```
Email: testcandidate@example.com
Password: Test@123
Role: Candidate
```

### Admin Account (can do everything)
```
Email: testrecruiter@example.com
Password: Recruit@123
Role: Admin (has recruiter + admin powers)
```

---

## 🧪 Testing Workflow

### **Test 1: User Registration** (5 min)

**Frontend**:
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Fill in the form:
   - Name: Your Name
   - Email: newemail@example.com
   - Password: Test@123
   - Role: Candidate
4. Click "Create Account"

**Expected Result**: ✅
- Account created successfully
- Redirected to dashboard
- Welcome message displayed

**Backend Test** (Optional):
```powershell
$body = @{
    email = "newemail@example.com"
    password = "Test@123"
    fullName = "New User"
    role = "candidate"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $body -ContentType "application/json"
```

---

### **Test 2: User Login** (3 min)

**Frontend**:
1. Click "Logout" (if logged in)
2. Click "Login"
3. Enter credentials:
   - Email: testcandidate@example.com
   - Password: Test@123
4. Click "Sign In"

**Expected Result**: ✅
- Login successful
- Redirected to Candidate Dashboard
- Profile information displayed

**Backend Test**:
```powershell
$loginBody = @{
    email = "testcandidate@example.com"
    password = "Test@123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.data.token
Write-Host "Token: $($token.Substring(0, 30))..."
```

---

### **Test 3: Browse Jobs** (5 min)

**Frontend**:
1. From dashboard, click "Browse Jobs"
2. View the job listings (2 test jobs should be visible)
3. Use search bar: Type "Developer"
4. Use filters:
   - Job Type: Full-time
   - Experience Level: Senior
   - Location: Karachi
5. Click on a job to view details

**Expected Result**: ✅
- Jobs display with details (title, company, salary)
- Search filters results
- Filters update the job list
- Job details page shows full information

**Backend Test**:
```powershell
# Get all jobs
$jobs = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs" -Method GET
Write-Host "Total Jobs: $($jobs.data.pagination.total)"

# Search jobs
$searchResults = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs?search=Developer" -Method GET
Write-Host "Search Results: $($searchResults.data.pagination.total)"
```

---

### **Test 4: Job Application** (CV Upload Required) (10 min)

**Frontend**:
1. Browse to a job
2. Click "Apply Now"
3. Upload your CV (PDF, DOC, or DOCX - max 5MB)
4. Write a cover letter (optional)
5. Click "Submit Application"

**Expected Result**: ✅
- CV uploads to Cloudinary
- AI analysis runs in background
- Application submitted successfully
- Match score calculated
- Notification sent to recruiter

**⚠️ Note**: Requires a CV file. You can use any resume PDF.

**Backend Test**:
```powershell
# This requires multipart form data - easier to test via frontend
# Or use Postman for multipart requests
```

---

### **Test 5: CV Upload & Analysis** (10 min)

**Frontend**:
1. Go to "Upload CV" page
2. Select a CV file (PDF, DOC, DOCX)
3. Click "Analyze CV"
4. Wait for AI analysis (3-5 seconds)

**Expected Result**: ✅
- CV uploads to Cloudinary
- AI extracts information:
  - Skills identified
  - Experience summary
  - Education details
  - Strengths and recommendations
- Analysis count decrements (5 free per month)

**Track Usage**:
- Free users: 5 analyses per month
- Premium users: Unlimited

---

### **Test 6: Notifications** (5 min)

**Frontend**:
1. Look for notification bell icon (top right)
2. Click on it
3. View notifications

**Expected Result**: ✅
- Notification panel opens
- Shows all notifications
- Unread count badge
- Can mark as read
- Can delete notifications

**Backend Test**:
```powershell
# Login and get notifications
$candidate = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body (@{ email = "testcandidate@example.com"; password = "Test@123" } | ConvertTo-Json) -ContentType "application/json"
$token = $candidate.data.token
$headers = @{ "Authorization" = "Bearer $token" }

$notifications = Invoke-RestMethod -Uri "http://localhost:5000/api/notifications" -Method GET -Headers $headers
Write-Host "Notifications: $($notifications.data.pagination.total)"
Write-Host "Unread: $($notifications.data.pagination.unreadCount)"
```

---

### **Test 7: AI Chatbot** (5 min)

**Frontend**:
1. Look for chatbot icon (bottom right, floating)
2. Click to open chat
3. Type a question:
   - "How do I write a good CV?"
   - "What skills are in demand?"
   - "How to prepare for interviews?"
4. Get AI response

**Expected Result**: ✅
- Chatbot opens
- AI responds to questions
- Helpful career advice provided

**Backend Test**:
```powershell
$chatBody = @{
    message = "How do I write a good CV?"
} | ConvertTo-Json

$chatResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/chatbot/message" -Method POST -Body $chatBody -ContentType "application/json"
Write-Host "AI Response: $($chatResponse.data.message)"
```

---

### **Test 8: Admin Dashboard** (10 min)

**Frontend** (if admin UI is built):
1. Login as admin (testrecruiter@example.com)
2. Access admin panel
3. View platform statistics
4. Manage users
5. Moderate content

**Backend Test**:
```powershell
# Login as admin
$adminLogin = @{
    email = "testrecruiter@example.com"
    password = "Recruit@123"
} | ConvertTo-Json

$admin = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $adminLogin -ContentType "application/json"
$adminToken = $admin.data.token
$headers = @{ "Authorization" = "Bearer $adminToken" }

# Get platform statistics
$stats = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/stats" -Method GET -Headers $headers

Write-Host "=== Platform Statistics ===" -ForegroundColor Cyan
Write-Host "Total Users: $($stats.data.users.total)"
Write-Host "Candidates: $($stats.data.users.candidates)"
Write-Host "Recruiters: $($stats.data.users.recruiters)"
Write-Host "Total Jobs: $($stats.data.jobs.total)"
Write-Host "Active Jobs: $($stats.data.jobs.active)"
Write-Host "Total Applications: $($stats.data.applications.total)"
```

---

### **Test 9: Job Posting** (Recruiter/Admin) (10 min)

**Backend Test** (Frontend UI may need to be built):
```powershell
# Login as admin/recruiter
$recruiter = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body (@{ email = "testrecruiter@example.com"; password = "Recruit@123" } | ConvertTo-Json) -ContentType "application/json"
$token = $recruiter.data.token
$headers = @{ "Authorization" = "Bearer $token" }

# Create a new job
$jobBody = @{
    title = "React Developer"
    company = "Tech Innovations"
    location = "Lahore, Pakistan"
    jobType = "full-time"
    experienceLevel = "intermediate"
    salaryRange = "Rs. 90,000 - Rs. 130,000"
    description = "We are looking for a skilled React developer"
    requirements = "3+ years of React experience, TypeScript knowledge"
    responsibilities = "Build user interfaces, write clean code"
    skills = @("React", "JavaScript", "TypeScript", "CSS")
    benefits = "Health insurance, flexible hours"
    isRemote = $true
} | ConvertTo-Json

$newJob = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs" -Method POST -Headers $headers -Body $jobBody -ContentType "application/json"

Write-Host "✅ Job Created!" -ForegroundColor Green
Write-Host "Job ID: $($newJob.data.id)"
Write-Host "Title: $($newJob.data.title)"
```

---

### **Test 10: Search & Filtering** (5 min)

**Frontend**:
1. Go to Browse Jobs page
2. Test each filter:
   - Search: "React"
   - Job Type: Remote
   - Experience: Intermediate
   - Location: Lahore
3. Combine multiple filters

**Expected Result**: ✅
- Results update in real-time
- Job count updates
- Pagination works
- Filters can be combined

**Backend Test**:
```powershell
# Test various filters
$search = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs?search=React" -Method GET
Write-Host "Search 'React': $($search.data.pagination.total) jobs"

$remote = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs?jobType=remote" -Method GET
Write-Host "Remote jobs: $($remote.data.pagination.total)"

$combined = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs?search=Developer&jobType=full-time&experienceLevel=senior" -Method GET
Write-Host "Combined filters: $($combined.data.pagination.total) jobs"
```

---

### **Test 11: Profile Management** (5 min)

**Frontend**:
1. Click on Profile/Settings
2. Update your information:
   - Name
   - Location
   - Bio
   - Phone
3. Upload profile picture
4. Save changes

**Expected Result**: ✅
- Profile updates saved
- Picture uploads to Cloudinary
- Changes persist after refresh

**Backend Test**:
```powershell
$candidate = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body (@{ email = "testcandidate@example.com"; password = "Test@123" } | ConvertTo-Json) -ContentType "application/json"
$token = $candidate.data.token
$headers = @{ "Authorization" = "Bearer $token" }

# Update profile
$updateBody = @{
    fullName = "Updated Name"
    bio = "Experienced developer with 5 years in React"
    location = "Lahore, Pakistan"
} | ConvertTo-Json

$updated = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" -Method PUT -Headers $headers -Body $updateBody -ContentType "application/json"

Write-Host "✅ Profile Updated!"
Write-Host "Name: $($updated.data.fullName)"
Write-Host "Bio: $($updated.data.bio)"
```

---

## 🎨 Visual Testing Checklist

### Landing Page
- [ ] Hero section displays
- [ ] Features section visible
- [ ] Call-to-action buttons work
- [ ] Responsive design (try different screen sizes)
- [ ] Smooth animations

### Dashboard (Candidate)
- [ ] Statistics cards display
- [ ] Recent applications show
- [ ] Analytics charts render
- [ ] Navigation works
- [ ] Profile picture displays

### Job Browsing
- [ ] Job cards display nicely
- [ ] Search bar works
- [ ] Filters are accessible
- [ ] Pagination works
- [ ] Job details page loads

### Forms
- [ ] Input validation works
- [ ] Error messages display
- [ ] Success messages show
- [ ] Loading states work
- [ ] File upload works

---

## 🔍 API Endpoint Testing (Complete List)

### Authentication (6 endpoints)
```powershell
# 1. Register
POST http://localhost:5000/api/auth/register

# 2. Login
POST http://localhost:5000/api/auth/login

# 3. Get Profile
GET http://localhost:5000/api/auth/profile
Headers: Authorization: Bearer {token}

# 4. Update Profile
PUT http://localhost:5000/api/auth/profile
Headers: Authorization: Bearer {token}

# 5. Change Password
POST http://localhost:5000/api/auth/change-password
Headers: Authorization: Bearer {token}

# 6. Get Stats
GET http://localhost:5000/api/auth/stats
Headers: Authorization: Bearer {token}
```

### Jobs (7 endpoints)
```powershell
# 1. Get All Jobs (Public)
GET http://localhost:5000/api/jobs

# 2. Get Job by ID
GET http://localhost:5000/api/jobs/:id

# 3. Create Job (Recruiter)
POST http://localhost:5000/api/jobs
Headers: Authorization: Bearer {recruiter_token}

# 4. Update Job
PUT http://localhost:5000/api/jobs/:id
Headers: Authorization: Bearer {recruiter_token}

# 5. Delete Job
DELETE http://localhost:5000/api/jobs/:id
Headers: Authorization: Bearer {recruiter_token}

# 6. Get Recruiter Jobs
GET http://localhost:5000/api/jobs/recruiter/my-jobs
Headers: Authorization: Bearer {recruiter_token}

# 7. Get Job Stats
GET http://localhost:5000/api/jobs/:id/stats
Headers: Authorization: Bearer {recruiter_token}
```

### Applications (6 endpoints)
```powershell
# 1. Submit Application
POST http://localhost:5000/api/applications
Headers: Authorization: Bearer {candidate_token}
Body: multipart/form-data (cv file + jobId)

# 2. Get My Applications
GET http://localhost:5000/api/applications/my-applications
Headers: Authorization: Bearer {candidate_token}

# 3. Get Job Applications (Recruiter)
GET http://localhost:5000/api/applications/job/:jobId
Headers: Authorization: Bearer {recruiter_token}

# 4. Get Application by ID
GET http://localhost:5000/api/applications/:id
Headers: Authorization: Bearer {token}

# 5. Update Application Status
PUT http://localhost:5000/api/applications/:id/status
Headers: Authorization: Bearer {recruiter_token}

# 6. Withdraw Application
DELETE http://localhost:5000/api/applications/:id
Headers: Authorization: Bearer {candidate_token}
```

### Notifications (10 endpoints)
```powershell
# 1. Get Notifications
GET http://localhost:5000/api/notifications
Headers: Authorization: Bearer {token}

# 2. Get Unread Count
GET http://localhost:5000/api/notifications/unread-count
Headers: Authorization: Bearer {token}

# 3. Get Notification by ID
GET http://localhost:5000/api/notifications/:id
Headers: Authorization: Bearer {token}

# 4. Mark as Read
PUT http://localhost:5000/api/notifications/:id/read
Headers: Authorization: Bearer {token}

# 5. Mark All as Read
PUT http://localhost:5000/api/notifications/read-all
Headers: Authorization: Bearer {token}

# 6. Delete Notification
DELETE http://localhost:5000/api/notifications/:id
Headers: Authorization: Bearer {token}

# 7. Delete All Read
DELETE http://localhost:5000/api/notifications/read/all
Headers: Authorization: Bearer {token}

# 8. Delete All
DELETE http://localhost:5000/api/notifications/all
Headers: Authorization: Bearer {token}

# 9. Get Preferences
GET http://localhost:5000/api/notifications/preferences
Headers: Authorization: Bearer {token}

# 10. Update Preferences
PUT http://localhost:5000/api/notifications/preferences
Headers: Authorization: Bearer {token}
```

### Admin (8 endpoints)
```powershell
# 1. Platform Stats
GET http://localhost:5000/api/admin/stats
Headers: Authorization: Bearer {admin_token}

# 2. Analytics
GET http://localhost:5000/api/admin/analytics
Headers: Authorization: Bearer {admin_token}

# 3. Get All Users
GET http://localhost:5000/api/admin/users
Headers: Authorization: Bearer {admin_token}

# 4. Update User
PUT http://localhost:5000/api/admin/users/:id
Headers: Authorization: Bearer {admin_token}

# 5. Delete User
DELETE http://localhost:5000/api/admin/users/:id
Headers: Authorization: Bearer {admin_token}

# 6. Get All Jobs
GET http://localhost:5000/api/admin/jobs
Headers: Authorization: Bearer {admin_token}

# 7. Moderate Job
PUT http://localhost:5000/api/admin/jobs/:id/moderate
Headers: Authorization: Bearer {admin_token}

# 8. Get All Applications
GET http://localhost:5000/api/admin/applications
Headers: Authorization: Bearer {admin_token}

# 9. Broadcast Notification
POST http://localhost:5000/api/admin/broadcast
Headers: Authorization: Bearer {admin_token}
```

### CV Management (2 endpoints)
```powershell
# 1. Upload & Analyze CV
POST http://localhost:5000/api/cv/upload
Headers: Authorization: Bearer {candidate_token}
Body: multipart/form-data (cv file)

# 2. Upload Profile Picture
POST http://localhost:5000/api/cv/profile-picture
Headers: Authorization: Bearer {token}
Body: multipart/form-data (image file)
```

### Chatbot (2 endpoints)
```powershell
# 1. Send Message
POST http://localhost:5000/api/chatbot/message
Body: { "message": "your question" }

# 2. Get Suggestions
GET http://localhost:5000/api/chatbot/suggestions
```

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot GET /"
**Solution**: Check if frontend server is running on port 3000

### Issue: "Network Error"
**Solution**: Check if backend API is running on port 5000

### Issue: "CV Upload Failed"
**Solution**: Verify Cloudinary credentials in `.env` file

### Issue: "Notification Bell Not Working"
**Solution**: Check if notifications component is imported in frontend

### Issue: "Admin Routes 403 Forbidden"
**Solution**: Ensure user role is 'admin' in database

---

## 📊 Performance Testing

### Load Time Goals
- Landing page: < 2 seconds
- Dashboard: < 3 seconds
- API response: < 500ms
- Job search: < 1 second
- CV analysis: < 5 seconds

### Test with Network Throttling
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Select "Slow 3G" or "Fast 3G"
4. Test page loads and interactions

---

## ✅ Final Checklist

Before considering testing complete:

### Frontend
- [ ] Landing page loads
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard displays
- [ ] Job browsing works
- [ ] Search & filters work
- [ ] Forms validate correctly
- [ ] Notifications display
- [ ] Chatbot responds
- [ ] Profile updates work
- [ ] Responsive on mobile

### Backend
- [ ] All 43+ endpoints respond
- [ ] Authentication works
- [ ] Authorization works (role-based)
- [ ] Database queries execute
- [ ] File uploads work (Cloudinary)
- [ ] AI analysis works (Gemini)
- [ ] Notifications create
- [ ] Admin functions work

### Integration
- [ ] Frontend calls backend successfully
- [ ] CORS configured correctly
- [ ] Tokens persist
- [ ] Data syncs between UI and DB
- [ ] Real-time updates work
- [ ] Error messages display properly

---

## 🎉 Success Metrics

Your project is working if:
- ✅ Users can register and login
- ✅ Jobs can be browsed and searched
- ✅ Applications can be submitted
- ✅ CVs can be analyzed
- ✅ Notifications are sent
- ✅ Admin can manage platform
- ✅ AI features respond
- ✅ No console errors

---

## 📹 Demo Script (for presentation)

1. **Introduction** (1 min)
   - Show landing page
   - Explain project purpose

2. **Candidate Journey** (5 min)
   - Register account
   - Browse jobs
   - Apply with CV
   - View AI match score
   - Check notifications

3. **Recruiter/Admin View** (3 min)
   - View dashboard
   - Check applications
   - Review candidates
   - Platform statistics

4. **AI Features** (2 min)
   - CV analysis demo
   - Chatbot interaction
   - Job matching scores

5. **Technical Architecture** (2 min)
   - Show tech stack
   - Explain AI integration
   - Database schema

---

**Total Testing Time**: ~2 hours for complete testing  
**Quick Test**: ~30 minutes for main features  
**Demo Time**: ~15 minutes

Happy Testing! 🚀

