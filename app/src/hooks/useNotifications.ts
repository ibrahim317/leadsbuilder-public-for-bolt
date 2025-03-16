import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as Notification from '../db/Notification';
import type { Notification as NotificationType } from '../db/types';

interface NotificationWithReadStatus extends NotificationType {
  isRead?: boolean;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationWithReadStatus[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Subscribe to notification changes using the Notification module
      const unsubscribe = Notification.subscribeToNotifications(
        user.id,
        () => fetchNotifications()
      );
      
      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      
      // Get notifications for this user using the Notification module
      const { data: notificationsData, error: notificationsError } = await Notification.getNotifications({
        userId: user.id
      });
      
      if (notificationsError) {
        throw notificationsError;
      }
      
      if (!notificationsData) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }
      
      // Process notifications to determine read status
      const processedNotifications = notificationsData.map(notification => ({
        ...notification,
        isRead: notification.read || false
      }));
      
      setNotifications(processedNotifications);
      setUnreadCount(processedNotifications.filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Error fetching notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      if (!user?.id) return;
      
      // Mark notification as read using the Notification module
      const { error } = await Notification.markAsRead({
        notificationId,
        userId: user.id
      });
      
      if (error) throw error;
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      ));
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      if (!user?.id) return;
      
      // Get unread notifications
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      if (unreadNotifications.length === 0) return;
      
      // Mark all notifications as read using the Notification module
      const { error } = await Notification.markAllAsRead(user.id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  };
};
