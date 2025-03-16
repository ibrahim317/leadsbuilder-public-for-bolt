import { supabaseClient } from '../supabaseClient';
import { handleSupabaseError } from '../error-handlers';
import type { User } from '@supabase/supabase-js';
import { checkAdminRole } from './checkAdminRole';
import { ADMIN_STATUS_KEY } from './types';

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { user: null, error: handleSupabaseError(error) };

    if (data.user && data.session) {
      sessionStorage.setItem('sb-leadbuilder-session', JSON.stringify(data.session));
      
      // Check if user is admin
      const isAdmin = await checkAdminRole(data.user.id);
      sessionStorage.setItem(ADMIN_STATUS_KEY, String(isAdmin));
    }

    return { user: data.user, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, error: handleSupabaseError(error) };
  }
} 