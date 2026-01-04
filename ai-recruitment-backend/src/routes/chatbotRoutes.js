import express from 'express';
import { body } from 'express-validator';
import { sendMessage, getSuggestions } from '../controllers/chatbotController.js';
import { optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const messageValidation = [
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('message').isLength({ max: 500 }).withMessage('Message too long (max 500 characters)'),
  validate
];

// Routes (optional auth - works for guests and logged-in users)
router.post('/message', optionalAuth, messageValidation, sendMessage);
router.get('/suggestions', optionalAuth, getSuggestions);

export default router;

