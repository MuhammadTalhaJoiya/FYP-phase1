import { Application, Job, User, Notification } from '../models/index.js';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import { cleanupFile } from '../config/multer.js';
import { analyzeCV, matchJobToCV } from '../services/aiService.js';
import { sendShortlistEmail, sendInterviewEmail, sendRejectionEmail, sendAcceptanceEmail } from '../utils/mailer.js';
import { Op } from 'sequelize';

// Submit job application
export const submitApplication = async (req, res) => {
  try {
    const { jobId, coverLetter, cvUrl: providedCvUrl, matchScore, matchedSkills, missingSkills, aiFeedback } = req.body;
    const cvFile = req.file;
    
    if (!cvFile && !providedCvUrl) {
      return errorResponse(res, 'CV file or CV URL is required', 400);
    }
    
    // Check if user is a candidate
    if (req.userRole !== 'candidate') {
      if (cvFile) cleanupFile(cvFile.path);
      return errorResponse(res, 'Only candidates can apply for jobs', 403);
    }
    
    // Check if job exists
    const job = await Job.findByPk(jobId);
    if (!job) {
      if (cvFile) cleanupFile(cvFile.path);
      return notFoundResponse(res, 'Job not found');
    }
    
    if (job.status !== 'active') {
      if (cvFile) cleanupFile(cvFile.path);
      return errorResponse(res, 'This job is no longer accepting applications', 400);
    }
    
    // Check if already applied
    const existingApplication = await Application.findOne({
      where: {
        candidateId: req.userId,
        jobId: jobId
      }
    });
    
    if (existingApplication) {
      if (cvFile) cleanupFile(cvFile.path);
      return errorResponse(res, 'You have already applied for this job', 409);
    }
    
    let finalCvUrl = providedCvUrl;
    
    // If a new file is uploaded, use it (and upload to Cloudinary)
    if (cvFile) {
      const uploadResult = await uploadToCloudinary(cvFile, 'cvs');
      cleanupFile(cvFile.path);
      finalCvUrl = uploadResult.url;
    }
    
    // Create application
    const application = await Application.create({
      candidateId: req.userId,
      jobId: jobId,
      cvUrl: finalCvUrl,
      coverLetter,
      appliedAt: new Date(),
      status: 'pending',
      // If we already have match results from the check-match phase, save them
      matchScore: matchScore || null,
      matchedSkills: matchedSkills ? (typeof matchedSkills === 'string' ? matchedSkills : JSON.stringify(matchedSkills)) : null,
      missingSkills: missingSkills ? (typeof missingSkills === 'string' ? missingSkills : JSON.stringify(missingSkills)) : null,
      aiFeedback: aiFeedback || null,
      aiAnalyzedAt: (matchScore !== undefined) ? new Date() : null
    });
    
    // Increment application count on job
    await job.increment('applicationCount');
    
    // Notify recruiter
    try {
      const candidate = await User.findByPk(req.userId);
      await Notification.create({
        userId: job.recruiterId,
        title: 'New Application Received',
        message: `${candidate.fullName} has applied for the position of ${job.title}.`,
        type: 'application_received',
        relatedId: application.id
      });
    } catch (notificationError) {
      console.error('Failed to create recruiter notification:', notificationError);
    }
    
    // Perform AI analysis asynchronously ONLY IF we don't have results yet
    if (matchScore === undefined) {
      performAIAnalysis(application.id, finalCvUrl, job.id).catch(err => {
        console.error('Background AI analysis error:', err);
      });
    }
    
    return successResponse(res, application, 'Application submitted successfully', 201);
    
  } catch (error) {
    console.error('Submit application error:', error);
    if (req.file) cleanupFile(req.file.path);
    return errorResponse(res, error.message || 'Failed to submit application', 500);
  }
};

// Background AI analysis
const performAIAnalysis = async (applicationId, cvUrl, jobId) => {
  try {
    const application = await Application.findByPk(applicationId, {
      include: [{ model: Job, as: 'job' }]
    });
    
    if (!application) return;
    
    // Analyze CV and match with job
    const matchResult = await matchJobToCV(cvUrl, application.job);
    
    // Update application with AI results
    await application.update({
      matchScore: matchResult.matchScore,
      matchedSkills: JSON.stringify(matchResult.matchedSkills),
      missingSkills: JSON.stringify(matchResult.missingSkills),
      aiFeedback: matchResult.feedback,
      aiAnalyzedAt: new Date()
    });
    
    console.log(`✅ AI analysis completed for application ${applicationId}`);
  } catch (error) {
    console.error('AI analysis error:', error);
  }
};

// Get candidate's applications
export const getCandidateApplications = async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'appliedAt',
      order = 'DESC'
    } = req.query;
    
    // Build where clause
    const where = { candidateId: req.userId };
    if (status) where.status = status;
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Fetch applications
    const { count, rows: applications } = await Application.findAndCountAll({
      where,
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'recruiter',
              attributes: ['id', 'fullName', 'companyName']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order]]
    });
    
    return successResponse(res, {
      applications,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    }, 'Applications retrieved successfully');
    
  } catch (error) {
    console.error('Get applications error:', error);
    return errorResponse(res, 'Failed to retrieve applications', 500);
  }
};

// Get applications for a job (recruiter)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      status,
      minMatchScore,
      page = 1,
      limit = 10,
      sortBy = 'appliedAt',
      order = 'DESC'
    } = req.query;
    
    // Check if job exists and belongs to recruiter
    const job = await Job.findByPk(jobId);
    if (!job) {
      return notFoundResponse(res, 'Job not found');
    }
    
    if (job.recruiterId !== req.userId && req.userRole !== 'admin') {
      return errorResponse(res, 'You are not authorized to view these applications', 403);
    }
    
    // Build where clause
    const where = { jobId: jobId };
    if (status) where.status = status;
    if (minMatchScore) {
      where.matchScore = { [Op.gte]: parseFloat(minMatchScore) };
    }
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Fetch applications
    const { count, rows: applications } = await Application.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'candidate',
          attributes: ['id', 'fullName', 'email', 'phone', 'location']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order]]
    });
    
    return successResponse(res, {
      applications,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    }, 'Applications retrieved successfully');
    
  } catch (error) {
    console.error('Get job applications error:', error);
    return errorResponse(res, 'Failed to retrieve applications', 500);
  }
};

// Get single application
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const application = await Application.findByPk(id, {
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: User,
              as: 'recruiter',
              attributes: ['id', 'fullName', 'companyName', 'email']
            }
          ]
        },
        {
          model: User,
          as: 'candidate',
          attributes: ['id', 'fullName', 'email', 'phone', 'location', 'bio']
        }
      ]
    });
    
    if (!application) {
      return notFoundResponse(res, 'Application not found');
    }
    
    // Check authorization
    const isCandidate = application.candidateId === req.userId;
    const isRecruiter = application.job.recruiterId === req.userId;
    const isAdmin = req.userRole === 'admin';
    
    if (!isCandidate && !isRecruiter && !isAdmin) {
      return errorResponse(res, 'You are not authorized to view this application', 403);
    }
    
    return successResponse(res, application, 'Application retrieved successfully');
    
  } catch (error) {
    console.error('Get application error:', error);
    return errorResponse(res, 'Failed to retrieve application', 500);
  }
};

// Update application status (recruiter)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, recruiterNotes, rejectionReason, interviewScheduledAt } = req.body;
    
    const application = await Application.findByPk(id, {
      include: [
        { model: Job, as: 'job' },
        { model: User, as: 'candidate', attributes: ['id', 'fullName', 'email'] }
      ]
    });
    
    if (!application) {
      return notFoundResponse(res, 'Application not found');
    }
    
    // Check authorization
    if (application.job.recruiterId !== req.userId && req.userRole !== 'admin') {
      return errorResponse(res, 'You are not authorized to update this application', 403);
    }
    
    // Update application
    const updateData = { reviewedAt: new Date() };
    if (status) {
      updateData.status = status;
      if (status === 'rejected' || status === 'accepted') {
        updateData.respondedAt = new Date();
      }
    }
    if (recruiterNotes !== undefined) updateData.recruiterNotes = recruiterNotes;
    if (rejectionReason !== undefined) updateData.rejectionReason = rejectionReason;
    if (interviewScheduledAt !== undefined) updateData.interviewScheduledAt = interviewScheduledAt;
    
    await application.update(updateData);
    
    // Notify candidate about status update
    if (status) {
      try {
        let title = 'Application Update';
        let message = `Your application for ${application.job.title} has been updated to ${status}.`;
        let type = 'application_status';

        if (status === 'shortlisted') {
          title = 'Good News! You are Shortlisted';
          message = `Congratulations! You have been shortlisted for the ${application.job.title} position at ${application.job.company}.`;
        } else if (status === 'interview') {
          title = 'Interview Scheduled';
          message = `An interview has been scheduled for your application for ${application.job.title}. Check your email or dashboard for details.`;
          type = 'interview_scheduled';
        } else if (status === 'rejected') {
          title = 'Application Status Update';
          message = `Thank you for your interest in the ${application.job.title} position. Unfortunately, the company has decided to move forward with other candidates.`;
        } else if (status === 'accepted') {
          title = 'Job Offer Received!';
          message = `Great news! You have received a job offer for the ${application.job.title} position. Check your dashboard for details.`;
        }

        await Notification.create({
          userId: application.candidateId,
          title,
          message,
          type,
          relatedId: application.id
        });

        // Send email to candidate
        const candidateEmail = application.candidate?.email;
        const candidateName = application.candidate?.fullName || 'Candidate';
        const jobTitle = application.job.title;
        const companyName = application.job.company;

        if (candidateEmail) {
          if (status === 'shortlisted') {
            sendShortlistEmail(candidateEmail, candidateName, jobTitle, companyName)
              .then(result => console.log('📧 Shortlist email result:', result))
              .catch(err => console.error('📧 Shortlist email error:', err));
          } else if (status === 'interview') {
            const interviewDetails = interviewScheduledAt 
              ? new Date(interviewScheduledAt).toLocaleString('en-US', { 
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', 
                  hour: '2-digit', minute: '2-digit' 
                })
              : null;
            sendInterviewEmail(candidateEmail, candidateName, jobTitle, companyName, interviewDetails)
              .then(result => console.log('📧 Interview email result:', result))
              .catch(err => console.error('📧 Interview email error:', err));
          } else if (status === 'rejected') {
            sendRejectionEmail(candidateEmail, candidateName, jobTitle, companyName)
              .then(result => console.log('📧 Rejection email result:', result))
              .catch(err => console.error('📧 Rejection email error:', err));
          } else if (status === 'accepted') {
            sendAcceptanceEmail(candidateEmail, candidateName, jobTitle, companyName)
              .then(result => console.log('📧 Acceptance email result:', result))
              .catch(err => console.error('📧 Acceptance email error:', err));
          }
        }
      } catch (notificationError) {
        console.error('Failed to create candidate notification:', notificationError);
      }
    }
    
    return successResponse(res, application, 'Application updated successfully');
    
  } catch (error) {
    console.error('Update application error:', error);
    return errorResponse(res, 'Failed to update application', 500);
  }
};

// Withdraw application (candidate)
export const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;
    
    const application = await Application.findByPk(id);
    
    if (!application) {
      return notFoundResponse(res, 'Application not found');
    }
    
    // Check if user is the applicant
    if (application.candidateId !== req.userId) {
      return errorResponse(res, 'You are not authorized to withdraw this application', 403);
    }
    
    // Can't withdraw if already accepted/rejected
    if (['accepted', 'rejected'].includes(application.status)) {
      return errorResponse(res, 'Cannot withdraw an application that has been finalized', 400);
    }
    
    // Delete CV from Cloudinary (extract public ID from URL)
    const publicId = application.cvUrl.split('/').slice(-2).join('/').split('.')[0];
    await deleteFromCloudinary(publicId);
    
    // Delete application
    await application.destroy();
    
    // Decrement application count on job
    const job = await Job.findByPk(application.jobId);
    if (job) {
      await job.decrement('applicationCount');
    }
    
    return successResponse(res, null, 'Application withdrawn successfully');
    
  } catch (error) {
    console.error('Withdraw application error:', error);
    return errorResponse(res, 'Failed to withdraw application', 500);
  }
};

