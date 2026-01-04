import { InterviewSession, InterviewResponse, Interview, InterviewQuestion, User, Job } from '../models/index.js';
import { transcribeAudio } from '../services/deepgramService.js';
import { evaluateResponse, generateOverallFeedback } from '../services/interviewAIService.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Start a new interview session
 * POST /api/interviews/:id/start-session
 */
export const startSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { candidateName, candidateEmail } = req.body;
    
    const interview = await Interview.findOne({
      where: { id, status: 'active' },
      include: [
        { model: InterviewQuestion, as: 'questions', where: { isActive: true } },
        { model: Job, as: 'job' }
      ]
    });

    if (!interview) {
      return errorResponse(res, 'Interview not found or not active', 404);
    }

    // Check if interview has expired
    if (interview.expiresAt && new Date() > new Date(interview.expiresAt)) {
      return errorResponse(res, 'Interview has expired', 400);
    }

    // Create session
    const session = await InterviewSession.create({
      interviewId: interview.id,
      candidateId: req.userId || null,
      candidateName: candidateName || req.user?.fullName || 'Anonymous',
      candidateEmail: candidateEmail || req.user?.email || null,
      status: 'in_progress',
      currentQuestionIndex: 0,
      totalQuestions: interview.questions.length,
      startedAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      browserInfo: {
        browser: req.headers['sec-ch-ua'] || 'Unknown',
        platform: req.headers['sec-ch-ua-platform'] || 'Unknown'
      }
    });

    // Update interview stats
    await interview.increment('totalSessions');

    // Get first question
    const firstQuestion = interview.questions.sort((a, b) => a.order - b.order)[0];

    return successResponse(res, {
      message: 'Interview session started',
      session: {
        id: session.id,
        interviewId: interview.id,
        jobTitle: interview.job.title,
        company: interview.job.company,
        totalQuestions: session.totalQuestions,
        currentQuestionIndex: 0,
        status: session.status,
        startedAt: session.startedAt,
        expiresAt: session.expiresAt
      },
      currentQuestion: {
        id: firstQuestion.id,
        text: firstQuestion.questionText,
        audioUrl: firstQuestion.audioUrl,
        timeLimit: firstQuestion.timeLimit,
        order: firstQuestion.order,
        questionNumber: 1,
        totalQuestions: session.totalQuestions
      }
    }, 201);
  } catch (error) {
    console.error('Start session error:', error);
    return errorResponse(res, 'Failed to start interview session', 500);
  }
};

/**
 * Get session details
 * GET /api/sessions/:id
 */
export const getSession = async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await InterviewSession.findByPk(id, {
      include: [
        {
          model: Interview,
          as: 'interview',
          include: [
            { model: Job, as: 'job' },
            { model: InterviewQuestion, as: 'questions', where: { isActive: true } }
          ]
        },
        {
          model: InterviewResponse,
          as: 'responses',
          include: [{ model: InterviewQuestion, as: 'question' }]
        }
      ]
    });

    if (!session) {
      return errorResponse(res, 'Session not found', 404);
    }

    // Check authorization
    const isCandidate = session.candidateId === req.userId;
    const isRecruiter = session.interview.recruiterId === req.userId;
    
    if (!isCandidate && !isRecruiter && session.status !== 'in_progress') {
      return errorResponse(res, 'Unauthorized access', 403);
    }

    return successResponse(res, { session });
  } catch (error) {
    console.error('Get session error:', error);
    return errorResponse(res, 'Failed to fetch session', 500);
  }
};

/**
 * Get next question
 * GET /api/sessions/:id/next-question
 */
export const getNextQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await InterviewSession.findByPk(id, {
      include: [{
        model: Interview,
        as: 'interview',
        include: [{ model: InterviewQuestion, as: 'questions', where: { isActive: true } }]
      }]
    });

    if (!session) {
      return errorResponse(res, 'Session not found', 404);
    }

    if (session.status !== 'in_progress') {
      return errorResponse(res, 'Session is not active', 400);
    }

    const questions = session.interview.questions.sort((a, b) => a.order - b.order);
    const nextIndex = session.currentQuestionIndex;

    if (nextIndex >= questions.length) {
      return errorResponse(res, 'No more questions available', 400);
    }

    const nextQuestion = questions[nextIndex];

    return successResponse(res, {
      currentQuestion: {
        id: nextQuestion.id,
        text: nextQuestion.questionText,
        audioUrl: nextQuestion.audioUrl,
        timeLimit: nextQuestion.timeLimit,
        order: nextQuestion.order,
        skillCategory: nextQuestion.skillCategory,
        difficulty: nextQuestion.difficulty,
        questionNumber: nextIndex + 1,
        totalQuestions: questions.length
      },
      progress: {
        current: nextIndex + 1,
        total: questions.length,
        percentage: ((nextIndex + 1) / questions.length * 100).toFixed(0)
      }
    });
  } catch (error) {
    console.error('Get next question error:', error);
    return errorResponse(res, 'Failed to fetch next question', 500);
  }
};

/**
 * Submit answer to a question
 * POST /api/sessions/:id/submit-answer
 */
export const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionId, timeTaken } = req.body;
    
    // Audio file from multer
    const audioFile = req.file;
    
    if (!audioFile) {
      return errorResponse(res, 'Audio file is required', 400);
    }

    const session = await InterviewSession.findByPk(id, {
      include: [{
        model: Interview,
        as: 'interview',
        include: [{ model: InterviewQuestion, as: 'questions' }]
      }]
    });

    if (!session) {
      return errorResponse(res, 'Session not found', 404);
    }

    if (session.status !== 'in_progress') {
      return errorResponse(res, 'Session is not active', 400);
    }

    const question = await InterviewQuestion.findByPk(questionId);
    if (!question) {
      return errorResponse(res, 'Question not found', 404);
    }

    // Upload audio to Cloudinary
    const uploadResult = await uploadToCloudinary(audioFile, 'interview_responses');

    // Create response record
    const response = await InterviewResponse.create({
      sessionId: session.id,
      questionId: question.id,
      audioUrl: uploadResult.url,
      audioPublicId: uploadResult.publicId,
      audioDuration: timeTaken || null,
      processingStatus: 'transcribing',
      timeTaken: timeTaken || null,
      submittedAt: new Date()
    });

    // Start async processing
    processAnswerAsync(response.id, uploadResult.url, question);

    return successResponse(res, {
      message: 'Answer submitted successfully',
      response: {
        id: response.id,
        status: 'processing',
        audioUrl: uploadResult.url
      }
    }, 201);
  } catch (error) {
    console.error('Submit answer error:', error);
    return errorResponse(res, 'Failed to submit answer', 500);
  }
};

/**
 * Process answer asynchronously (transcribe + evaluate)
 */
async function processAnswerAsync(responseId, audioUrl, question) {
  try {
    const response = await InterviewResponse.findByPk(responseId);
    
    // Step 1: Transcribe with Deepgram
    console.log(`🎤 Transcribing response ${responseId}...`);
    const transcription = await transcribeAudio(audioUrl);
    
    await response.update({
      transcript: transcription.transcript,
      transcriptionConfidence: transcription.confidence,
      processingStatus: 'evaluating'
    });

    // Step 2: Evaluate with AI
    console.log(`🤖 Evaluating response ${responseId}...`);
    const evaluation = await evaluateResponse(transcription.transcript, question);
    
    await response.update({
      score: evaluation.score,
      feedback: evaluation.feedback,
      skillScores: evaluation.skillScores,
      evaluatedBy: 'ai',
      evaluationModel: 'openai-gpt-4',
      processingStatus: 'completed',
      evaluatedAt: new Date()
    });

    console.log(`✅ Response ${responseId} processed successfully`);
  } catch (error) {
    console.error(`❌ Error processing response ${responseId}:`, error);
    await InterviewResponse.update(
      {
        processingStatus: 'failed',
        processingError: error.message
      },
      { where: { id: responseId } }
    );
  }
}

/**
 * Get answer status (check if processing is complete)
 * GET /api/sessions/:sessionId/responses/:responseId/status
 */
export const getAnswerStatus = async (req, res) => {
  try {
    const { responseId } = req.params;
    
    const response = await InterviewResponse.findByPk(responseId, {
      include: [{ model: InterviewQuestion, as: 'question' }]
    });

    if (!response) {
      return errorResponse(res, 'Response not found', 404);
    }

    const result = {
      id: response.id,
      status: response.processingStatus,
      transcript: response.transcript,
      score: response.score,
      feedback: response.feedback,
      skillScores: response.skillScores,
      evaluatedAt: response.evaluatedAt
    };

    return successResponse(res, { response: result });
  } catch (error) {
    console.error('Get answer status error:', error);
    return errorResponse(res, 'Failed to fetch answer status', 500);
  }
};

/**
 * Move to next question after answer is evaluated
 * POST /api/sessions/:id/next
 */
export const moveToNextQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await InterviewSession.findByPk(id, {
      include: [{
        model: Interview,
        as: 'interview',
        include: [{ model: InterviewQuestion, as: 'questions' }]
      }]
    });

    if (!session) {
      return errorResponse(res, 'Session not found', 404);
    }

    const nextIndex = session.currentQuestionIndex + 1;
    const totalQuestions = session.interview.questions.length;

    if (nextIndex >= totalQuestions) {
      // Interview completed
      return successResponse(res, {
        message: 'Interview completed',
        completed: true,
        totalQuestions: totalQuestions
      });
    }

    await session.update({ currentQuestionIndex: nextIndex });

    const questions = session.interview.questions.sort((a, b) => a.order - b.order);
    const nextQuestion = questions[nextIndex];

    return successResponse(res, {
      message: 'Moved to next question',
      completed: false,
      currentQuestion: {
        id: nextQuestion.id,
        text: nextQuestion.questionText,
        audioUrl: nextQuestion.audioUrl,
        timeLimit: nextQuestion.timeLimit,
        order: nextQuestion.order,
        questionNumber: nextIndex + 1,
        totalQuestions: totalQuestions
      },
      progress: {
        current: nextIndex + 1,
        total: totalQuestions,
        percentage: ((nextIndex + 1) / totalQuestions * 100).toFixed(0)
      }
    });
  } catch (error) {
    console.error('Move to next error:', error);
    return errorResponse(res, 'Failed to move to next question', 500);
  }
};

/**
 * Complete interview session
 * POST /api/sessions/:id/complete
 */
export const completeSession = async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await InterviewSession.findByPk(id, {
      include: [
        {
          model: Interview,
          as: 'interview',
          include: [{ model: Job, as: 'job' }]
        },
        {
          model: InterviewResponse,
          as: 'responses',
          include: [{ model: InterviewQuestion, as: 'question' }]
        }
      ]
    });

    if (!session) {
      return errorResponse(res, 'Session not found', 404);
    }

    if (session.status === 'completed') {
      return errorResponse(res, 'Session already completed', 400);
    }

    // Check if all responses are processed
    const pendingResponses = session.responses.filter(r => r.processingStatus !== 'completed');
    if (pendingResponses.length > 0) {
      return errorResponse(res, `${pendingResponses.length} response(s) still processing. Please wait.`, 400);
    }

    // Generate overall feedback
    console.log(`🤖 Generating overall feedback for session ${id}...`);
    const overallFeedback = await generateOverallFeedback(session.responses, session.interview);

    // Update session with final results
    await session.update({
      status: 'completed',
      completedAt: new Date(),
      totalScore: overallFeedback.overallScore,
      skillScores: overallFeedback.skillScores,
      overallFeedback: overallFeedback.overallFeedback,
      strengths: overallFeedback.strengths,
      weaknesses: overallFeedback.weaknesses,
      recommendation: overallFeedback.recommendation,
      recommendationReason: overallFeedback.recommendationReason
    });

    // Update interview stats
    await session.interview.increment('completedSessions');
    
    // Recalculate average score
    const allCompletedSessions = await InterviewSession.findAll({
      where: { interviewId: session.interviewId, status: 'completed' }
    });
    const avgScore = allCompletedSessions.reduce((sum, s) => sum + parseFloat(s.totalScore || 0), 0) / allCompletedSessions.length;
    await session.interview.update({ averageScore: avgScore.toFixed(2) });

    return successResponse(res, {
      message: 'Interview completed successfully',
      session: {
        id: session.id,
        status: session.status,
        totalScore: session.totalScore,
        recommendation: session.recommendation,
        completedAt: session.completedAt
      }
    });
  } catch (error) {
    console.error('Complete session error:', error);
    return errorResponse(res, 'Failed to complete session', 500);
  }
};

/**
 * Get interview results
 * GET /api/sessions/:id/results
 */
export const getResults = async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await InterviewSession.findByPk(id, {
      include: [
        {
          model: Interview,
          as: 'interview',
          include: [{ model: Job, as: 'job' }]
        },
        {
          model: InterviewResponse,
          as: 'responses',
          include: [{ model: InterviewQuestion, as: 'question' }],
          order: [['submittedAt', 'ASC']]
        }
      ]
    });

    if (!session) {
      return errorResponse(res, 'Session not found', 404);
    }

    if (session.status !== 'completed') {
      return errorResponse(res, 'Interview not yet completed', 400);
    }

    // Check authorization
    const isCandidate = session.candidateId === req.userId;
    const isRecruiter = session.interview.recruiterId === req.userId;
    
    if (!isCandidate && !isRecruiter) {
      return errorResponse(res, 'Unauthorized access', 403);
    }

    const results = {
      session: {
        id: session.id,
        candidateName: session.candidateName,
        candidateEmail: session.candidateEmail,
        completedAt: session.completedAt,
        totalScore: session.totalScore,
        recommendation: session.recommendation,
        recommendationReason: session.recommendationReason
      },
      interview: {
        title: session.interview.title,
        jobTitle: session.interview.job.title,
        company: session.interview.job.company
      },
      overallFeedback: session.overallFeedback,
      skillScores: session.skillScores,
      strengths: session.strengths,
      weaknesses: session.weaknesses,
      questionResults: session.responses.map(r => ({
        questionNumber: r.question.order,
        questionText: r.question.questionText,
        skillCategory: r.question.skillCategory,
        difficulty: r.question.difficulty,
        transcript: r.transcript,
        score: r.score,
        feedback: r.feedback,
        skillScores: r.skillScores,
        audioUrl: isRecruiter ? r.audioUrl : null,
        timeTaken: r.timeTaken
      }))
    };

    return successResponse(res, { results });
  } catch (error) {
    console.error('Get results error:', error);
    return errorResponse(res, 'Failed to fetch results', 500);
  }
};

