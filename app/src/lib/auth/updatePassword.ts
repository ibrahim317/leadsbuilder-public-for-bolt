import { supabaseClient } from '../supabaseClient';
import { handleSupabaseError } from '../error-handlers';

/**
 * Update user password
 */
async function updatePassword(newPassword: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabaseClient.auth.updateUser({
      password: newPassword
    });
    
    return { error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Update password error:', error);
    return { error: handleSupabaseError(error) };
  }
} 