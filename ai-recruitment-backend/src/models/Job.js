import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
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
  company: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  jobType: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'remote'),
    allowNull: false,
    field: 'job_type'
  },
  experienceLevel: {
    type: DataTypes.ENUM('entry', 'intermediate', 'senior', 'executive'),
    allowNull: false,
    field: 'experience_level'
  },
  salaryRange: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'salary_range',
    comment: 'e.g., "Rs. 50,000 - Rs. 80,000"'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Job requirements and qualifications'
  },
  responsibilities: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
    comment: 'Array of required skills'
  },
  benefits: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  applicationDeadline: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'application_deadline'
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'closed', 'expired'),
    defaultValue: 'active'
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'view_count'
  },
  applicationCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'application_count'
  },
  isRemote: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_remote'
  },
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_premium',
    comment: 'Premium job postings get more visibility'
  }
}, {
  tableName: 'jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_recruiter_id',
      fields: ['recruiter_id']
    },
    {
      name: 'idx_status',
      fields: ['status']
    },
    {
      name: 'idx_job_type',
      fields: ['job_type']
    },
    {
      name: 'idx_created_at',
      fields: ['created_at']
    }
  ]
});

export default Job;

