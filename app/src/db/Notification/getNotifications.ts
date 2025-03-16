import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbListResponse, Notification } from '../types';

interface GetNotificationsParams {
  userId: string;
  limit?: number;
  offset?: number;
  onlyUnread?: boolean;
}

/**
 * Fetches notifications for a specific user
 * 
 * @param params - Parameters for filtering notifications
 * @returns Promise with notifications list or error
 */
export async function getNotifications(
  params: GetNotificationsParams
): Promise<DbListResponse<Notification>> {
  try {
    const { userId, limit = 20, offset = 0, onlyUnread = false } = params;
    
    // Build query
    let query = supabaseClient
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Add filter for unread notifications if requested
    if (onlyUnread) {
      query = query.eq('read', false);
    }
    
    // Execute query
    const { data, count, error } = await query;
    
    if (error) {
      return { data: [], error: handleSupabaseError(error) };
    }
    
    return { 
      data: data as Notification[], 
      count: count || 0,
      error: null 
    };
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
} 