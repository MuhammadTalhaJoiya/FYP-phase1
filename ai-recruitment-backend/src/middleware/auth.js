import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/index.js';
import { unauthorizedResponse, forbiddenResponse } from '../utils/response.js';

// Middleware to verify JWT and attach user to request
export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return unauthorizedResponse(res, 'No token provided');
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return unauthorizedResponse(res, 'Invalid or expired token');
    }
    
    // Get user from database
    const user = await User.findByPk(decoded.id);
    
    if (!user || !user.isActive) {
      return unauthorizedResponse(res, 'User not found or inactive');
    }
    
    // Attach user to request
    req.user = user;
    req.userId = user.id;
    req.userRole = user.role;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return unauthorizedResponse(res, 'Authentication failed');
  }
};

// Middleware to check user role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorizedResponse(res, 'Authentication required');
    }
    
    if (!roles.includes(req.user.role)) {
      return forbiddenResponse(res, 'Insufficient permissions');
    }

    next();
  };
};

// Middleware to check if user is premium
export const requirePremium = (req, res, next) => {
  if (!req.user) {
    return unauthorizedResponse(res, 'Authentication required');
  }
  
  if (!req.user.isPremiumActive()) {
    return forbiddenResponse(res, 'Premium subscription required');
  }
  
  next();
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      if (decoded) {
        const user = await User.findByPk(decoded.id);
        if (user && user.isActive) {
          req.user = user;
          req.userId = user.id;
          req.userRole = user.role;
        }
      }
    }
  } catch (error) {
    // Silent fail for optional auth
    console.error('Optional auth error:', error);
  }
  
  next();
};

