import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbSuccessResponse } from '../types';

/**
 * Remove profiles from a list
 * @param listId The ID of the list
 * @param profileIds Array of profile IDs to remove from the list
 * @returns Success status and error (if any)
 */
async function removeProfilesFromList(
  listId: string, 
  profileIds: string[]
): Promise<DbSuccessResponse> {
  try {
    const { error } = await supabaseClient
      .from('list_profiles')
      .delete()
      .eq('list_id', listId)
      .in('profile_id', profileIds);
      
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    // Update the count in the lists table
    const { data: list } = await supabaseClient
      .from('lists')
      .select('count')
      .eq('id', listId)
      .single();
      
    if (list) {
      const newCount = Math.max(0, (list.count || 0) - profileIds.length);
      await supabaseClient
        .from('lists')
        .update({ count: newCount })
        .eq('id', listId);
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Remove profiles from list error:', error);
    return { success: false, error: handleSupabaseError(error) };
  }
}