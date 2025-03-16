import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { User } from '@supabase/supabase-js';

/**
 * Get current user
 */
async function getUser(): Promise<{ user: User | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseClient.auth.getUser();
    return { user: data.user, error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Get user error:', error);
    return { user: null, error: handleSupabaseError(error) };
  }
} 