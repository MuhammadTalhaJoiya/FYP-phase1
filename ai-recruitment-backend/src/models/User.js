import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'full_name'
  },
  role: {
    type: DataTypes.ENUM('candidate', 'recruiter', 'admin'),
    allowNull: false,
    defaultValue: 'candidate'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  avatar: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'URL to profile picture'
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Premium/Subscription fields
  isPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_premium'
  },
  premiumExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'premium_expires_at'
  },
  subscriptionPlan: {
    type: DataTypes.ENUM('free', 'candidate_premium', 'recruiter_starter', 'recruiter_professional', 'recruiter_enterprise'),
    defaultValue: 'free',
    field: 'subscription_plan'
  },
  
  // Usage tracking for candidates
  aiAnalysisCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'ai_analysis_count',
    comment: 'Number of AI CV analyses used this month'
  },
  analysisResetDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'analysis_reset_date',
    comment: 'Date when analysis count resets'
  },
  
  // Recruiter specific fields
  companyName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'company_name'
  },
  companyWebsite: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'company_website'
  },
  jobPostsRemaining: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'job_posts_remaining',
    comment: 'Number of job posts remaining in subscription'
  },
  
  // Account status
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified',
    comment: 'Email verification status'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_login_at'
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  
  hooks: {
    // Hash password before creating user
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    
    // Hash password before updating if it changed
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to validate password
User.prototype.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Instance method to check if premium is active
User.prototype.isPremiumActive = function() {
  if (!this.isPremium) return false;
  if (!this.premiumExpiresAt) return false;
  return new Date() < new Date(this.premiumExpiresAt);
};

// Instance method to check AI analysis availability for candidates
User.prototype.canUseAIAnalysis = function() {
  if (this.role !== 'candidate') return false;
  if (this.isPremiumActive()) return true;
  
  // Check if analysis count needs reset (monthly)
  const now = new Date();
  if (!this.analysisResetDate || now > new Date(this.analysisResetDate)) {
    return true; // Will be reset on next analysis
  }
  
  return this.aiAnalysisCount < 5; // Free tier: 5 analyses per month
};

// Instance method to safely return user data (without password)
User.prototype.toSafeObject = function() {
  const { password, ...safeUser } = this.toJSON();
  return safeUser;
};

export default User;

