import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Deletes a user and all associated data
 * @param userId The ID of the user to delete
 * @returns A promise that resolves to a DbResponse with null data
 */
export async function deleteUser(userId: string): Promise<DbResponse<null>> {
  try {
    // Start a transaction to delete all user data
    // This assumes cascading deletes are set up in the database
    // or that you're handling related data deletion in a specific order
    
    // Delete user roles first
    const { error: roleError } = await supabaseClient
      .from('user_roles')
      .delete()
      .eq('user_id', userId);
    
    if (roleError) {
      return { data: null, error: handleSupabaseError(roleError) };
    }
    
    // Delete user profile
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .delete()
      .eq('user_id', userId);
    
    if (profileError) {
      return { data: null, error: handleSupabaseError(profileError) };
    }
    
    // Finally delete the user from auth.users
    const { error: authError } = await supabaseClient.auth.admin.deleteUser(userId);
    
    if (authError) {
      return { data: null, error: handleSupabaseError(authError) };
    }
    
    // Delete the user from the users table
    const { error: userError } = await supabaseClient
      .from('users')
      .delete()
      .eq('id', userId);
    
    return { data: null, error: userError ? handleSupabaseError(userError) : null };
  } catch (error) {
    console.error('Delete user error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 