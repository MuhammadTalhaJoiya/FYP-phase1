import { validationResult } from 'express-validator';
import { validationErrorResponse } from '../utils/response.js';

// Middleware to handle validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg
    }));
    
    return validationErrorResponse(res, formattedErrors);
  }
  
  next();
};

