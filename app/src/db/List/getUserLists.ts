import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbListResponse, List } from '../types';

/**
 * Get all lists for a user
 * @param userId The ID of the user
 * @returns Lists owned by the user and error (if any)
 */
export async function getUserLists(userId: string): Promise<DbListResponse<List>> {
  try {
    const { data, error } = await supabaseClient
      .from('lists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      return { data: [], error: handleSupabaseError(error) };
    }
    
    return { data: data as List[], error: null };
  } catch (error) {
    console.error('Get user lists error:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
}