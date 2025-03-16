import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Updates the password for the currently authenticated user
 * @param currentPassword The user's current password for verification
 * @param newPassword The new password to set
 * @returns A promise that resolves to a DbResponse with null data
 */
async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<DbResponse<null>> {
  try {
    // First verify the current password by attempting to sign in
    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: '', // We'll need to get the email from the session or pass it as a parameter
      password: currentPassword,
    });
    
    if (signInError) {
      // Create a custom error for incorrect password
      const passwordError = new Error('Current password is incorrect');
      return { 
        data: null, 
        error: passwordError
      };
    }
    
    // If verification succeeds, update the password
    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });
    
    return { data: null, error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Password update error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 