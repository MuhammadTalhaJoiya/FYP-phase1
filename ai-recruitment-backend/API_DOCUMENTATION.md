# AI Recruitment Backend - API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
Most endpoints require authentication using JWT (JSON Web Token).

### Authentication Header
```
Authorization: Bearer <your_jwt_token>
```

---

## 📚 API Endpoints

### 1. Health Check

#### `GET /health`
Check if the server is running.

**Public** - No authentication required

**Response:**
```json
{
  "success": true,
  "message": "AI Recruitment Backend is running!",
  "timestamp": "2025-12-31T13:55:54.686Z"
}
```

---

## 🔐 Authentication Endpoints

### 2. User Registration

#### `POST /api/auth/register`
Create a new user account (candidate or recruiter).

**Public** - No authentication required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe",
  "role": "candidate",           // "candidate" or "recruiter"
  "phone": "03001234567",         // Optional
  "location": "Lahore, Pakistan", // Optional
  "companyName": "Tech Corp",     // Required for recruiter
  "companyWebsite": "https://..."  // Optional for recruiter
}
```

**Validation Rules:**
- `email`: Must be valid email format
- `password`: Minimum 6 characters
- `fullName`: Required, non-empty string
- `role`: Must be "candidate" or "recruiter"
- `phone`: Must be valid mobile number (if provided)

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "candidate",
      "phone": "03001234567",
      "location": "Lahore, Pakistan",
      "isPremium": false,
      "subscriptionPlan": "free",
      "aiAnalysisCount": 0,
      "jobPostsRemaining": 0,
      "isVerified": false,
      "isActive": true,
      "created_at": "2025-12-31T13:56:11.013Z",
      "updated_at": "2025-12-31T13:56:11.013Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (409 - Duplicate Email):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Error Response (400 - Validation Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

---

### 3. User Login

#### `POST /api/auth/login`
Authenticate a user and receive a JWT token.

**Public** - No authentication required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Must be valid email format
- `password`: Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "fullName": "John Doe",
      "role": "candidate",
      "phone": "03001234567",
      "location": "Lahore, Pakistan",
      "avatar": null,
      "bio": null,
      "isPremium": false,
      "premiumExpiresAt": null,
      "subscriptionPlan": "free",
      "aiAnalysisCount": 0,
      "analysisResetDate": null,
      "isActive": true,
      "lastLoginAt": "2025-12-31T13:57:01.192Z",
      "created_at": "2025-12-31T13:56:11.000Z",
      "updated_at": "2025-12-31T13:57:01.192Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 - Invalid Credentials):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Error Response (403 - Account Deactivated):**
```json
{
  "success": false,
  "message": "Account is deactivated"
}
```

---

### 4. Get User Profile

#### `GET /api/auth/profile`
Get the current authenticated user's profile.

**Protected** - Requires authentication

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "candidate",
    "phone": "03001234567",
    "location": "Lahore, Pakistan",
    "avatar": null,
    "bio": null,
    "isPremium": false,
    "premiumExpiresAt": null,
    "subscriptionPlan": "free",
    "aiAnalysisCount": 0,
    "analysisResetDate": null,
    "companyName": null,
    "companyWebsite": null,
    "jobPostsRemaining": 0,
    "isVerified": false,
    "isActive": true,
    "lastLoginAt": "2025-12-31T13:57:01.000Z",
    "created_at": "2025-12-31T13:56:11.000Z",
    "updated_at": "2025-12-31T13:57:01.000Z"
  }
}
```

**Error Response (401 - Unauthorized):**
```json
{
  "success": false,
  "message": "No token provided"
}
```

**Error Response (401 - Invalid Token):**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

---

### 5. Update User Profile

#### `PUT /api/auth/profile`
Update the current user's profile information.

**Protected** - Requires authentication

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "fullName": "John Updated",    // Optional
  "phone": "03009876543",         // Optional
  "location": "Karachi",          // Optional
  "bio": "Software Developer",    // Optional
  "companyName": "New Corp",      // Optional (recruiter only)
  "companyWebsite": "https://..."  // Optional (recruiter only)
}
```

**Note:** Only provide the fields you want to update.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "John Updated",
    "phone": "03009876543",
    "location": "Karachi",
    "bio": "Software Developer",
    // ... other user fields
  }
}
```

---

### 6. Change Password

#### `POST /api/auth/change-password`
Change the current user's password.

**Protected** - Requires authentication

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Validation Rules:**
- `currentPassword`: Required
- `newPassword`: Minimum 6 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

**Error Response (401 - Wrong Current Password):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

### 7. Get User Statistics

#### `GET /api/auth/stats`
Get usage statistics and subscription information for the current user.

**Protected** - Requires authentication

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200) - Candidate:**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "isPremium": false,
    "subscriptionPlan": "free",
    "premiumExpiresAt": null,
    "aiAnalysisCount": 0,
    "analysisRemaining": 5,        // "unlimited" for premium
    "analysisResetDate": null
  }
}
```

**Success Response (200) - Recruiter:**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "isPremium": false,
    "subscriptionPlan": "free",
    "premiumExpiresAt": null,
    "jobPostsRemaining": 0,
    "companyName": "Tech Corp"
  }
}
```

---

## 🔒 Authentication Flow

### 1. Register or Login
Call `/api/auth/register` or `/api/auth/login` to get a JWT token.

### 2. Store Token
Store the received token securely (e.g., localStorage, sessionStorage).

### 3. Make Authenticated Requests
Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

### 4. Token Expiration
Tokens expire after 7 days. User will need to login again.

---

## 📋 User Roles

### Candidate
- Can browse and apply for jobs
- Can use AI CV analysis (5 free per month)
- Can upgrade to premium for unlimited analyses

### Recruiter
- Can post jobs
- Can review applications
- Can view AI match scores
- Requires subscription for job posting slots

### Admin
- Full system access
- Can manage users and jobs
- Can view analytics

---

## 💳 Subscription Plans

### Candidates
- **Free**: 5 AI analyses per month
- **Premium**: Unlimited analyses + priority support

### Recruiters
- **Pay Per Post**: Rs. 1,500 per job
- **Starter**: Rs. 5,000/month (5 jobs)
- **Professional**: Rs. 15,000/month (20 jobs + AI screening)
- **Enterprise**: Rs. 40,000/month (unlimited jobs + full features)

---

## 🚫 Error Codes

| Status Code | Meaning |
|------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (authentication required) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (e.g., duplicate email) |
| 500 | Internal Server Error |

---

## 📝 Response Format

All API responses follow this consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Descriptive success message",
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": [ /* validation errors if applicable */ ]
}
```

---

## 🧪 Testing with cURL

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "fullName": "Test User",
    "role": "candidate"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Get Profile (with token)
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <your_token_here>"
```

---

## 🧪 Testing with PowerShell

### Register a User
```powershell
$body = @{
    email = "test@example.com"
    password = "test123"
    fullName = "Test User"
    role = "candidate"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### Login
```powershell
$loginBody = @{
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -Body $loginBody `
  -ContentType "application/json"

$token = $response.data.token
```

### Get Profile
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" `
  -Method GET `
  -Headers $headers
```

---

## 📚 Next API Endpoints (Coming in Phase 2)

- Job Management (CRUD)
- Application Management
- CV Upload & Analysis
- AI Matching
- Search & Filtering
- Notifications
- Subscription Management
- Admin Dashboard

---

**Version**: 1.0.0 (Phase 1)  
**Last Updated**: December 31, 2025

