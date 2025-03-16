import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbSuccessResponse } from '../types';

/**
 * Update a list
 * @param listId The ID of the list to update
 * @param updates The fields to update
 * @returns Success status and error (if any)
 */
export async function updateList(
  listId: string, 
  updates: { name?: string; description?: string }
): Promise<DbSuccessResponse> {
  try {
    const { error } = await supabaseClient
      .from('lists')
      .update(updates)
      .eq('id', listId);
      
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Update list error:', error);
    return { success: false, error: handleSupabaseError(error) };
  }
}
