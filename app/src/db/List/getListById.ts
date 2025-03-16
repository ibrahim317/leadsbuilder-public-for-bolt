import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbResponse, List } from '../types';

/**
 * Get a specific list by ID
 * @param listId The ID of the list to retrieve
 * @returns The list and error (if any)
 */
export async function getListById(listId: string): Promise<DbResponse<List>> {
  try {
    const { data, error } = await supabaseClient
      .from('lists')
      .select('*')
      .eq('id', listId)
      .single();
      
    if (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
    
    return { data: data as List, error: null };
  } catch (error) {
    console.error('Get list by ID error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}