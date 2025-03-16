import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbListResponse, Profile } from '../types';

/**
 * Get profiles in a list with pagination
 * @param listId The ID of the list
 * @param page Page number (starting from 1)
 * @param perPage Number of items per page
 * @returns Profiles in the list, total count, and error (if any)
 */
export async function getProfilesInList(
  listId: string, 
  page: number = 1, 
  perPage: number = 20
): Promise<DbListResponse<Profile>> {
  try {
    // Calculate pagination
    const from = (page - 1) * perPage;
    
    // First, get the profile IDs from the junction table
    const { data: profileListsData, error: profileListsError } = await supabaseClient
      .from('list_profiles')
      .select('profile_id')
      .eq('list_id', listId);
    
    if (profileListsError) {
      return { data: [], error: handleSupabaseError(profileListsError) };
    }
    
    // If no profiles found in this list
    if (!profileListsData || profileListsData.length === 0) {
      return { data: [], count: 0, error: null };
    }
    
    // Extract profile IDs
    const profileIds = profileListsData.map(item => item.profile_id);
    
    // Get profiles with these IDs
    const { data, count, error } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact' })
      .in('id', profileIds)
      .range(from, from + perPage - 1);
      
    if (error) {
      return { data: [], error: handleSupabaseError(error) };
    }
    
    return { 
      data: data as Profile[], 
      count: count || 0, 
      error: null 
    };
  } catch (error) {
    console.error('Get profiles in list error:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
}