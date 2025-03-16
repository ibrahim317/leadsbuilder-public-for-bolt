import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbListResponse, Profile } from '../types';
import type { ProfileFilter } from './types';

/**
 * Search profiles based on filter criteria
 * @param filter Filter criteria for searching profiles
 * @returns Matching profiles, total count, and error (if any)
 */
export async function searchProfiles(
  filter: ProfileFilter
): Promise<DbListResponse<Profile>> {
  try {
    const { keyword, country, lists, page = 1, perPage = 20 } = filter;
    
    // Start building the query
    let query = supabaseClient.from('profiles').select('*', { count: 'exact' });
    
    // Apply filters
    if (keyword) {
      query = query.or(`first_name.ilike.%${keyword}%,last_name.ilike.%${keyword}%,email.ilike.%${keyword}%`);
    }
    
    if (country) {
      query = query.eq('country', country);
    }
    
    if (lists && lists.length > 0) {
      // Use filter instead of in() with subquery since it's not well-typed
      // Here we're assuming we'd have a profile_lists junction table
      // Instead, we'll execute a separate query to get the profile IDs first
      const { data: profileListsData } = await supabaseClient
        .from('list_profiles')
        .select('profile_id')
        .in('list_id', lists);
      
      if (profileListsData && profileListsData.length > 0) {
        const profileIds = profileListsData.map(item => item.profile_id);
        query = query.in('id', profileIds);
      }
    }
    
    // Apply pagination
    const from = (page - 1) * perPage;
    query = query.range(from, from + perPage - 1);
    
    // Execute the query
    const { data, error, count } = await query;
    
    if (error) {
      return { data: [], count: 0, error: handleSupabaseError(error) };
    }
    
    return { 
      data: data as Profile[], 
      count: count || 0, 
      error: null 
    };
  } catch (error) {
    console.error('Search profiles error:', error);
    return { data: [], count: 0, error: handleSupabaseError(error) };
  }
}