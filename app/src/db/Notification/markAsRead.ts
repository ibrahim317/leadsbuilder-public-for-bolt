import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

interface MarkNotificationAsReadParams {
  notificationId: string;
  userId: string; // For security, ensure the user owns the notification
}

/**
 * Marks a notification as read
 * 
 * @param params - Parameters containing notification ID and user ID
 * @returns Promise with success status or error
 */
export async function markAsRead(
  params: MarkNotificationAsReadParams
): Promise<DbResponse<boolean>> {
  try {
    const { notificationId, userId } = params;
    
    // Update the notification
    const { error } = await supabaseClient
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId); // Ensure the user owns the notification
    
    if (error) {
      return { data: false, error: handleSupabaseError(error) };
    }
    
    return { data: true, error: null };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { data: false, error: handleSupabaseError(error) };
  }
}

/**
 * Marks all notifications for a user as read
 * 
 * @param userId - The ID of the user whose notifications to mark as read
 * @returns Promise with success status or error
 */
export async function markAllAsRead(userId: string): Promise<DbResponse<boolean>> {
  try {
    // Update all notifications for the user
    const { error } = await supabaseClient
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false); // Only update unread notifications
    
    if (error) {
      return { data: false, error: handleSupabaseError(error) };
    }
    
    return { data: true, error: null };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return { data: false, error: handleSupabaseError(error) };
  }
} 