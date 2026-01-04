import express from 'express';
import { body } from 'express-validator';
import {
  submitApplication,
  getCandidateApplications,
  getJobApplications,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication
} from '../controllers/applicationController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { uploadCV } from '../config/multer.js';

const router = express.Router();

// Validation rules
const submitApplicationValidation = [
  body('jobId').isInt().withMessage('Valid job ID is required'),
  body('coverLetter').optional().trim(),
  validate
];

const updateStatusValidation = [
  body('status').isIn(['pending', 'reviewing', 'shortlisted', 'interview', 'rejected', 'accepted']).withMessage('Invalid status'),
  validate
];

// Protected routes - Candidate
router.post('/', authenticate, authorize('candidate'), uploadCV.single('cv'), submitApplicationValidation, submitApplication);
router.get('/my-applications', authenticate, authorize('candidate'), getCandidateApplications);
router.delete('/:id', authenticate, authorize('candidate'), withdrawApplication);

// Protected routes - Recruiter
router.get('/job/:jobId', authenticate, authorize('recruiter', 'admin'), getJobApplications);
router.put('/:id/status', authenticate, authorize('recruiter', 'admin'), updateStatusValidation, updateApplicationStatus);

// Protected routes - Both
router.get('/:id', authenticate, getApplicationById);

export default router;

