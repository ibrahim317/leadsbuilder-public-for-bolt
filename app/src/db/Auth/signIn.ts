import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';
import type { AuthResponse } from '@supabase/supabase-js';

/**
 * Signs in a user with email and password
 * 
 * @param email - The user's email
 * @param password - The user's password
 * @returns A promise that resolves to a DbResponse with the auth response
 */
async function signInWithPassword(
  email: string,
  password: string
): Promise<DbResponse<AuthResponse['data']>> {
  try {
    const response = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    return {
      data: response.data,
      error: response.error ? handleSupabaseError(response.error) : null
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Signs in a user with OTP (One-Time Password)
 * 
 * @param email - The user's email
 * @param options - Optional parameters for OTP sign in
 * @returns A promise that resolves to a DbResponse with the auth response
 */
async function signInWithOtp(
  email: string,
  options?: { 
    emailRedirectTo?: string;
  }
): Promise<DbResponse<AuthResponse['data']>> {
  try {
    const response = await supabaseClient.auth.signInWithOtp({
      email,
      options
    });

    return {
      data: response.data,
      error: response.error ? handleSupabaseError(response.error) : null
    };
  } catch (error) {
    console.error('OTP sign in error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 