import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { ChatRoom, DbResponse } from '../types';

/**
 * Gets the active chat room for a user
 * @param userId The ID of the user to get the active chat room for
 * @returns A promise that resolves to a DbResponse with the active ChatRoom
 */
export async function getActiveRoom(userId: string): Promise<DbResponse<ChatRoom>> {
  try {
    const { data, error } = await supabaseClient
      .from('chat_rooms')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    return { 
      data: data as ChatRoom || null, 
      error: error ? handleSupabaseError(error) : null 
    };
  } catch (error) {
    console.error('Get active chat room error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 