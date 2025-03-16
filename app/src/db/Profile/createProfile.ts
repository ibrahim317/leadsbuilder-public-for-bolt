import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse, Profile } from '../types';

/**
 * Create a new profile
 * @param profile The profile data to create
 * @returns The created profile and error (if any)
 */
async function createProfile(
  profile: { 
    user_id: string; 
    first_name: string; 
    last_name: string; 
    email: string; 
    phone?: string; 
    activity?: string; 
  }
): Promise<DbResponse<Profile>> {
  try {
    const { data, error } = await supabaseClient
      .from('profiles')
      .insert([profile])
      .select()
      .single();
    
    if (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
    
    return { data: data as Profile, error: null };
  } catch (error) {
    console.error('Create profile error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}