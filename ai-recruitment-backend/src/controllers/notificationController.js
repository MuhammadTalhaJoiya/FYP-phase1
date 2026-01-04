import { Notification } from '../models/index.js';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response.js';

// Get user notifications
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: notifications } = await Notification.findAndCountAll({
      where: { userId: req.userId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return successResponse(res, {
      notifications,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    }, 'Notifications retrieved successfully');
  } catch (error) {
    console.error('Get notifications error:', error);
    return errorResponse(res, 'Failed to retrieve notifications', 500);
  }
};

// Get unread count
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.count({
      where: { 
        userId: req.userId,
        isRead: false
      }
    });

    return successResponse(res, { count }, 'Unread count retrieved successfully');
  } catch (error) {
    console.error('Get unread count error:', error);
    return errorResponse(res, 'Failed to retrieve unread count', 500);
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({
      where: { id, userId: req.userId }
    });

    if (!notification) {
      return notFoundResponse(res, 'Notification not found');
    }

    await notification.update({ isRead: true });

    return successResponse(res, notification, 'Notification marked as read');
  } catch (error) {
    console.error('Mark notification error:', error);
    return errorResponse(res, 'Failed to update notification', 500);
  }
};

// Mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.userId, isRead: false } }
    );

    return successResponse(res, null, 'All notifications marked as read');
  } catch (error) {
    console.error('Mark all as read error:', error);
    return errorResponse(res, 'Failed to update notifications', 500);
  }
};

// Delete notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Notification.destroy({
      where: { id, userId: req.userId }
    });

    if (!result) {
      return notFoundResponse(res, 'Notification not found');
    }

    return successResponse(res, null, 'Notification deleted successfully');
  } catch (error) {
    console.error('Delete notification error:', error);
    return errorResponse(res, 'Failed to delete notification', 500);
  }
};

// Delete all notifications
export const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.destroy({
      where: { userId: req.userId }
    });

    return successResponse(res, null, 'All notifications deleted successfully');
  } catch (error) {
    console.error('Delete all notifications error:', error);
    return errorResponse(res, 'Failed to delete notifications', 500);
  }
};

