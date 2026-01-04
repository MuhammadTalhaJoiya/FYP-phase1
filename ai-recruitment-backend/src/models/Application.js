import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  candidateId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'candidate_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  jobId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'job_id',
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  cvUrl: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'cv_url',
    comment: 'URL to uploaded CV file'
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'cover_letter'
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewing', 'shortlisted', 'interview', 'rejected', 'accepted'),
    defaultValue: 'pending'
  },
  
  // AI Analysis Results
  matchScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    field: 'match_score',
    comment: 'AI-generated match score (0-100)'
  },
  matchedSkills: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'matched_skills',
    comment: 'Array of matched skills from AI analysis'
  },
  missingSkills: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'missing_skills',
    comment: 'Array of missing skills from AI analysis'
  },
  aiFeedback: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'ai_feedback',
    comment: 'Detailed AI feedback on the application'
  },
  aiAnalyzedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'ai_analyzed_at'
  },
  
  // Interview scheduling
  interviewScheduledAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'interview_scheduled_at'
  },
  interviewType: {
    type: DataTypes.ENUM('text', 'voice', 'video', 'in-person'),
    allowNull: true,
    field: 'interview_type'
  },
  interviewCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'interview_completed'
  },
  interviewScore: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    field: 'interview_score',
    comment: 'AI-generated interview score (0-100)'
  },
  interviewFeedback: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'interview_feedback'
  },
  
  // Notes and communication
  recruiterNotes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'recruiter_notes'
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'rejection_reason'
  },
  
  // Timestamps
  appliedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'applied_at'
  },
  reviewedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'reviewed_at'
  },
  respondedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'responded_at'
  }
}, {
  tableName: 'applications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_candidate_id',
      fields: ['candidate_id']
    },
    {
      name: 'idx_job_id',
      fields: ['job_id']
    },
    {
      name: 'idx_status',
      fields: ['status']
    },
    {
      unique: true,
      name: 'idx_candidate_job',
      fields: ['candidate_id', 'job_id']
    }
  ]
});

export default Application;

