import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbSuccessResponse } from '../types';

/**
 * Delete a list
 * @param listId The ID of the list to delete
 * @returns Success status and error (if any)
 */
export async function deleteList(listId: string): Promise<DbSuccessResponse> {
  try {
    const { error } = await supabaseClient
      .from('lists')
      .delete()
      .eq('id', listId);
      
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Delete list error:', error);
    return { success: false, error: handleSupabaseError(error) };
  }
}