import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Sends a password reset email to the specified email address
 * @param email The email address to send the reset link to
 * @param redirectTo The URL to redirect to after password reset
 * @returns A promise that resolves to a DbResponse with null data
 */
async function requestPasswordReset(
  email: string,
  redirectTo?: string
): Promise<DbResponse<null>> {
  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo,
    });
    
    return { data: null, error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Password reset request error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Updates the user's password after they've received a reset email
 * @param newPassword The new password to set
 * @returns A promise that resolves to a DbResponse with null data
 */
async function updatePasswordWithToken(
  newPassword: string
): Promise<DbResponse<null>> {
  try {
    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });
    
    return { data: null, error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Password update error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 