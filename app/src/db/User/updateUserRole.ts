import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Updates a user's role
 * @param userId The ID of the user to update
 * @param role The new role to assign to the user
 * @returns A promise that resolves to a DbResponse with null data
 */
export async function updateUserRole(
  userId: string,
  role: string
): Promise<DbResponse<null>> {
  try {
    // First check if the user has a role record
    const { data: existingRole, error: checkError } = await supabaseClient
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is fine
      return { data: null, error: handleSupabaseError(checkError) };
    }
    
    let updateError;
    
    if (existingRole) {
      // Update existing role
      const { error } = await supabaseClient
        .from('user_roles')
        .update({ role })
        .eq('user_id', userId);
      
      updateError = error;
    } else {
      // Insert new role
      const { error } = await supabaseClient
        .from('user_roles')
        .insert({ user_id: userId, role });
      
      updateError = error;
    }
    
    return { data: null, error: updateError ? handleSupabaseError(updateError) : null };
  } catch (error) {
    console.error('Update user role error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 