# 🚀 Quick Start Guide

## Prerequisites
- ✅ Node.js installed
- ✅ MySQL installed and running
- ✅ Gemini API key

---

## 🏃 Getting Started

### 1. Navigate to Backend Folder
```bash
cd D:\ai-recruitment-backend
```

### 2. Install Dependencies (If Not Already Done)
```bash
npm install
```

### 3. Configure Environment Variables
The `.env` file is already set up with:
- MySQL credentials
- Gemini API key
- JWT secret
- Server port (5000)

### 4. Create Database (If Not Already Done)
```bash
npm run db:create
```

### 5. Start Development Server
```bash
npm run dev
```

The server will start on: **http://localhost:5000**

---

## ✅ Verify Server is Running

### Check Health Endpoint
**Using Browser:**
Open: http://localhost:5000/health

**Using PowerShell:**
```powershell
Invoke-RestMethod http://localhost:5000/health | ConvertTo-Json
```

**Expected Response:**
```json
{
  "success": true,
  "message": "AI Recruitment Backend is running!",
  "timestamp": "2025-12-31T..."
}
```

---

## 🧪 Test Authentication

### 1. Register a Test User

**PowerShell:**
```powershell
$body = @{
    email = "demo@example.com"
    password = "Demo@123"
    fullName = "Demo User"
    role = "candidate"
    phone = "03001234567"
    location = "Lahore, Pakistan"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

$response | ConvertTo-Json -Depth 10
```

**Save the token:**
```powershell
$token = $response.data.token
```

### 2. Login

**PowerShell:**
```powershell
$loginBody = @{
    email = "demo@example.com"
    password = "Demo@123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod `
    -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -Body $loginBody `
    -ContentType "application/json"

$token = $loginResponse.data.token
$loginResponse | ConvertTo-Json -Depth 10
```

### 3. Get User Profile

**PowerShell:**
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod `
    -Uri "http://localhost:5000/api/auth/profile" `
    -Method GET `
    -Headers $headers | ConvertTo-Json -Depth 10
```

---

## 📁 Project Structure

```
ai-recruitment-backend/
├── src/
│   ├── config/
│   │   └── database.js          # Sequelize configuration
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Job.js               # Job model
│   │   ├── Application.js       # Application model
│   │   └── index.js             # Model associations
│   ├── controllers/
│   │   └── authController.js    # Auth business logic
│   ├── routes/
│   │   └── authRoutes.js        # Auth endpoints
│   ├── middleware/
│   │   ├── auth.js              # JWT middleware
│   │   ├── validation.js        # Input validation
│   │   └── errorHandler.js      # Error handling
│   ├── utils/
│   │   ├── jwt.js               # JWT utilities
│   │   └── response.js          # Response helpers
│   ├── scripts/
│   │   ├── createDatabase.js    # DB creation
│   │   └── syncDatabase.js      # Table sync
│   └── server.js                # Main server file
├── .env                         # Environment variables
├── package.json                 # Dependencies
└── README.md                    # Project info
```

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm start` | Start production server |
| `npm run db:create` | Create MySQL database |
| `npm run db:sync` | Sync database tables |

---

## 🔐 Test Credentials

### Candidate Account
```
Email: testcandidate@example.com
Password: Test@123
Role: candidate
```

### Recruiter Account
```
Email: testrecruiter@example.com
Password: Recruit@123
Role: recruiter
Company: Test Tech Solutions
```

---

## 🌐 API Endpoints

### Public Endpoints (No Auth Required)
- `GET /health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Protected Endpoints (Auth Required)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/stats` - Get user statistics

For detailed API documentation, see `API_DOCUMENTATION.md`

---

## 📊 Database Tables

| Table | Description | Records |
|-------|-------------|---------|
| `users` | User accounts | 2 |
| `jobs` | Job postings | 0 |
| `applications` | Job applications | 0 |

### View Database
**MySQL CLI:**
```bash
mysql -u root -p
USE ai_recruitment;
SHOW TABLES;
SELECT * FROM users;
```

---

## 🐛 Troubleshooting

### Server Won't Start
**Issue**: Port 5000 already in use
**Solution**: Change PORT in `.env` or kill process using port 5000

**Issue**: Database connection error
**Solution**: Verify MySQL is running and credentials in `.env` are correct

### Authentication Not Working
**Issue**: 401 Unauthorized
**Solution**: Ensure token is included in Authorization header as `Bearer <token>`

**Issue**: Token expired
**Solution**: Login again to get a new token (tokens expire after 7 days)

### Database Errors
**Issue**: Table doesn't exist
**Solution**: Run `npm run db:sync` to create tables

**Issue**: Column mismatch
**Solution**: Run `npm run db:sync` again (uses `alter: true`)

---

## 🔄 Development Workflow

1. **Make Changes** to code
2. **Nodemon Auto-Reloads** the server
3. **Test Endpoints** using PowerShell/Postman
4. **Check Logs** in terminal
5. **Verify Database** changes if needed

---

## 📝 Common Tasks

### Create a New User
```powershell
$body = @{
    email = "newuser@example.com"
    password = "Password123"
    fullName = "New User"
    role = "candidate"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### Update Profile
```powershell
$headers = @{ "Authorization" = "Bearer $token" }

$updateBody = @{
    fullName = "Updated Name"
    bio = "Software Developer"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "http://localhost:5000/api/auth/profile" `
    -Method PUT `
    -Headers $headers `
    -Body $updateBody `
    -ContentType "application/json"
```

### Check User Stats
```powershell
$headers = @{ "Authorization" = "Bearer $token" }

Invoke-RestMethod `
    -Uri "http://localhost:5000/api/auth/stats" `
    -Method GET `
    -Headers $headers
```

---

## 🎯 What's Working Now

✅ User registration (candidate & recruiter)  
✅ User login with JWT authentication  
✅ Password hashing with bcrypt  
✅ Protected routes with JWT middleware  
✅ User profile management  
✅ Password change  
✅ User statistics  
✅ MySQL database with Sequelize ORM  
✅ Input validation  
✅ Error handling  
✅ CORS & security headers  
✅ Rate limiting  

---

## 🚧 Coming Next (Phase 2)

- Job CRUD operations
- Application management
- CV upload to Cloudinary
- AI CV analysis with Gemini
- Job matching algorithm
- Search & filtering
- Notification system
- Subscription management

---

## 📖 Documentation Files

- `QUICK_START.md` - This file
- `API_DOCUMENTATION.md` - Detailed API reference
- `BACKEND_PHASE1_COMPLETE.md` - Phase 1 completion report
- `README.md` - Project overview

---

## 💡 Tips

1. **Keep the server running** in a separate terminal
2. **Use Postman** or PowerShell for API testing
3. **Check terminal logs** for debugging
4. **Use nodemon** for auto-reload during development
5. **Test authentication first** before other features
6. **Store tokens** in variables for easy reuse

---

## 🎉 You're All Set!

The backend is fully functional and ready for Phase 2 development.

**Server Status:**
- Backend: ✅ http://localhost:5000
- Frontend: ✅ http://localhost:3000
- Database: ✅ MySQL connected

**Next Steps:**
1. Test all endpoints
2. Integrate with frontend
3. Begin Phase 2 features

Need help? Check `API_DOCUMENTATION.md` for detailed endpoint information!

