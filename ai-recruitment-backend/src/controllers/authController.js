import { User } from '../models/index.js';
import { generateUserToken } from '../utils/jwt.js';
import { successResponse, errorResponse, validationErrorResponse } from '../utils/response.js';

// Register new user
export const register = async (req, res) => {
  try {
    const { email, password, fullName, role, phone, location, companyName, companyWebsite } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 'Email already registered', 409);
    }
    
    // Create user data
    const userData = {
      email,
      password,
      fullName,
      role: role || 'candidate',
      phone,
      location
    };
    
    // Add recruiter-specific fields
    if (role === 'recruiter') {
      userData.companyName = companyName;
      userData.companyWebsite = companyWebsite;
    }
    
    // Create user
    const user = await User.create(userData);
    
    // Generate token
    const token = generateUserToken(user);
    
    // Return response without password
    return successResponse(res, {
      user: user.toSafeObject(),
      token
    }, 'User registered successfully', 201);
    
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse(res, error.message || 'Registration failed', 500);
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return errorResponse(res, 'Invalid email or password', 401);
    }
    
    // Check if user is active
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }
    
    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    
    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid email or password', 401);
    }
    
    // Update last login
    await user.update({ lastLoginAt: new Date() });
    
    // Generate token
    const token = generateUserToken(user);
    
    return successResponse(res, {
      user: user.toSafeObject(),
      token
    }, 'Login successful');
    
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 'Login failed', 500);
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    
    return successResponse(res, user.toSafeObject(), 'Profile retrieved successfully');
    
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, 'Failed to retrieve profile', 500);
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    
    const { fullName, phone, location, bio, companyName, companyWebsite } = req.body;
    
    // Update allowed fields
    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    
    // Recruiter-specific fields
    if (user.role === 'recruiter') {
      if (companyName !== undefined) updateData.companyName = companyName;
      if (companyWebsite !== undefined) updateData.companyWebsite = companyWebsite;
    }
    
    await user.update(updateData);
    
    return successResponse(res, user.toSafeObject(), 'Profile updated successfully');
    
  } catch (error) {
    console.error('Update profile error:', error);
    return errorResponse(res, 'Failed to update profile', 500);
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    
    // Verify current password
    const isPasswordValid = await user.validatePassword(currentPassword);
    
    if (!isPasswordValid) {
      return errorResponse(res, 'Current password is incorrect', 401);
    }
    
    // Update password
    await user.update({ password: newPassword });
    
    return successResponse(res, null, 'Password changed successfully');
    
  } catch (error) {
    console.error('Change password error:', error);
    return errorResponse(res, 'Failed to change password', 500);
  }
};

// Get user statistics (for dashboard)
export const getUserStats = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    
    const stats = {
      isPremium: user.isPremiumActive(),
      subscriptionPlan: user.subscriptionPlan,
      premiumExpiresAt: user.premiumExpiresAt
    };
    
    if (user.role === 'candidate') {
      stats.aiAnalysisCount = user.aiAnalysisCount;
      stats.analysisRemaining = user.isPremiumActive() ? 'unlimited' : Math.max(0, 5 - user.aiAnalysisCount);
      stats.analysisResetDate = user.analysisResetDate;
    }
    
    if (user.role === 'recruiter') {
      stats.jobPostsRemaining = user.jobPostsRemaining;
      stats.companyName = user.companyName;
    }
    
    return successResponse(res, stats, 'Statistics retrieved successfully');
    
  } catch (error) {
    console.error('Get stats error:', error);
    return errorResponse(res, 'Failed to retrieve statistics', 500);
  }
};

