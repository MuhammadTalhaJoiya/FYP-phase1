import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const InterviewSession = sequelize.define('InterviewSession', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
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
  
  // Can be null for anonymous interviews
  candidateId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'candidate_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  
  // Anonymous candidate info
  candidateName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'candidate_name'
  },
  
  candidateEmail: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'candidate_email'
  },
  
  status: {
    type: DataTypes.ENUM('not_started', 'in_progress', 'completed', 'abandoned', 'expired'),
    defaultValue: 'not_started'
  },
  
  currentQuestionIndex: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'current_question_index'
  },
  
  totalQuestions: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'total_questions'
  },
  
  // Scores
  totalScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    field: 'total_score',
    comment: 'Overall score 0-100'
  },
  
  skillScores: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'skill_scores',
    comment: '{ communication: 85, technical: 90, ... }'
  },
  
  // AI evaluation results
  overallFeedback: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'overall_feedback'
  },
  
  strengths: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of strength descriptions'
  },
  
  weaknesses: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Array of weakness descriptions'
  },
  
  recommendation: {
    type: DataTypes.ENUM('shortlist', 'consider', 'reject'),
    allowNull: true,
    comment: 'AI recommendation'
  },
  
  recommendationReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'recommendation_reason'
  },
  
  // Timestamps
  startedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'started_at'
  },
  
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'completed_at'
  },
  
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'expires_at'
  },
  
  // Session metadata
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: true,
    field: 'ip_address'
  },
  
  userAgent: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'user_agent'
  },
  
  browserInfo: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'browser_info',
    comment: 'Browser, OS, device type'
  }
}, {
  tableName: 'interview_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_interview_id',
      fields: ['interview_id']
    },
    {
      name: 'idx_candidate_id',
      fields: ['candidate_id']
    },
    {
      name: 'idx_status',
      fields: ['status']
    },
    {
      name: 'idx_candidate_email',
      fields: ['candidate_email']
    }
  ]
});

export default InterviewSession;

