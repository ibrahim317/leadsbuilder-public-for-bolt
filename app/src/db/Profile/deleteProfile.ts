import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbSuccessResponse } from '../types';

/**
 * Delete a profile
 * @param profileId The ID of the profile to delete
 * @returns Success status and error (if any)
 */
async function deleteProfile(profileId: string): Promise<DbSuccessResponse> {
  try {
    const { error } = await supabaseClient
      .from('profiles')
      .delete()
      .eq('id', profileId);
    
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Delete profile error:', error);
    return { success: false, error: handleSupabaseError(error) };
  }
}