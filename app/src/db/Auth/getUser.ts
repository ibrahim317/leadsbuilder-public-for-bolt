import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { User } from '@supabase/supabase-js';
import { DbResponse } from '../types';

/**
 * Gets the current authenticated user
 * 
 * @returns A promise that resolves to a DbResponse with the user data
 */
export async function getUser(): Promise<DbResponse<User | null>> {
  try {
    const { data, error } = await supabaseClient.auth.getUser();
    return { 
      data: data?.user || null, 
      error: error ? handleSupabaseError(error) : null 
    };
  } catch (error) {
    console.error('Get user error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 