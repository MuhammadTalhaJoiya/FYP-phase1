import { sequelize, Interview, InterviewQuestion, InterviewSession, InterviewResponse } from '../models/index.js';

async function syncInterviewTables() {
  try {
    console.log('🔄 Syncing interview tables...\n');
    
    // Test connection first
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');
    
    // Sync new tables in order (respecting foreign key dependencies)
    console.log('📋 Creating/updating Interview table...');
    await Interview.sync({ alter: true });
    console.log('✅ Interview table synced\n');
    
    console.log('📋 Creating/updating InterviewQuestion table...');
    await InterviewQuestion.sync({ alter: true });
    console.log('✅ InterviewQuestion table synced\n');
    
    console.log('📋 Creating/updating InterviewSession table...');
    await InterviewSession.sync({ alter: true });
    console.log('✅ InterviewSession table synced\n');
    
    console.log('📋 Creating/updating InterviewResponse table...');
    await InterviewResponse.sync({ alter: true });
    console.log('✅ InterviewResponse table synced\n');
    
    console.log('🎉 All interview tables synced successfully!\n');
    console.log('📊 Tables created:');
    console.log('   - interviews');
    console.log('   - interview_questions');
    console.log('   - interview_sessions');
    console.log('   - interview_responses\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

syncInterviewTables();

