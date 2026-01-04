import { Interview, InterviewQuestion, Job, User } from '../models/index.js';
import { generateInterviewQuestions } from '../services/interviewAIService.js';
import { generateSpeechToFile } from '../services/elevenlabsService.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { successResponse, errorResponse } from '../utils/response.js';
import fs from 'fs/promises';

/**
 * Create new interview
 * POST /api/interviews
 */
export const createInterview = async (req, res) => {
  try {
    const { jobId, title, description, settings, voiceConfig } = req.body;
    const recruiterId = req.userId;

    // Verify job belongs to recruiter
    const job = await Job.findOne({ where: { id: jobId, recruiterId } });
    if (!job) {
      return errorResponse(res, 'Job not found or unauthorized', 404);
    }

    // Create interview
    const interview = await Interview.create({
      jobId,
      recruiterId,
      title: title || `${job.title} - AI Voice Interview`,
      description,
      interviewType: 'voice',
      status: 'draft',
      settings: settings || {
        numberOfQuestions: 5,
        timePerQuestion: 120,
        skillCategories: ['communication', 'technical'],
        autoEvaluate: true,
        passingScore: 70
      },
      voiceConfig: voiceConfig || {
        voiceId: process.env.ELEVENLABS_VOICE_ID,
        stability: 0.5,
        similarity_boost: 0.8
      }
    });

    return successResponse(res, {
      message: 'Interview created successfully',
      interview
    }, 201);
  } catch (error) {
    console.error('Create interview error:', error);
    return errorResponse(res, 'Failed to create interview', 500);
  }
};

/**
 * Generate questions for interview
 * POST /api/interviews/:id/generate-questions
 */
export const generateQuestions = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findOne({
      where: { id, recruiterId: req.userId },
      include: [{ model: Job, as: 'job' }]
    });

    if (!interview) {
      return errorResponse(res, 'Interview not found', 404);
    }

    // Generate questions using AI
    const questions = await generateInterviewQuestions(interview.job, interview.settings);

    // Save questions to database
    const savedQuestions = [];
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const question = await InterviewQuestion.create({
        interviewId: interview.id,
        questionText: q.text,
        generatedBy: 'ai',
        skillCategory: q.skillCategory,
        difficulty: q.difficulty,
        timeLimit: q.timeLimit,
        order: i + 1,
        expectedKeywords: q.expectedKeywords,
        scoringCriteria: q.scoringCriteria
      });
      savedQuestions.push(question);
    }

    return successResponse(res, {
      message: 'Questions generated successfully',
      questions: savedQuestions
    });
  } catch (error) {
    console.error('Generate questions error:', error);
    return errorResponse(res, 'Failed to generate questions', 500);
  }
};

/**
 * Generate TTS audio for all questions
 * POST /api/interviews/:id/generate-audios
 */
export const generateQuestionAudios = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findOne({
      where: { id, recruiterId: req.userId },
      include: [{ model: InterviewQuestion, as: 'questions' }]
    });

    if (!interview) {
      return errorResponse(res, 'Interview not found', 404);
    }

    const results = [];
    
    for (const question of interview.questions) {
      try {
        // Generate TTS audio
        const audioFilePath = await generateSpeechToFile(
          question.questionText,
          interview.voiceConfig?.voiceId,
          interview.voiceConfig
        );

        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(
          { path: audioFilePath, originalname: `question_${question.id}.mp3` },
          'interview_questions'
        );

        // Update question with audio URL
        await question.update({
          audioUrl: uploadResult.url,
          audioPublicId: uploadResult.publicId
        });

        results.push({
          questionId: question.id,
          audioUrl: uploadResult.url,
          success: true
        });

        // Clean up temp file
        await fs.unlink(audioFilePath);
      } catch (err) {
        console.error(`TTS error for question ${question.id}:`, err);
        results.push({
          questionId: question.id,
          success: false,
          error: err.message
        });
      }
    }

    return successResponse(res, {
      message: 'Audio generation completed',
      results
    });
  } catch (error) {
    console.error('Generate audios error:', error);
    return errorResponse(res, 'Failed to generate audios', 500);
  }
};

/**
 * Publish interview (make it active)
 * POST /api/interviews/:id/publish
 */
export const publishInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findOne({
      where: { id, recruiterId: req.userId },
      include: [{ model: InterviewQuestion, as: 'questions' }]
    });

    if (!interview) {
      return errorResponse(res, 'Interview not found', 404);
    }

    // Validate that all questions have audio
    const questionsWithoutAudio = interview.questions.filter(q => !q.audioUrl);
    if (questionsWithoutAudio.length > 0) {
      return errorResponse(res, 'Please generate audio for all questions first', 400);
    }

    await interview.update({
      status: 'active',
      publishedAt: new Date()
    });

    return successResponse(res, {
      message: 'Interview published successfully',
      interview
    });
  } catch (error) {
    console.error('Publish interview error:', error);
    return errorResponse(res, 'Failed to publish interview', 500);
  }
};

/**
 * Get recruiter's interviews
 * GET /api/interviews/my-interviews
 */
export const getRecruiterInterviews = async (req, res) => {
  try {
    const interviews = await Interview.findAll({
      where: { recruiterId: req.userId },
      include: [
        { model: Job, as: 'job', attributes: ['id', 'title', 'company'] },
        { model: InterviewQuestion, as: 'questions' }
      ],
      order: [['createdAt', 'DESC']]
    });

    return successResponse(res, { interviews });
  } catch (error) {
    console.error('Get interviews error:', error);
    return errorResponse(res, 'Failed to fetch interviews', 500);
  }
};

/**
 * Get single interview details
 * GET /api/interviews/:id
 */
export const getInterviewDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findByPk(id, {
      include: [
        { model: Job, as: 'job' },
        { model: User, as: 'recruiter', attributes: ['id', 'fullName', 'companyName'] },
        { model: InterviewQuestion, as: 'questions', order: [['order', 'ASC']] }
      ]
    });

    if (!interview) {
      return errorResponse(res, 'Interview not found', 404);
    }

    // Check if user is authorized (recruiter or candidate starting interview)
    const isRecruiter = interview.recruiterId === req.userId;
    const isPublic = interview.status === 'active';

    if (!isRecruiter && !isPublic) {
      return errorResponse(res, 'Interview not available', 403);
    }

    // Hide sensitive info for non-recruiters
    if (!isRecruiter) {
      delete interview.dataValues.settings.passingScore;
      interview.questions.forEach(q => {
        delete q.dataValues.expectedKeywords;
        delete q.dataValues.scoringCriteria;
      });
    }

    return successResponse(res, { interview });
  } catch (error) {
    console.error('Get interview error:', error);
    return errorResponse(res, 'Failed to fetch interview', 500);
  }
};

/**
 * Update interview
 * PUT /api/interviews/:id
 */
export const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, settings, voiceConfig, status } = req.body;

    const interview = await Interview.findOne({
      where: { id, recruiterId: req.userId }
    });

    if (!interview) {
      return errorResponse(res, 'Interview not found', 404);
    }

    await interview.update({
      ...(title && { title }),
      ...(description && { description }),
      ...(settings && { settings }),
      ...(voiceConfig && { voiceConfig }),
      ...(status && { status })
    });

    return successResponse(res, {
      message: 'Interview updated successfully',
      interview
    });
  } catch (error) {
    console.error('Update interview error:', error);
    return errorResponse(res, 'Failed to update interview', 500);
  }
};

/**
 * Delete interview
 * DELETE /api/interviews/:id
 */
export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findOne({
      where: { id, recruiterId: req.userId }
    });

    if (!interview) {
      return errorResponse(res, 'Interview not found', 404);
    }

    await interview.destroy();

    return successResponse(res, {
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    console.error('Delete interview error:', error);
    return errorResponse(res, 'Failed to delete interview', 500);
  }
};

