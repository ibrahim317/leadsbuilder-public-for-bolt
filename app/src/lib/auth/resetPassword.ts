import { supabaseClient } from '../supabaseClient';
import { handleSupabaseError } from '../error-handlers';

/**
 * Reset password for an email
 */
export async function resetPassword(email: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    return { error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Reset password error:', error);
    return { error: handleSupabaseError(error) };
  }
} 