import { successResponse, errorResponse } from '../utils/response.js';
import { getChatbotResponse } from '../services/aiService.js';
import { User } from '../models/index.js';

// Handle chatbot message
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim() === '') {
      return errorResponse(res, 'Message is required', 400);
    }
    
    // Get user context
    let context = {};
    if (req.userId) {
      const user = await User.findByPk(req.userId, {
        attributes: ['id', 'fullName', 'role', 'isPremium', 'subscriptionPlan']
      });
      
      context = {
        userId: user.id,
        userName: user.fullName,
        userRole: user.role,
        isPremium: user.isPremiumActive ? user.isPremiumActive() : false
      };
    }
    
    // Get AI response
    const response = await getChatbotResponse(message, context);
    
    return successResponse(res, response, 'Message sent successfully');
    
  } catch (error) {
    console.error('Chatbot error:', error);
    return errorResponse(res, 'Failed to process message', 500);
  }
};

// Get chatbot suggestions
export const getSuggestions = async (req, res) => {
  try {
    const { userRole } = req;
    
    let suggestions = [
      "How do I write a good CV?",
      "What are the best job search strategies?",
      "Tell me about interview preparation"
    ];
    
    if (userRole === 'candidate') {
      suggestions = [
        "Show me jobs matching my profile",
        "How can I improve my CV?",
        "What skills are in demand?",
        "Help me prepare for an interview"
      ];
    } else if (userRole === 'recruiter') {
      suggestions = [
        "How do I write an effective job post?",
        "What are the best screening questions?",
        "How to evaluate candidates?",
        "Tips for conducting interviews"
      ];
    }
    
    return successResponse(res, { suggestions }, 'Suggestions retrieved successfully');
    
  } catch (error) {
    console.error('Get suggestions error:', error);
    return errorResponse(res, 'Failed to retrieve suggestions', 500);
  }
};

