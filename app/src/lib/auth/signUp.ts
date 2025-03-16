import { supabaseClient } from '../supabaseClient';
import { handleSupabaseError } from '../error-handlers';
import type { User } from '@supabase/supabase-js';

/**
 * Sign up with email and password
 */
async function signUp(
  email: string, 
  password: string, 
  userData?: Partial<{ firstName: string; lastName: string; phone: string; }>
): Promise<{ user: User | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: userData,
        emailRedirectTo: `${window.location.origin}/auth/verify-email`,
      },
    });

    if (error) return { user: null, error: handleSupabaseError(error) };

    return { user: data.user, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, error: handleSupabaseError(error) };
  }
} 