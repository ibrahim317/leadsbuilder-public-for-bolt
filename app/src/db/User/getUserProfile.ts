import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { User, DbResponse } from '../types';

/**
 * Gets a user's profile by ID
 * @param userId The ID of the user to get
 * @returns A promise that resolves to a DbResponse with the User object
 */
async function getUserProfile(userId: string): Promise<DbResponse<User>> {
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*, user_roles(*), profiles(*)')
      .eq('id', userId)
      .single();
    
    return { 
      data: data as User || null, 
      error: error ? handleSupabaseError(error) : null 
    };
  } catch (error) {
    console.error('Get user profile error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Gets the current user's profile
 * @returns A promise that resolves to a DbResponse with the User object
 */
async function getCurrentUserProfile(): Promise<DbResponse<User>> {
  try {
    const { data: authData, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError) {
      return { data: null, error: handleSupabaseError(authError) };
    }
    
    if (!authData.user) {
      return { data: null, error: new Error('No authenticated user found') };
    }
    
    return getUserProfile(authData.user.id);
  } catch (error) {
    console.error('Get current user profile error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 