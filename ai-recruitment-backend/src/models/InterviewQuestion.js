import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const InterviewQuestion = sequelize.define('InterviewQuestion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  interviewId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'interview_id',
    references: {
      model: 'interviews',
      key: 'id'
    }
  },
  
  questionText: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'question_text'
  },
  
  // AI-generated or manual
  generatedBy: {
    type: DataTypes.ENUM('ai', 'manual'),
    defaultValue: 'ai',
    field: 'generated_by'
  },
  
  skillCategory: {
    type: DataTypes.ENUM('communication', 'technical', 'confidence', 'problem_solving', 'leadership', 'teamwork'),
    allowNull: false,
    field: 'skill_category'
  },
  
  difficulty: {
    type: DataTypes.ENUM('easy', 'medium', 'hard'),
    defaultValue: 'medium'
  },
  
  timeLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 120,
    field: 'time_limit',
    comment: 'Time in seconds'
  },
  
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Question sequence order'
  },
  
  // ElevenLabs TTS generated audio
  audioUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'audio_url',
    comment: 'TTS-generated audio URL from Cloudinary'
  },
  
  audioPublicId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'audio_public_id',
    comment: 'Cloudinary public ID for audio'
  },
  
  // For AI evaluation
  expectedKeywords: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'expected_keywords',
    comment: 'Keywords AI should look for in answers'
  },
  
  scoringCriteria: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'scoring_criteria',
    comment: 'Criteria for evaluating answers'
  },
  
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'interview_questions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_interview_id',
      fields: ['interview_id']
    },
    {
      name: 'idx_skill_category',
      fields: ['skill_category']
    },
    {
      name: 'idx_order',
      fields: ['order']
    }
  ]
});

export default InterviewQuestion;

