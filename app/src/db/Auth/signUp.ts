import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';
import type { AuthResponse } from '@supabase/supabase-js';

/**
 * Signs up a new user with email and password
 * 
 * @param email - The user's email
 * @param password - The user's password
 * @param options - Optional parameters for sign up
 * @returns A promise that resolves to a DbResponse with the auth response
 */
export async function signUp(
  email: string,
  password: string,
  options?: {
    emailRedirectTo?: string;
    data?: Record<string, any>;
  }
): Promise<DbResponse<AuthResponse['data']>> {
  try {
    const response = await supabaseClient.auth.signUp({
      email,
      password,
      options
    });

    return {
      data: response.data,
      error: response.error ? handleSupabaseError(response.error) : null
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 