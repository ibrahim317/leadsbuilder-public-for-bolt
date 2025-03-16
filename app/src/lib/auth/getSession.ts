import { supabaseClient } from '../supabaseClient';
import type { Session } from '@supabase/supabase-js';

/**
 * Get current session
 */
export async function getSession(): Promise<{ session: Session | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseClient.auth.getSession();
    return { session: data.session, error };
  } catch (error) {
    console.error('Get session error:', error);
    return { session: null, error: error as Error };
  }
} 