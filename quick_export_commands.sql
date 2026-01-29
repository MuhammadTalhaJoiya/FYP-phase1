-- Quick MySQL Export Commands
-- Run these in MySQL Workbench query editor if manual export fails

-- 1. Check database exists
USE ai_recruitment;
SHOW TABLES;

-- 2. Quick data export (run one by one)
SELECT * FROM users INTO OUTFILE 'D:/fypproject/users.csv'
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n';

SELECT * FROM jobs INTO OUTFILE 'D:/fypproject/jobs.csv'
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n';

SELECT * FROM applications INTO OUTFILE 'D:/fypproject/applications.csv'
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n';

SELECT * FROM notifications INTO OUTFILE 'D:/fypproject/notifications.csv'
FIELDS TERMINATED BY ',' ENCLOSED BY '"'
LINES TERMINATED BY '\n';

-- 3. Get table structures
SHOW CREATE TABLE users;
SHOW CREATE TABLE jobs;
SHOW CREATE TABLE applications;
SHOW CREATE TABLE notifications;
SHOW CREATE TABLE interviews;

-- 4. Quick data counts
SELECT 'Users:' as Table_Name, COUNT(*) as Record_Count FROM users
UNION ALL
SELECT 'Jobs:', COUNT(*) FROM jobs
UNION ALL
SELECT 'Applications:', COUNT(*) FROM applications
UNION ALL
SELECT 'Notifications:', COUNT(*) FROM notifications
UNION ALL
SELECT 'Interviews:', COUNT(*) FROM interviews;



