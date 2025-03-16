import { supabaseClient } from '../supabaseClient';
import { handleSupabaseError } from '../error-handlers';

/**
 * Send verification email
 */
async function sendVerificationEmail(email: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify-email`,
      },
    });
    
    return { error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Send verification email error:', error);
    return { error: handleSupabaseError(error) };
  }
} 