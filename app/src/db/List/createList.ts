import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbResponse, List } from '../types';

/**
 * Create a new list
 * @param list The list data to create
 * @returns The created list and error (if any)
 */
export async function createList(
  list: { name: string; description?: string; user_id: string }
): Promise<DbResponse<List>> {
  try {
    const { data, error } = await supabaseClient
      .from('lists')
      .insert([{ ...list, count: 0 }])
      .select()
      .single();
      
    if (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
    
    return { data: data as List, error: null };
  } catch (error) {
    console.error('Create list error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}