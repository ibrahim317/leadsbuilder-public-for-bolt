import { supabaseClient } from '../../lib/supabaseClient';
import { Notification } from '../types';

type NotificationCallback = (notification: Notification) => void;

/**
 * Subscribes to real-time notification updates for a specific user
 * 
 * @param userId - The ID of the user to subscribe to notifications for
 * @param callback - Function to call when a new notification is received
 * @returns A function to unsubscribe from the real-time updates
 */
export function subscribeToNotifications(
  userId: string,
  callback: NotificationCallback
): () => void {
  // Subscribe to the notifications table for the specific user
  const subscription = supabaseClient
    .channel('notifications-channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        // Call the callback with the new notification
        if (payload.new) {
          callback(payload.new as Notification);
        }
      }
    )
    .subscribe();

  // Return a function to unsubscribe
  return () => {
    supabaseClient.removeChannel(subscription);
  };
}

/**
 * Subscribes to real-time notification updates for all users (admin only)
 * 
 * @param callback - Function to call when a new notification is received
 * @returns A function to unsubscribe from the real-time updates
 */
function subscribeToAllNotifications(
  callback: NotificationCallback
): () => void {
  // Subscribe to all notifications (for admin dashboard)
  const subscription = supabaseClient
    .channel('all-notifications-channel')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications'
      },
      (payload) => {
        // Call the callback with the new notification
        if (payload.new) {
          callback(payload.new as Notification);
        }
      }
    )
    .subscribe();

  // Return a function to unsubscribe
  return () => {
    supabaseClient.removeChannel(subscription);
  };
} 