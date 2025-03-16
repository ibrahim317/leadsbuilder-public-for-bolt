import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { ChatMessage, DbListResponse } from '../types';

/**
 * Gets messages for a specific chat room
 * @param roomId The ID of the chat room to get messages for
 * @param limit Maximum number of messages to fetch (default: 50)
 * @param page Page number for pagination (default: 1)
 * @returns A promise that resolves to a DbListResponse with an array of ChatMessage objects
 */
export async function getRoomMessages(
  roomId: string,
  limit = 50,
  page = 1
): Promise<DbListResponse<ChatMessage>> {
  try {
    // Calculate offset based on page and limit
    const offset = (page - 1) * limit;
    
    const { data, error, count } = await supabaseClient
      .from('chat_messages')
      .select('*', { count: 'exact' })
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    return { 
      data: data as ChatMessage[] || [], 
      count: count || 0,
      error: error ? handleSupabaseError(error) : null 
    };
  } catch (error) {
    console.error('Get room messages error:', error);
    return { data: [], count: 0, error: handleSupabaseError(error) };
  }
} 