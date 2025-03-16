import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbResponse } from '../types';

/**
 * Get unread message count for a user
 * @param userId The ID of the user
 * @returns Count of unread messages and error (if any)
 */
async function getUnreadMessageCount(userId: string): Promise<DbResponse<number>> {
  try {
    // First, get the room IDs for this user
    const { data: roomsData, error: roomsError } = await supabaseClient
      .from('chat_rooms')
      .select('id')
      .eq('user_id', userId);
      
    if (roomsError) {
      return { data: 0, error: handleSupabaseError(roomsError) };
    }
    
    // If no rooms found
    if (!roomsData || roomsData.length === 0) {
      return { data: 0, error: null };
    }
    
    // Extract room IDs
    const roomIds = roomsData.map(room => room.id);
    
    // Get unread message count
    const { count, error } = await supabaseClient
      .from('chat_messages')
      .select('*', { count: 'exact' })
      .eq('is_read', false)
      .neq('sender_id', userId)
      .in('room_id', roomIds);
      
    if (error) {
      return { data: 0, error: handleSupabaseError(error) };
    }
    
    return { data: count || 0, error: null };
  } catch (error) {
    console.error('Get unread message count error:', error);
    return { data: 0, error: handleSupabaseError(error) };
  }
} 