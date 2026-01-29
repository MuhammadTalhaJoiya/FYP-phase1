@echo off
echo ========================================
echo Exporting AI Recruitment Database
echo ========================================

REM Set database credentials (update these if needed)
set DB_HOST=localhost
set DB_PORT=3306
set DB_NAME=ai_recruitment
set DB_USER=root
set DB_PASSWORD=Hacker!@#123123

REM Set output file name with timestamp
set TIMESTAMP=%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%
set OUTPUT_FILE=ai_recruitment_backup_%TIMESTAMP%.sql

echo Database: %DB_NAME%
echo Output File: %OUTPUT_FILE%
echo.

REM Export database using mysqldump
echo Exporting database...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASSWORD% %DB_NAME% > "%OUTPUT_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✅ DATABASE EXPORT SUCCESSFUL!
    echo ========================================
    echo.
    echo 📁 File saved as: %OUTPUT_FILE%
    echo 📊 File location: %CD%\%OUTPUT_FILE%
    echo 📏 File size:
    for %%A in ("%OUTPUT_FILE%") do echo    %%~zA bytes
    echo.
    echo 🔄 To import this database elsewhere, use:
    echo mysql -u [username] -p [database_name] < %OUTPUT_FILE%
    echo.
) else (
    echo.
    echo ========================================
    echo ❌ DATABASE EXPORT FAILED!
    echo ========================================
    echo.
    echo Possible issues:
    echo - MySQL server is not running
    echo - Database credentials are incorrect
    echo - Database does not exist
    echo - Insufficient permissions
    echo.
    echo Solutions:
    echo 1. Make sure MySQL server is running
    echo 2. Check database credentials in .env file
    echo 3. Verify database exists: mysql -u root -p -e "SHOW DATABASES;"
    echo.
)

echo Press any key to exit...
pause > nul
