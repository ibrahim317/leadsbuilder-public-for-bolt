import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbSuccessResponse } from '../types';

/**
 * Update an existing profile
 * @param profileId The ID of the profile to update
 * @param updates The fields to update
 * @returns Success status and error (if any)
 */
async function updateProfile(
  profileId: string, 
  updates: Partial<{
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    activity?: string;
  }>
): Promise<DbSuccessResponse> {
  try {
    const { error } = await supabaseClient
      .from('profiles')
      .update(updates)
      .eq('id', profileId);
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: handleSupabaseError(error) };
  }
}