import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Interview = sequelize.define('Interview', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Link to existing Job model
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'job_id',
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  
  // Link to recruiter (User model)
  recruiterId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'recruiter_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Voice-only for now, video later
  interviewType: {
    type: DataTypes.ENUM('voice', 'video'),
    allowNull: false,
    defaultValue: 'voice',
    field: 'interview_type'
  },
  
  status: {
    type: DataTypes.ENUM('draft', 'active', 'paused', 'completed', 'expired'),
    defaultValue: 'draft'
  },
  
  // Interview configuration
  settings: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
    comment: 'numberOfQuestions, timePerQuestion, skillCategories[], difficultyLevel, autoEvaluate, passingScore'
  },
  
  // ElevenLabs voice settings
  voiceConfig: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'voice_config',
    comment: 'voiceId, stability, similarity_boost, style, use_speaker_boost'
  },
  
  // Link to an Application (optional - for specific candidate interviews)
  applicationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'application_id',
    references: {
      model: 'applications',
      key: 'id'
    }
  },
  
  // Analytics
  totalSessions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'total_sessions'
  },
  
  completedSessions: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'completed_sessions'
  },
  
  averageScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    field: 'average_score'
  },
  
  // Expiry and scheduling
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expires_at'
  },
  
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'published_at'
  }
}, {
  tableName: 'interviews',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_job_id',
      fields: ['job_id']
    },
    {
      name: 'idx_recruiter_id',
      fields: ['recruiter_id']
    },
    {
      name: 'idx_status',
      fields: ['status']
    },
    {
      name: 'idx_application_id',
      fields: ['application_id']
    }
  ]
});

export default Interview;

