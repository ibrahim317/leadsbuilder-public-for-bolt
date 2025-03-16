import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

interface DeleteNotificationParams {
  notificationId: string;
  userId: string; // For security, ensure the user owns the notification
}

/**
 * Deletes a notification
 * 
 * @param params - Parameters containing notification ID and user ID
 * @returns Promise with success status or error
 */
export async function deleteNotification(
  params: DeleteNotificationParams
): Promise<DbResponse<boolean>> {
  try {
    const { notificationId, userId } = params;
    
    // Delete the notification
    const { error } = await supabaseClient
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userId); // Ensure the user owns the notification
    
    if (error) {
      return { data: false, error: handleSupabaseError(error) };
    }
    
    return { data: true, error: null };
  } catch (error) {
    console.error('Error deleting notification:', error);
    return { data: false, error: handleSupabaseError(error) };
  }
}

/**
 * Deletes all read notifications for a user
 * 
 * @param userId - The ID of the user whose read notifications to delete
 * @returns Promise with success status or error
 */
async function deleteAllReadNotifications(userId: string): Promise<DbResponse<boolean>> {
  try {
    // Delete all read notifications for the user
    const { error } = await supabaseClient
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .eq('read', true); // Only delete read notifications
    
    if (error) {
      return { data: false, error: handleSupabaseError(error) };
    }
    
    return { data: true, error: null };
  } catch (error) {
    console.error('Error deleting read notifications:', error);
    return { data: false, error: handleSupabaseError(error) };
  }
} 