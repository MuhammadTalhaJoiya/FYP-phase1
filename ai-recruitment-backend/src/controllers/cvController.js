import { User, Job } from '../models/index.js';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { cleanupFile } from '../config/multer.js';
import { analyzeCV, matchJobToCV } from '../services/aiService.js';

// Upload and analyze CV (General Analysis)
export const uploadAndAnalyzeCV = async (req, res) => {
  try {
    const cvFile = req.file;
    
    if (!cvFile) {
      return errorResponse(res, 'CV file is required', 400);
    }
    
    // Check if user is a candidate
    if (req.userRole !== 'candidate') {
      cleanupFile(cvFile.path);
      return errorResponse(res, 'Only candidates can upload CVs', 403);
    }
    
    // Get user and check AI analysis limit
    const user = await User.findByPk(req.userId);
    
    // Check if user can use AI analysis
    if (!user.canUseAIAnalysis()) {
      cleanupFile(cvFile.path);
      return errorResponse(res, 'AI analysis limit reached. Please upgrade to premium for unlimited analyses.', 403);
    }
    
    // Upload CV to Cloudinary
    const uploadResult = await uploadToCloudinary(cvFile, 'cvs');
    cleanupFile(cvFile.path);
    
    // Analyze CV with AI
    const analysisResult = await analyzeCV(uploadResult.url);
    
    // Update user's AI analysis count
    const now = new Date();
    const resetDate = user.analysisResetDate ? new Date(user.analysisResetDate) : null;
    
    // Reset count if it's a new month
    if (!resetDate || now > resetDate) {
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);
      nextMonth.setHours(0, 0, 0, 0);
      
      await user.update({
        aiAnalysisCount: 1,
        analysisResetDate: nextMonth
      });
    } else {
      await user.increment('aiAnalysisCount');
    }
    
    return successResponse(res, {
      cvUrl: uploadResult.url,
      analysis: analysisResult.analysis,
      analysesRemaining: user.isPremiumActive() ? 'unlimited' : Math.max(0, 5 - (user.aiAnalysisCount + 1))
    }, 'CV uploaded and analyzed successfully', 201);
    
  } catch (error) {
    console.error('CV upload error:', error);
    if (req.file) cleanupFile(req.file.path);
    return errorResponse(res, error.message || 'Failed to upload and analyze CV', 500);
  }
};

// Match CV with specific Job
export const matchCVWithJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const cvFile = req.file;

    if (!cvFile) {
      return errorResponse(res, 'CV file is required', 400);
    }

    // Check if user is a candidate
    if (req.userRole !== 'candidate') {
      cleanupFile(cvFile.path);
      return errorResponse(res, 'Only candidates can upload CVs', 403);
    }

    // Check if job exists
    const job = await Job.findByPk(jobId);
    if (!job) {
      cleanupFile(cvFile.path);
      return notFoundResponse(res, 'Job not found');
    }

    // Get user and check AI analysis limit
    const user = await User.findByPk(req.userId);
    
    // Check if user can use AI analysis
    if (!user.canUseAIAnalysis()) {
      cleanupFile(cvFile.path);
      return errorResponse(res, 'AI analysis limit reached. Please upgrade to premium for unlimited analyses.', 403);
    }

    // Upload CV to Cloudinary
    const uploadResult = await uploadToCloudinary(cvFile, 'cvs');
    cleanupFile(cvFile.path);

    // Analyze CV and match with job
    const matchResult = await matchJobToCV(uploadResult.url, job);

    // Update user's AI analysis count
    const now = new Date();
    const resetDate = user.analysisResetDate ? new Date(user.analysisResetDate) : null;
    
    if (!resetDate || now > resetDate) {
      const nextMonth = new Date(now);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);
      nextMonth.setHours(0, 0, 0, 0);
      
      await user.update({
        aiAnalysisCount: 1,
        analysisResetDate: nextMonth
      });
    } else {
      await user.increment('aiAnalysisCount');
    }

    return successResponse(res, {
      cvUrl: uploadResult.url,
      matchResult,
      analysesRemaining: user.isPremiumActive() ? 'unlimited' : Math.max(0, 5 - (user.aiAnalysisCount))
    }, 'CV matched with job successfully', 200);

  } catch (error) {
    console.error('CV matching error:', error);
    if (req.file) cleanupFile(req.file.path);
    return errorResponse(res, error.message || 'Failed to match CV with job', 500);
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  try {
    const imageFile = req.file;
    
    if (!imageFile) {
      return errorResponse(res, 'Image file is required', 400);
    }
    
    // Upload image to Cloudinary
    const uploadResult = await uploadToCloudinary(imageFile, 'avatars');
    cleanupFile(imageFile.path);
    
    // Update user's avatar
    const user = await User.findByPk(req.userId);
    
    // Delete old avatar if exists
    if (user.avatar) {
      const oldPublicId = user.avatar.split('/').slice(-2).join('/').split('.')[0];
      await deleteFromCloudinary(oldPublicId);
    }
    
    await user.update({ avatar: uploadResult.url });
    
    return successResponse(res, {
      avatarUrl: uploadResult.url
    }, 'Profile picture uploaded successfully');
    
  } catch (error) {
    console.error('Profile picture upload error:', error);
    if (req.file) cleanupFile(req.file.path);
    return errorResponse(res, 'Failed to upload profile picture', 500);
  }
};

