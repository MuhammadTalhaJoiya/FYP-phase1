import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const InterviewResponse = sequelize.define('InterviewResponse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  sessionId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'session_id',
    references: {
      model: 'interview_sessions',
      key: 'id'
    }
  },
  
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'question_id',
    references: {
      model: 'interview_questions',
      key: 'id'
    }
  },
  
  // Cloudinary audio storage
  audioUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'audio_url',
    comment: 'Candidate answer audio URL'
  },
  
  audioPublicId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'audio_public_id',
    comment: 'Cloudinary public ID'
  },
  
  audioDuration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'audio_duration',
    comment: 'Duration in seconds'
  },
  
  // Deepgram transcription
  transcript: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Deepgram STT transcript'
  },
  
  transcriptionConfidence: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    field: 'transcription_confidence',
    comment: 'Deepgram confidence score 0-100'
  },
  
  deepgramJobId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'deepgram_job_id',
    comment: 'For async transcription tracking'
  },
  
  // AI evaluation
  score: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    comment: 'Answer score 0-100'
  },
  
  feedback: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'AI-generated feedback'
  },
  
  skillScores: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'skill_scores',
    comment: 'Individual skill scores for this answer'
  },
  
  // Evaluation metadata
  evaluatedBy: {
    type: DataTypes.ENUM('ai', 'manual', 'hybrid'),
    defaultValue: 'ai',
    field: 'evaluated_by'
  },
  
  evaluationModel: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'evaluation_model',
    comment: 'OpenAI/Gemini model used'
  },
  
  processingStatus: {
    type: DataTypes.ENUM('pending', 'transcribing', 'evaluating', 'completed', 'failed'),
    defaultValue: 'pending',
    field: 'processing_status'
  },
  
  processingError: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'processing_error'
  },
  
  // Response timing
  timeTaken: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'time_taken',
    comment: 'Time taken to answer in seconds'
  },
  
  attemptNumber: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    field: 'attempt_number',
    comment: 'Allow retries if enabled'
  },
  
  submittedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'submitted_at'
  },
  
  evaluatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'evaluated_at'
  }
}, {
  tableName: 'interview_responses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_session_id',
      fields: ['session_id']
    },
    {
      name: 'idx_question_id',
      fields: ['question_id']
    },
    {
      name: 'idx_processing_status',
      fields: ['processing_status']
    },
    {
      unique: true,
      name: 'idx_session_question',
      fields: ['session_id', 'question_id', 'attempt_number']
    }
  ]
});

export default InterviewResponse;

