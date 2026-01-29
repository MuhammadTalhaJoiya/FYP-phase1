# MySQL Workbench Database Export Guide

## Step-by-Step Instructions for Exporting Your AI Recruitment Database

### Step 1: Open MySQL Workbench
1. **Launch MySQL Workbench** from your desktop or Start menu
2. **If you haven't connected before**, create a new connection:
   - Click the **+** button next to "MySQL Connections"
   - **Connection Name:** `AI Recruitment DB`
   - **Connection Method:** Standard (TCP/IP)
   - **Hostname:** `localhost`
   - **Port:** `3306`
   - **Username:** `root`
   - **Password:** Click "Store in Vault" and enter: `Hacker!@#123123`
   - Click **Test Connection** (should show success message)
   - Click **OK** to save the connection

### Step 2: Connect to Database
1. **Double-click** the `AI Recruitment DB` connection you just created
2. **Enter password** if prompted: `Hacker!@#123123`
3. **Wait for connection** - you should see the database navigator on the left

### Step 3: Access Data Export
1. **In the top menu**, click **Server** → **Data Export**
2. **Alternative:** Click the **Management** tab in the left sidebar, then **Data Export**

### Step 4: Configure Export Settings

#### **Object Selection:**
- **Database(s):** ✅ Check `ai_recruitment`
- **Tables:** ✅ Check **Select All** (this selects all tables)
- **Views:** Leave unchecked (unless you have views)
- **Stored Procedures/Functions:** Leave unchecked

#### **Export Options:**
- **Export Method:** ✅ **Export to Self-Contained File**
- **File Path:** Click the **...** button and choose:
  - Location: `D:\fypproject\`
  - Filename: `ai_recruitment_backup.sql`
  - Click **Save**

### Step 5: Advanced Export Options

#### **Tables & Objects:**
- ✅ **Include Create Schema**
- ✅ **Include Create Table**
- ✅ **Include Insert Statements** (this includes your data)
- ✅ **Include Drop Statements** (optional - recreates tables if they exist)
- ❌ **Include Triggers** (unless you have triggers)
- ❌ **Include Events** (unless you have events)
- ❌ **Include Routines** (unless you have stored procedures)

#### **Data Options:**
- ✅ **Dump Data and Structure**
- **Dump Structure Only:** ❌ Uncheck
- **Dump Data Only:** ❌ Uncheck

### Step 6: Start Export
1. **Review all settings** in the summary panel
2. **Click "Start Export"** button (bottom right)
3. **Monitor progress** in the logs panel
4. **Wait for completion** - you'll see "Export completed successfully"

### Step 7: Verify Export
1. **Open Windows Explorer**
2. **Navigate to:** `D:\fypproject\`
3. **Look for:** `ai_recruitment_backup.sql`
4. **Check file size** - should be several KB (depending on your data)

### Step 8: Test the Export File
1. **Right-click** the `.sql` file
2. **Open with:** Notepad or any text editor
3. **Verify contents:**
   - Should start with `CREATE DATABASE` statements
   - Should contain `CREATE TABLE` statements
   - Should contain `INSERT INTO` statements with your data

---

## Alternative: Export Individual Tables

If you want to export specific tables:

1. **In Data Export window**, uncheck "Select All" under Tables
2. **Manually check** only the tables you want:
   - ✅ `users`
   - ✅ `jobs`
   - ✅ `applications`
   - ✅ `notifications`
   - ✅ `interviews`
   - ✅ `interview_questions`
   - ✅ `interview_responses`
   - ✅ `interview_sessions`

3. **Follow Steps 4-8** as above

---

## Export as CSV Files (Alternative)

For CSV exports:

1. **Go to Data Export**
2. **Uncheck "Export to Self-Contained File"**
3. **Check "Export to Separate Files"**
4. **Choose folder:** `D:\fypproject\csv_export\`
5. **For each table:**
   - ✅ Check the table name
   - Choose "CSV" format
   - Set options as needed

---

## Troubleshooting

### "Access Denied" Error:
- Make sure MySQL server is running
- Check your username/password
- Try running MySQL Workbench as Administrator

### Empty Export File:
- Check if database has data: `SELECT COUNT(*) FROM users;`
- Verify table permissions
- Try exporting with "Include Create Schema" checked

### Connection Issues:
- Verify MySQL service is running: `net start mysql`
- Check port 3306 is not blocked by firewall
- Try connecting with command line first

---

## What the Export Contains

Your `ai_recruitment_backup.sql` file will include:

1. **Database Structure:**
   - CREATE DATABASE statements
   - CREATE TABLE statements
   - Indexes and constraints
   - Foreign key relationships

2. **Data:**
   - INSERT statements for all your data
   - User accounts, jobs, applications
   - Interview records and responses

3. **Metadata:**
   - Table structures
   - Column definitions
   - Data types and constraints

---

## Sharing with Supervisor

**Files to share:**
1. `ai_recruitment_backup.sql` (main database export)
2. `database_export_guide.md` (this guide)
3. Any CSV files if you exported separately

**To import elsewhere:**
```sql
CREATE DATABASE ai_recruitment;
mysql -u username -p ai_recruitment < ai_recruitment_backup.sql
```

---

## Screenshots Guide

If you need visual guidance:

1. **Connection Setup:** Search online for "MySQL Workbench create connection"
2. **Data Export:** Search for "MySQL Workbench export database"
3. **File Location:** Make sure you save to `D:\fypproject\` folder

---

**Your database export will be ready in `D:\fypproject\ai_recruitment_backup.sql` once completed!** 📁✅



