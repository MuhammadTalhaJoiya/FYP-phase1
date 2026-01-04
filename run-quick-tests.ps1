# Quick Test Script for AI Recruitment Platform
# Run this to verify all systems are working

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Running Quick System Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$testsPassed = 0
$testsFailed = 0

# Test 1: Backend Health
Write-Host "[1/10] Testing Backend Health..." -NoNewline
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET -ErrorAction Stop
    Write-Host " PASS" -ForegroundColor Green
    $testsPassed++
} catch {
    Write-Host " FAIL" -ForegroundColor Red
    $testsFailed++
}

# Test 2: Frontend Running
Write-Host "[2/10] Testing Frontend..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method HEAD -TimeoutSec 2 -ErrorAction Stop
    Write-Host " PASS" -ForegroundColor Green
    $testsPassed++
} catch {
    Write-Host " FAIL" -ForegroundColor Red
    $testsFailed++
}

# Test 3: User Login
Write-Host "[3/10] Testing User Login..." -NoNewline
try {
    $loginBody = @{
        email = "testcandidate@example.com"
        password = "Test@123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction Stop
    $token = $loginResponse.data.token
    Write-Host " PASS" -ForegroundColor Green
    $testsPassed++
} catch {
    Write-Host " FAIL" -ForegroundColor Red
    $testsFailed++
    $token = $null
}

# Test 4: Get Jobs
Write-Host "[4/10] Testing Job Listing..." -NoNewline
try {
    $jobs = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs" -Method GET -ErrorAction Stop
    Write-Host " PASS ($($jobs.data.pagination.total) jobs)" -ForegroundColor Green
    $testsPassed++
} catch {
    Write-Host " FAIL" -ForegroundColor Red
    $testsFailed++
}

# Test 5: Job Search
Write-Host "[5/10] Testing Job Search..." -NoNewline
try {
    $searchResults = Invoke-RestMethod -Uri "http://localhost:5000/api/jobs?search=Developer" -Method GET -ErrorAction Stop
    Write-Host " PASS ($($searchResults.data.pagination.total) results)" -ForegroundColor Green
    $testsPassed++
} catch {
    Write-Host " FAIL" -ForegroundColor Red
    $testsFailed++
}

# Test 6: Get Profile (with auth)
if ($token) {
    Write-Host "[6/10] Testing Profile Access..." -NoNewline
    try {
        $headers = @{ "Authorization" = "Bearer $token" }
        $profile = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/profile" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host " PASS" -ForegroundColor Green
        $testsPassed++
    } catch {
        Write-Host " FAIL" -ForegroundColor Red
        $testsFailed++
    }
} else {
    Write-Host "[6/10] Testing Profile Access... SKIP (no token)" -ForegroundColor Yellow
}

# Test 7: Get Notifications
if ($token) {
    Write-Host "[7/10] Testing Notifications..." -NoNewline
    try {
        $headers = @{ "Authorization" = "Bearer $token" }
        $notifications = Invoke-RestMethod -Uri "http://localhost:5000/api/notifications" -Method GET -Headers $headers -ErrorAction Stop
        Write-Host " PASS ($($notifications.data.pagination.total) notifications)" -ForegroundColor Green
        $testsPassed++
    } catch {
        Write-Host " FAIL" -ForegroundColor Red
        $testsFailed++
    }
} else {
    Write-Host "[7/10] Testing Notifications... SKIP (no token)" -ForegroundColor Yellow
}

# Test 8: Chatbot
Write-Host "[8/10] Testing AI Chatbot..." -NoNewline
try {
    $chatBody = @{
        message = "Test message"
    } | ConvertTo-Json
    
    $chatResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/chatbot/message" -Method POST -Body $chatBody -ContentType "application/json" -ErrorAction Stop
    Write-Host " PASS" -ForegroundColor Green
    $testsPassed++
} catch {
    Write-Host " FAIL" -ForegroundColor Red
    $testsFailed++
}

# Test 9: Admin Login
Write-Host "[9/10] Testing Admin Access..." -NoNewline
try {
    $adminLogin = @{
        email = "testrecruiter@example.com"
        password = "Recruit@123"
    } | ConvertTo-Json
    
    $adminResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $adminLogin -ContentType "application/json" -ErrorAction Stop
    $adminToken = $adminResponse.data.token
    
    $headers = @{ "Authorization" = "Bearer $adminToken" }
    $stats = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/stats" -Method GET -Headers $headers -ErrorAction Stop
    
    Write-Host " PASS ($($stats.data.users.total) users)" -ForegroundColor Green
    $testsPassed++
} catch {
    Write-Host " FAIL" -ForegroundColor Red
    $testsFailed++
}

# Test 10: Database Connection
Write-Host "[10/10] Testing Database..." -NoNewline
try {
    mysql -u root -p"Hacker!@#123123" -e "SELECT COUNT(*) FROM ai_recruitment.users;" 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host " PASS" -ForegroundColor Green
        $testsPassed++
    } else {
        Write-Host " FAIL" -ForegroundColor Red
        $testsFailed++
    }
} catch {
    Write-Host " FAIL" -ForegroundColor Red
    $testsFailed++
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Results" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Passed: $testsPassed" -ForegroundColor Green
Write-Host "Failed: $testsFailed" -ForegroundColor Red
Write-Host "Total: $($testsPassed + $testsFailed)" -ForegroundColor White

if ($testsFailed -eq 0) {
    Write-Host ""
    Write-Host "✅ All tests passed! System is working perfectly!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now:" -ForegroundColor Cyan
    Write-Host "  1. Open http://localhost:3000 in your browser" -ForegroundColor White
    Write-Host "  2. Login with test accounts" -ForegroundColor White
    Write-Host "  3. Explore all features" -ForegroundColor White
    Write-Host "  4. Read COMPLETE_TESTING_GUIDE.md for detailed testing" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "⚠️  Some tests failed. Check the errors above." -ForegroundColor Yellow
}

Write-Host ""

