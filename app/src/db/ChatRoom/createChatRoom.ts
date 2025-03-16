import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { ChatRoom, DbResponse } from '../types';

/**
 * Input for creating a new chat room
 */
interface CreateChatRoomInput {
  userId: string;
  title?: string;
  metadata?: Record<string, any>;
}

/**
 * Creates a new chat room
 * @param input The chat room data to create
 * @returns A promise that resolves to a DbResponse with the created ChatRoom
 */
export async function createChatRoom(input: CreateChatRoomInput): Promise<DbResponse<ChatRoom>> {
  try {
    // First check if there's already an active chat room for this user
    const { data: existingRoom } = await supabaseClient
      .from('chat_rooms')
      .select('*')
      .eq('user_id', input.userId)
      .eq('status', 'active')
      .limit(1)
      .single();
    
    // If there's an active room, return it
    if (existingRoom) {
      return { 
        data: existingRoom as ChatRoom, 
        error: null 
      };
    }
    
    // Otherwise, create a new room
    const newRoom = {
      user_id: input.userId,
      title: input.title || `Chat with ${input.userId}`,
      status: 'active',
      metadata: input.metadata || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabaseClient
      .from('chat_rooms')
      .insert(newRoom)
      .select()
      .single();
    
    return { 
      data: data as ChatRoom || null, 
      error: error ? handleSupabaseError(error) : null 
    };
  } catch (error) {
    console.error('Create chat room error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 