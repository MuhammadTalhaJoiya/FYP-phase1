import express from 'express';
import { body } from 'express-validator';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getRecruiterJobs,
  getJobStats
} from '../controllers/jobController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

// Validation rules
const createJobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('jobType').isIn(['full-time', 'part-time', 'contract', 'internship', 'remote']).withMessage('Invalid job type'),
  body('experienceLevel').isIn(['entry', 'intermediate', 'senior', 'executive']).withMessage('Invalid experience level'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('requirements').trim().notEmpty().withMessage('Job requirements are required'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  validate
];

const updateJobValidation = [
  body('title').optional().trim().notEmpty().withMessage('Job title cannot be empty'),
  body('company').optional().trim().notEmpty().withMessage('Company name cannot be empty'),
  body('location').optional().trim().notEmpty().withMessage('Location cannot be empty'),
  body('jobType').optional().isIn(['full-time', 'part-time', 'contract', 'internship', 'remote']).withMessage('Invalid job type'),
  body('experienceLevel').optional().isIn(['entry', 'intermediate', 'senior', 'executive']).withMessage('Invalid experience level'),
  body('status').optional().isIn(['draft', 'active', 'closed', 'expired']).withMessage('Invalid status'),
  validate
];

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected routes - Recruiter only
router.post('/', authenticate, authorize('recruiter', 'admin'), createJobValidation, createJob);
router.put('/:id', authenticate, authorize('recruiter', 'admin'), updateJobValidation, updateJob);
router.delete('/:id', authenticate, authorize('recruiter', 'admin'), deleteJob);
router.get('/recruiter/my-jobs', authenticate, authorize('recruiter', 'admin'), getRecruiterJobs);
router.get('/:id/stats', authenticate, authorize('recruiter', 'admin'), getJobStats);

export default router;

