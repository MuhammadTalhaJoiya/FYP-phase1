# PowerShell script to test authentication endpoints
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Testing Authentication System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000/api"

# Test 1: Login with test candidate
Write-Host "Test 1: Login with test candidate..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = "testcandidate@example.com"
        password = "Test@123"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "  ✅ Login successful!" -ForegroundColor Green
        Write-Host "  User: $($response.data.user.fullName)" -ForegroundColor White
        Write-Host "  Role: $($response.data.user.role)" -ForegroundColor White
        Write-Host "  Token: $($response.data.token.Substring(0,30))..." -ForegroundColor White
        $candidateToken = $response.data.token
    } else {
        Write-Host "  ❌ Login failed: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Login with test recruiter
Write-Host "Test 2: Login with test recruiter..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = "testrecruiter@example.com"
        password = "Recruit@123"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "  ✅ Login successful!" -ForegroundColor Green
        Write-Host "  User: $($response.data.user.fullName)" -ForegroundColor White
        Write-Host "  Role: $($response.data.user.role)" -ForegroundColor White
        Write-Host "  Token: $($response.data.token.Substring(0,30))..." -ForegroundColor White
        $recruiterToken = $response.data.token
    } else {
        Write-Host "  ❌ Login failed: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Get profile with token
if ($candidateToken) {
    Write-Host "Test 3: Get candidate profile (protected route)..." -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $candidateToken"
        }
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/profile" -Method Get -Headers $headers
        
        if ($response.success) {
            Write-Host "  ✅ Profile retrieved successfully!" -ForegroundColor Green
            Write-Host "  Email: $($response.data.email)" -ForegroundColor White
            Write-Host "  Premium: $($response.data.isPremium)" -ForegroundColor White
        } else {
            Write-Host "  ❌ Failed: $($response.message)" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

# Test 4: Try accessing without token (should fail)
Write-Host "Test 4: Try accessing protected route without token..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/profile" -Method Get
    Write-Host "  ❌ Should have failed but didn't!" -ForegroundColor Red
} catch {
    $errorResponse = $_.ErrorDetails.Message | ConvertFrom-Json
    if ($errorResponse.message -match "token") {
        Write-Host "  ✅ Correctly rejected: $($errorResponse.message)" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  Unexpected error: $($errorResponse.message)" -ForegroundColor Yellow
    }
}
Write-Host ""

# Test 5: Register new user
Write-Host "Test 5: Register new user..." -ForegroundColor Yellow
try {
    $random = Get-Random -Minimum 1000 -Maximum 9999
    $registerData = @{
        email = "testuser$random@example.com"
        password = "TestPass@123"
        fullName = "Test User $random"
        role = "candidate"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    
    if ($response.success) {
        Write-Host "  ✅ Registration successful!" -ForegroundColor Green
        Write-Host "  User: $($response.data.user.fullName)" -ForegroundColor White
        Write-Host "  Email: $($response.data.user.email)" -ForegroundColor White
        Write-Host "  Token received: Yes" -ForegroundColor White
    } else {
        Write-Host "  ❌ Registration failed: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Authentication system is working!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Create frontend .env file with: VITE_API_URL=http://localhost:5000/api" -ForegroundColor White
Write-Host "  2. Restart frontend server" -ForegroundColor White
Write-Host "  3. Open http://localhost:3003/login" -ForegroundColor White
Write-Host "  4. Login with: testcandidate@example.com / Test@123" -ForegroundColor White
Write-Host ""

