import sequelize, { testConnection, syncDatabase } from '../config/database.js';
import '../models/index.js'; // Import models and associations

const sync = async () => {
  try {
    // Test connection first
    const connected = await testConnection();
    if (!connected) {
      process.exit(1);
    }

    // Sync all models (create tables)
    console.log('🔄 Syncing database schema...');
    await syncDatabase({ alter: true }); // Use alter to update existing tables
    
    console.log('✅ All tables created successfully!');
    
    // Display created tables
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('\n📋 Created tables:');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
};

sync();

