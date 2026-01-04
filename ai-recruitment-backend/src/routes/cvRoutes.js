import express from 'express';
import { uploadAndAnalyzeCV, uploadProfilePicture, matchCVWithJob } from '../controllers/cvController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadCV, uploadImage } from '../config/multer.js';

const router = express.Router();

// Protected routes - Candidate only
router.post('/upload', authenticate, authorize('candidate'), uploadCV.single('cv'), uploadAndAnalyzeCV);
router.post('/match/:jobId', authenticate, authorize('candidate'), uploadCV.single('cv'), matchCVWithJob);

// Protected routes - All users
router.post('/profile-picture', authenticate, uploadImage.single('image'), uploadProfilePicture);

export default router;

