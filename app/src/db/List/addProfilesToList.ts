import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbSuccessResponse } from '../types';

/**
 * Add profiles to a list
 * @param listId The ID of the list
 * @param profileIds Array of profile IDs to add to the list
 * @returns Success status and error (if any)
 */
async function addProfilesToList(
  listId: string, 
  profileIds: string[]
): Promise<DbSuccessResponse> {
  try {
    // Create records for the profile_lists junction table
    const profileListItems = profileIds.map(profileId => ({
      list_id: listId,
      profile_id: profileId
    }));
    
    const { error } = await supabaseClient
      .from('list_profiles')
      .insert(profileListItems);
      
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
      const newCount = (list.count || 0) + profileIds.length;
      await supabaseClient
        .from('lists')
        .update({ count: newCount })
        .eq('id', listId);
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Add profiles to list error:', error);
    return { success: false, error: handleSupabaseError(error) };
  }
}