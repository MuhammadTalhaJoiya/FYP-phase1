import { create } from 'zustand';
import { notificationsAPI } from '../lib/api';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  
  fetchNotifications: async () => {
    try {
      set({ loading: true });
      const response = await notificationsAPI.getAll();
      const notifications = response.data?.notifications || [];
      
      // Map backend fields to frontend expected fields
      const mappedNotifications = notifications.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        timestamp: new Date(n.createdAt),
        read: n.isRead,
        relatedId: n.relatedId
      }));
      
      set({ 
        notifications: mappedNotifications,
        loading: false 
      });
      get().fetchUnreadCount();
    } catch (error) {
      console.error('Error fetching notifications:', error);
      set({ loading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await notificationsAPI.getUnreadCount();
      set({ unreadCount: response.data?.count || 0 });
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  },
  
  addNotification: (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },
  
  markAsRead: async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  },
  
  markAllAsRead: async () => {
    try {
      await notificationsAPI.markAllAsRead();
    set((state) => ({
      notifications: state.notifications.map((notif) => ({ ...notif, read: true })),
      unreadCount: 0,
    }));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  },
  
  deleteNotification: async (id) => {
    try {
      await notificationsAPI.delete(id);
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: notification && !notification.read 
          ? Math.max(0, state.unreadCount - 1) 
          : state.unreadCount,
      };
    });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  },

  deleteAllNotifications: async () => {
    try {
      await notificationsAPI.deleteAll();
      set({
        notifications: [],
        unreadCount: 0
      });
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  }
}));

