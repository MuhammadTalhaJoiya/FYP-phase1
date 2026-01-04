import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import {
  createInterview,
  generateQuestions,
  generateQuestionAudios,
  publishInterview,
  getRecruiterInterviews,
  getInterviewDetails,
  updateInterview,
  deleteInterview
} from '../controllers/interviewController.js';

import {
  startSession,
  getSession,
  getNextQuestion,
  submitAnswer,
  getAnswerStatus,
  moveToNextQuestion,
  completeSession,
  getResults
} from '../controllers/sessionController.js';

const router = express.Router();

// Configure multer for audio uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/temp/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'audio-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_AUDIO_SIZE || 10485760) // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedFormats = (process.env.ALLOWED_AUDIO_FORMATS || 'mp3,wav,webm,m4a,ogg').split(',');
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    
    if (allowedFormats.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid audio format. Allowed: ${allowedFormats.join(', ')}`));
    }
  }
});

// Interview Management (Recruiter)
router.post('/', authenticate, authorize('recruiter', 'admin'), createInterview);
router.get('/my-interviews', authenticate, authorize('recruiter', 'admin'), getRecruiterInterviews);
router.get('/:id', optionalAuth, getInterviewDetails);
router.put('/:id', authenticate, authorize('recruiter', 'admin'), updateInterview);
router.delete('/:id', authenticate, authorize('recruiter', 'admin'), deleteInterview);
router.post('/:id/generate-questions', authenticate, authorize('recruiter', 'admin'), generateQuestions);
router.post('/:id/generate-audios', authenticate, authorize('recruiter', 'admin'), generateQuestionAudios);
router.post('/:id/publish', authenticate, authorize('recruiter', 'admin'), publishInterview);

// Interview Session (Candidate)
router.post('/:id/start-session', optionalAuth, startSession);
router.get('/sessions/:id', optionalAuth, getSession);
router.get('/sessions/:id/next-question', getNextQuestion);
router.post('/sessions/:id/submit-answer', upload.single('audio'), submitAnswer);
router.get('/sessions/:sessionId/responses/:responseId/status', getAnswerStatus);
router.post('/sessions/:id/next', moveToNextQuestion);
router.post('/sessions/:id/complete', completeSession);
router.get('/sessions/:id/results', optionalAuth, getResults);

export default router;

