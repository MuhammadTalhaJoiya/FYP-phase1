# AI Recruitment Platform - Backend API

Backend API for the AI-powered recruitment platform built with Node.js, Express, MySQL, and Gemini AI.

## 🚀 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MySQL 8.0+
- **ORM**: Sequelize
- **AI/ML**: Google Gemini API
- **Authentication**: JWT + bcrypt
- **File Upload**: Multer + Cloudinary
- **Validation**: express-validator

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (database, etc.)
│   ├── models/          # Sequelize models (User, Job, Application)
│   ├── controllers/     # Route controllers
│   ├── routes/          # API route definitions
│   ├── middleware/      # Custom middleware (auth, validation, etc.)
│   ├── services/        # Business logic (AI, email, payment, etc.)
│   ├── utils/           # Utility functions
│   ├── scripts/         # Database scripts
│   └── server.js        # Main server file
├── .env                 # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (already created with your credentials):

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ai_recruitment
DB_USER=root
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# AI Providers (configure at least one)
# OpenAI (used by default in src/config/openai.js)
OPENAI_API_KEY=your_openai_api_key

# Gemini (optional; used if you switch imports to src/config/gemini.js)
GEMINI_API_KEY=your_gemini_api_key

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

### 3. Create Database

```bash
npm run db:create
```

This will create the `ai_recruitment` database in MySQL.

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication & Users

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "candidate",
  "phone": "+923001234567",
  "location": "Karachi, Pakistan"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "fullName": "John Smith",
  "phone": "+923001234567",
  "location": "Lahore, Pakistan",
  "bio": "Experienced software developer"
}
```

#### Change Password
```http
POST /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

#### Get User Statistics
```http
GET /api/auth/stats
Authorization: Bearer {token}
```

## 🗄️ Database Schema

### Users Table
- **id**: Primary key
- **email**: Unique, not null
- **password**: Hashed password
- **full_name**: User's full name
- **role**: 'candidate', 'recruiter', or 'admin'
- **phone**, **location**, **avatar**, **bio**: Profile fields
- **is_premium**, **premium_expires_at**, **subscription_plan**: Premium features
- **ai_analysis_count**, **analysis_reset_date**: Usage tracking for candidates
- **company_name**, **company_website**, **job_posts_remaining**: Recruiter fields
- **is_verified**, **is_active**, **last_login_at**: Account status
- **created_at**, **updated_at**: Timestamps

### Jobs Table
- **id**: Primary key
- **recruiter_id**: Foreign key to users
- **title**, **company**, **location**: Job basics
- **job_type**: 'full-time', 'part-time', 'contract', 'internship', 'remote'
- **experience_level**: 'entry', 'intermediate', 'senior', 'executive'
- **salary_range**, **description**, **requirements**, **responsibilities**: Details
- **skills**: JSON array of required skills
- **benefits**, **application_deadline**: Additional info
- **status**: 'draft', 'active', 'closed', 'expired'
- **view_count**, **application_count**: Analytics
- **is_remote**, **is_premium**: Boolean flags
- **created_at**, **updated_at**: Timestamps

### Applications Table
- **id**: Primary key
- **candidate_id**: Foreign key to users
- **job_id**: Foreign key to jobs
- **cv_url**: URL to uploaded CV
- **cover_letter**: Optional cover letter
- **status**: 'pending', 'reviewing', 'shortlisted', 'interview', 'rejected', 'accepted'
- **match_score**: AI-generated score (0-100)
- **matched_skills**, **missing_skills**: JSON arrays from AI analysis
- **ai_feedback**, **ai_analyzed_at**: AI analysis results
- **interview_scheduled_at**, **interview_type**, **interview_completed**: Interview info
- **interview_score**, **interview_feedback**: Interview results
- **recruiter_notes**, **rejection_reason**: Notes
- **applied_at**, **reviewed_at**, **responded_at**: Timestamps

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer {your_jwt_token}
```

Token is valid for 7 days by default.

## 🧪 Testing

To test the API, you can use:
- **Postman**: Import the endpoints above
- **cURL**: Use command line requests
- **Thunder Client**: VS Code extension

### Quick Test

```bash
# Health check
curl http://localhost:5000/health

# Register a user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User","role":"candidate"}'
```

## 📝 Development Phases

### ✅ Phase 1: Foundation (Current)
- [x] Project setup
- [x] Database configuration
- [x] User model with authentication
- [x] Auth APIs (register, login, profile)
- [x] JWT middleware
- [ ] Test authentication flow

### 🔄 Phase 2: Core Features (Next)
- Job posting APIs
- Job browsing & search
- Application submission
- Application management

### 🔄 Phase 3: AI Integration
- Gemini AI service
- CV parsing
- Job matching
- Text-based interviews

### 🔄 Phase 4: Voice Interviews
- Google Speech-to-Text
- Voice interview system
- Audio processing

### 🔄 Phase 5: Payments
- JazzCash integration
- Stripe integration
- Subscription management

### 🔄 Phase 6: Production Ready
- Email notifications
- WebSocket for real-time features
- Comprehensive testing
- Deployment setup

## 🚨 Common Issues

### Database Connection Failed
- Make sure MySQL is running
- Verify credentials in `.env`
- Run `npm run db:create` to create database

### Port Already in Use
- Change PORT in `.env`
- Or kill the process using the port

### JWT Token Issues
- Make sure JWT_SECRET is set in `.env`
- Check token format: `Bearer {token}`

## 📞 Support

If you encounter any issues, check:
1. MySQL is running
2. Environment variables are correct
3. Dependencies are installed (`npm install`)
4. Database is created (`npm run db:create`)

## 🎯 Next Steps

1. Test authentication endpoints ✅
2. Build job posting APIs
3. Implement AI CV analysis
4. Add payment integration

---

**Backend is ready for Phase 1 testing!** 🎉

