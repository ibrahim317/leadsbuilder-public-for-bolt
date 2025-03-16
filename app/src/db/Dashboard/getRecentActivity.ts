import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbListResponse } from '../types';

interface ActivityItem {
  id: string;
  user_id: string;
  activity_type: string;
  description: string;
  created_at: string;
  metadata?: Record<string, any>;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

/**
 * Fetches recent activity from the database
 * 
 * @param limit - Maximum number of activities to fetch (default: 10)
 * @param userId - Optional filter by user ID
 * @param activityType - Optional filter by activity type
 * @returns Promise with activity data or error
 */
async function getRecentActivity(
  limit = 10,
  userId?: string,
  activityType?: string
): Promise<DbListResponse<ActivityItem>> {
  try {
    let query = supabaseClient
      .from('user_activities')
      .select(`
        *,
        user:user_id (
          id,
          email,
          full_name
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    // Apply filters if provided
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    if (activityType) {
      query = query.eq('activity_type', activityType);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching recent activity:', error);
      return { data: [], error: handleSupabaseError(error) };
    }
    
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error in getRecentActivity:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
}

/**
 * Logs a new activity
 * 
 * @param userId - ID of the user performing the activity
 * @param activityType - Type of activity
 * @param description - Description of the activity
 * @param metadata - Optional additional data
 * @returns Promise with success status or error
 */
async function logActivity(
  userId: string,
  activityType: string,
  description: string,
  metadata?: Record<string, any>
) {
  try {
    const { error } = await supabaseClient
      .from('user_activities')
      .insert([
        {
          user_id: userId,
          activity_type: activityType,
          description,
          metadata
        }
      ]);
    
    if (error) {
      console.error('Error logging activity:', error);
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in logActivity:', error);
    return { success: false, error: handleSupabaseError(error) };
  }
} 