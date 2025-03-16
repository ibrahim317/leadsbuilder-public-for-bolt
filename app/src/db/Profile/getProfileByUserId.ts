import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse, Profile } from '../types';

/**
 * Get user profile by user ID
 * @param userId The ID of the user
 * @returns The user's profile and error (if any)
 */
async function getProfileByUserId(userId: string): Promise<DbResponse<Profile>> {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      return { data: null, error: handleSupabaseError(error) };
    }

    return { data: data as Profile, error: null };
  } catch (error) {
    console.error('Get profile error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}