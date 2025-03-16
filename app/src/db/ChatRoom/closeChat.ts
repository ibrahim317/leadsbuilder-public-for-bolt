import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Closes a chat room by setting its status to 'closed'
 * @param roomId The ID of the chat room to close
 * @returns A promise that resolves to a DbResponse with null data
 */
export async function closeChat(roomId: string): Promise<DbResponse<null>> {
  try {
    const { error } = await supabaseClient
      .from('chat_rooms')
      .update({ 
        status: 'closed',
        updated_at: new Date().toISOString()
      })
      .eq('id', roomId);
    
    return { data: null, error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Close chat room error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 