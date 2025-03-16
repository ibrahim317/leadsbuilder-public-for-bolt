import { supabaseClient } from '../supabaseClient';
import type { Session } from '@supabase/supabase-js';

/**
 * Refresh session
 */
async function refreshSession(): Promise<{ session: Session | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseClient.auth.refreshSession();
    return { session: data.session, error };
  } catch (error) {
    console.error('Refresh session error:', error);
    return { session: null, error: error as Error };
  }
} 