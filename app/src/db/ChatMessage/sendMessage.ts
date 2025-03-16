import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { ChatMessage, DbResponse } from '../types';

/**
 * Input for sending a new chat message
 */
interface SendMessageInput {
  roomId: string;
  userId: string;
  content: string;
  type?: 'text' | 'image' | 'file';
  metadata?: Record<string, any>;
}

/**
 * Sends a new message to a chat room
 * @param input The message data to send
 * @returns A promise that resolves to a DbResponse with the created ChatMessage
 */
export async function sendMessage(input: SendMessageInput): Promise<DbResponse<ChatMessage>> {
  try {
    // Create the new message
    const newMessage = {
      room_id: input.roomId,
      user_id: input.userId,
      content: input.content,
      type: input.type || 'text',
      metadata: input.metadata || {},
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabaseClient
      .from('chat_messages')
      .insert(newMessage)
      .select()
      .single();
    
    // Also update the chat room's updated_at timestamp
    if (!error) {
      await supabaseClient
        .from('chat_rooms')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', input.roomId);
    }
    
    return { 
      data: data as ChatMessage || null, 
      error: error ? handleSupabaseError(error) : null 
    };
  } catch (error) {
    console.error('Send message error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 