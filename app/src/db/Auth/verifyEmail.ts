import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Resends a verification email to the user
 * 
 * @param email - The email address to send the verification to
 * @param redirectTo - The URL to redirect to after verification
 * @returns A promise that resolves to a DbResponse with null data
 */
export async function resendVerificationEmail(
  email: string, 
  redirectTo: string
): Promise<DbResponse<null>> {
  try {
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
      },
    });
    
    return { data: null, error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Resend verification email error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 