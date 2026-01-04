import { Job, User, Application } from '../models/index.js';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response.js';
import { Op } from 'sequelize';

// Create new job posting
export const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      experienceLevel,
      salaryRange,
      description,
      requirements,
      responsibilities,
      skills,
      benefits,
      applicationDeadline,
      isRemote,
      isPremium
    } = req.body;
    
    // Check if user is a recruiter
    if (req.userRole !== 'recruiter') {
      return errorResponse(res, 'Only recruiters can post jobs', 403);
    }
    
    // Check if recruiter has job posts remaining
    const recruiter = await User.findByPk(req.userId);
    if (recruiter.jobPostsRemaining <= 0 && !recruiter.isPremiumActive()) {
      return errorResponse(res, 'No job posts remaining. Please upgrade your subscription.', 403);
    }
    
    // Create job
    const job = await Job.create({
      recruiterId: req.userId,
      title,
      company,
      location,
      jobType,
      experienceLevel,
      salaryRange,
      description,
      requirements,
      responsibilities,
      skills: JSON.stringify(skills),
      benefits,
      applicationDeadline,
      isRemote: isRemote || false,
      isPremium: isPremium || false,
      status: 'active'
    });
    
    // Decrement job posts remaining (if not unlimited)
    if (!recruiter.isPremiumActive() || recruiter.subscriptionPlan !== 'recruiter_enterprise') {
      await recruiter.update({
        jobPostsRemaining: recruiter.jobPostsRemaining - 1
      });
    }
    
    return successResponse(res, job, 'Job posted successfully', 201);
    
  } catch (error) {
    console.error('Create job error:', error);
    return errorResponse(res, error.message || 'Failed to create job', 500);
  }
};

// Get all jobs (with filters)
export const getJobs = async (req, res) => {
  try {
    const {
      search,
      jobType,
      experienceLevel,
      location,
      isRemote,
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      order = 'DESC'
    } = req.query;
    
    // Build where clause
    const where = { status: 'active' };
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { company: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (jobType) where.jobType = jobType;
    if (experienceLevel) where.experienceLevel = experienceLevel;
    if (location) where.location = { [Op.like]: `%${location}%` };
    if (isRemote !== undefined) where.isRemote = isRemote === 'true';
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Fetch jobs
    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'recruiter',
          attributes: ['id', 'fullName', 'companyName', 'companyWebsite']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order]]
    });
    
    return successResponse(res, {
      jobs,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    }, 'Jobs retrieved successfully');
    
  } catch (error) {
    console.error('Get jobs error:', error);
    return errorResponse(res, 'Failed to retrieve jobs', 500);
  }
};

// Get single job by ID
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findByPk(id, {
      include: [
        {
          model: User,
          as: 'recruiter',
          attributes: ['id', 'fullName', 'companyName', 'companyWebsite', 'email', 'phone']
        }
      ]
    });
    
    if (!job) {
      return notFoundResponse(res, 'Job not found');
    }
    
    // Increment view count
    await job.increment('viewCount');
    
    return successResponse(res, job, 'Job retrieved successfully');
    
  } catch (error) {
    console.error('Get job error:', error);
    return errorResponse(res, 'Failed to retrieve job', 500);
  }
};

// Update job
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findByPk(id);
    
    if (!job) {
      return notFoundResponse(res, 'Job not found');
    }
    
    // Check if user is the recruiter who posted this job
    if (job.recruiterId !== req.userId && req.userRole !== 'admin') {
      return errorResponse(res, 'You are not authorized to update this job', 403);
    }
    
    const {
      title,
      company,
      location,
      jobType,
      experienceLevel,
      salaryRange,
      description,
      requirements,
      responsibilities,
      skills,
      benefits,
      applicationDeadline,
      isRemote,
      isPremium,
      status
    } = req.body;
    
    // Update job
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (company !== undefined) updateData.company = company;
    if (location !== undefined) updateData.location = location;
    if (jobType !== undefined) updateData.jobType = jobType;
    if (experienceLevel !== undefined) updateData.experienceLevel = experienceLevel;
    if (salaryRange !== undefined) updateData.salaryRange = salaryRange;
    if (description !== undefined) updateData.description = description;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (responsibilities !== undefined) updateData.responsibilities = responsibilities;
    if (skills !== undefined) updateData.skills = JSON.stringify(skills);
    if (benefits !== undefined) updateData.benefits = benefits;
    if (applicationDeadline !== undefined) updateData.applicationDeadline = applicationDeadline;
    if (isRemote !== undefined) updateData.isRemote = isRemote;
    if (isPremium !== undefined) updateData.isPremium = isPremium;
    if (status !== undefined) updateData.status = status;
    
    await job.update(updateData);
    
    return successResponse(res, job, 'Job updated successfully');
    
  } catch (error) {
    console.error('Update job error:', error);
    return errorResponse(res, 'Failed to update job', 500);
  }
};

// Delete job
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findByPk(id);
    
    if (!job) {
      return notFoundResponse(res, 'Job not found');
    }
    
    // Check if user is the recruiter who posted this job
    if (job.recruiterId !== req.userId && req.userRole !== 'admin') {
      return errorResponse(res, 'You are not authorized to delete this job', 403);
    }
    
    await job.destroy();
    
    return successResponse(res, null, 'Job deleted successfully');
    
  } catch (error) {
    console.error('Delete job error:', error);
    return errorResponse(res, 'Failed to delete job', 500);
  }
};

// Get recruiter's jobs
export const getRecruiterJobs = async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      order = 'DESC'
    } = req.query;
    
    // Build where clause
    const where = { recruiterId: req.userId };
    if (status) where.status = status;

    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Fetch jobs
    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      include: [
        {
          model: Application,
          as: 'applications',
          attributes: ['id', 'status']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, order]]
    });

    return successResponse(res, {
      jobs,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    }, 'Jobs retrieved successfully');
    
  } catch (error) {
    console.error('Get recruiter jobs error:', error);
    return errorResponse(res, 'Failed to retrieve jobs', 500);
  }
};

// Get job statistics for recruiter
export const getJobStats = async (req, res) => {
  try {
    const { id } = req.params;
    
    const job = await Job.findByPk(id, {
      include: [
        {
          model: Application,
          as: 'applications',
          attributes: ['id', 'status', 'matchScore']
        }
      ]
    });
    
    if (!job) {
      return notFoundResponse(res, 'Job not found');
    }
    
    // Check authorization
    if (job.recruiterId !== req.userId && req.userRole !== 'admin') {
      return errorResponse(res, 'You are not authorized to view these statistics', 403);
    }
    
    // Calculate statistics
    const totalApplications = job.applications.length;
    const statusCounts = {
      pending: 0,
      reviewing: 0,
      shortlisted: 0,
      interview: 0,
      rejected: 0,
      accepted: 0
    };
    
    let totalMatchScore = 0;
    let matchedApplications = 0;
    
    job.applications.forEach(app => {
      statusCounts[app.status]++;
      if (app.matchScore) {
        totalMatchScore += parseFloat(app.matchScore);
        matchedApplications++;
      }
    });
    
    const stats = {
      jobId: job.id,
      title: job.title,
      status: job.status,
      viewCount: job.viewCount,
      totalApplications,
      statusBreakdown: statusCounts,
      averageMatchScore: matchedApplications > 0 ? (totalMatchScore / matchedApplications).toFixed(2) : 0,
      createdAt: job.createdAt
    };
    
    return successResponse(res, stats, 'Job statistics retrieved successfully');
    
  } catch (error) {
    console.error('Get job stats error:', error);
    return errorResponse(res, 'Failed to retrieve statistics', 500);
  }
};

