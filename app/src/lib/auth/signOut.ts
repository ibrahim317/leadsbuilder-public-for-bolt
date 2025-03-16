import { supabaseClient } from '../supabaseClient';
import { handleSupabaseError } from '../error-handlers';
import { ADMIN_STATUS_KEY } from './types';

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabaseClient.auth.signOut();
    
    if (!error) {
      sessionStorage.removeItem(ADMIN_STATUS_KEY);
      sessionStorage.removeItem('sb-leadbuilder-session');
    }
    
    return { error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error: handleSupabaseError(error) };
  }
} 