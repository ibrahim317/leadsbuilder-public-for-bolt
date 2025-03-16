import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbListResponse } from '../types';

interface CRMActivity {
  id: string;
  user_id: string;
  profile_id: string;
  activity_type: 'message' | 'call' | 'meeting' | 'note' | 'email' | string;
  description: string;
  created_at: string;
  metadata?: Record<string, any>;
  profile?: {
    id: string;
    full_name?: string;
    company?: string;
    position?: string;
  };
}

/**
 * Fetches CRM activities for a user
 * 
 * @param userId - The ID of the user to fetch activities for
 * @param limit - Maximum number of activities to fetch (default: 20)
 * @param activityType - Optional filter by activity type
 * @param profileId - Optional filter by profile ID
 * @returns Promise with activities data or error
 */
async function getActivities(
  userId: string,
  limit = 20,
  activityType?: string,
  profileId?: string
): Promise<DbListResponse<CRMActivity>> {
  try {
    let query = supabaseClient
      .from('crm_activities')
      .select(`
        *,
        profile:profile_id (
          id,
          full_name,
          company,
          position
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    // Apply filters if provided
    if (activityType) {
      query = query.eq('activity_type', activityType);
    }
    
    if (profileId) {
      query = query.eq('profile_id', profileId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching CRM activities:', error);
      return { data: [], error: handleSupabaseError(error) };
    }
    
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error in getActivities:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
}

/**
 * Logs a new CRM activity
 * 
 * @param userId - ID of the user performing the activity
 * @param profileId - ID of the profile the activity is related to
 * @param activityType - Type of activity
 * @param description - Description of the activity
 * @param metadata - Optional additional data
 * @returns Promise with success status or error
 */
async function logActivity(
  userId: string,
  profileId: string,
  activityType: string,
  description: string,
  metadata?: Record<string, any>
) {
  try {
    const { error } = await supabaseClient
      .from('crm_activities')
      .insert([
        {
          user_id: userId,
          profile_id: profileId,
          activity_type: activityType,
          description,
          metadata
        }
      ]);
    
    if (error) {
      console.error('Error logging CRM activity:', error);
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in logActivity:', error);
    return { success: false, error: handleSupabaseError(error) };
  }
} 