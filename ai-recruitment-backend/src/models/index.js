import sequelize from '../config/database.js';
import User from './User.js';
import Job from './Job.js';
import Application from './Application.js';
import Notification from './Notification.js';
import Interview from './Interview.js';
import InterviewQuestion from './InterviewQuestion.js';
import InterviewSession from './InterviewSession.js';
import InterviewResponse from './InterviewResponse.js';

// Define model relationships

// User-Job relationship (One recruiter has many jobs)
User.hasMany(Job, {
  foreignKey: 'recruiterId',
  as: 'jobs',
  onDelete: 'CASCADE'
});
Job.belongsTo(User, {
  foreignKey: 'recruiterId',
  as: 'recruiter'
});

// User-Application relationship (One candidate has many applications)
User.hasMany(Application, {
  foreignKey: 'candidateId',
  as: 'applications',
  onDelete: 'CASCADE'
});
Application.belongsTo(User, {
  foreignKey: 'candidateId',
  as: 'candidate'
});

// Job-Application relationship (One job has many applications)
Job.hasMany(Application, {
  foreignKey: 'jobId',
  as: 'applications',
  onDelete: 'CASCADE'
});
Application.belongsTo(Job, {
  foreignKey: 'jobId',
  as: 'job'
});

// User-Notification relationship (One user has many notifications)
User.hasMany(Notification, {
  foreignKey: 'userId',
  as: 'notifications',
  onDelete: 'CASCADE'
});
Notification.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Interview Relationships
// Job-Interview relationship (One job can have many interviews)
Job.hasMany(Interview, {
  foreignKey: 'jobId',
  as: 'interviews',
  onDelete: 'CASCADE'
});
Interview.belongsTo(Job, {
  foreignKey: 'jobId',
  as: 'job'
});

// User-Interview relationship (One recruiter creates many interviews)
User.hasMany(Interview, {
  foreignKey: 'recruiterId',
  as: 'createdInterviews',
  onDelete: 'CASCADE'
});
Interview.belongsTo(User, {
  foreignKey: 'recruiterId',
  as: 'recruiter'
});

// Application-Interview relationship (One application can have one interview)
Application.hasOne(Interview, {
  foreignKey: 'applicationId',
  as: 'interview',
  onDelete: 'SET NULL'
});
Interview.belongsTo(Application, {
  foreignKey: 'applicationId',
  as: 'application'
});

// Interview-Question Relationship (One interview has many questions)
Interview.hasMany(InterviewQuestion, {
  foreignKey: 'interviewId',
  as: 'questions',
  onDelete: 'CASCADE'
});
InterviewQuestion.belongsTo(Interview, {
  foreignKey: 'interviewId',
  as: 'interview'
});

// Interview-Session Relationship (One interview has many sessions)
Interview.hasMany(InterviewSession, {
  foreignKey: 'interviewId',
  as: 'sessions',
  onDelete: 'CASCADE'
});
InterviewSession.belongsTo(Interview, {
  foreignKey: 'interviewId',
  as: 'interview'
});

// User-Session Relationship (One candidate can have many sessions)
User.hasMany(InterviewSession, {
  foreignKey: 'candidateId',
  as: 'interviewSessions',
  onDelete: 'SET NULL'
});
InterviewSession.belongsTo(User, {
  foreignKey: 'candidateId',
  as: 'candidate'
});

// Session-Response Relationship (One session has many responses)
InterviewSession.hasMany(InterviewResponse, {
  foreignKey: 'sessionId',
  as: 'responses',
  onDelete: 'CASCADE'
});
InterviewResponse.belongsTo(InterviewSession, {
  foreignKey: 'sessionId',
  as: 'session'
});

// Question-Response Relationship (One question can have many responses)
InterviewQuestion.hasMany(InterviewResponse, {
  foreignKey: 'questionId',
  as: 'responses',
  onDelete: 'CASCADE'
});
InterviewResponse.belongsTo(InterviewQuestion, {
  foreignKey: 'questionId',
  as: 'question'
});

export {
  sequelize,
  User,
  Job,
  Application,
  Notification,
  Interview,
  InterviewQuestion,
  InterviewSession,
  InterviewResponse
};

