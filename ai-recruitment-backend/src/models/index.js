import sequelize from '../config/database.js';
import User from './User.js';
import Job from './Job.js';
import Application from './Application.js';
import Notification from './Notification.js';

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

export {
  sequelize,
  User,
  Job,
  Application,
  Notification
};

