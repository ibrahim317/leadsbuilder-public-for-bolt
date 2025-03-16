import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbSuccessResponse } from '../types';

/**
 * Signs out the current user
 * 
 * @returns A promise that resolves to a DbSuccessResponse
 */
export async function signOut(): Promise<DbSuccessResponse> {
  try {
    const { error } = await supabaseClient.auth.signOut();
    
    return {
      success: !error,
      error: error ? handleSupabaseError(error) : null
    };
  } catch (error) {
    console.error('Sign out error:', error);
    return { 
      success: false, 
      error: handleSupabaseError(error) 
    };
  }
} 