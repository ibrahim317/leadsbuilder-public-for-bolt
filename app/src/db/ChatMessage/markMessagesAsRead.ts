import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbSuccessResponse } from '../types';

/**
 * Mark messages as read
 * @param roomId The ID of the chat room
 * @param userId The ID of the current user
 * @returns Success status and error (if any)
 */
async function markMessagesAsRead(
  roomId: string, 
  userId: string
): Promise<DbSuccessResponse> {
  try {
    const { error } = await supabaseClient
      .from('chat_messages')
      .update({ is_read: true })
      .eq('room_id', roomId)
      .neq('sender_id', userId);
      
    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Mark messages as read error:', error);
    return { success: false, error: handleSupabaseError(error) };
  }
} 