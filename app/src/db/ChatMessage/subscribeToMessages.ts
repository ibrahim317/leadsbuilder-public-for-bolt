import { supabaseClient } from '../../lib/supabaseClient';
import type { ChatMessage } from '../types';

/**
 * Create real-time subscription for new messages
 * @param roomId The ID of the chat room to subscribe to
 * @param callback Function to call when a new message is received
 * @returns Object with unsubscribe method
 */
function subscribeToMessages(
  roomId: string, 
  callback: (message: ChatMessage) => void
): { unsubscribe: () => void } {
  const subscription = supabaseClient
    .channel(`room:${roomId}`)
    .on('postgres_changes', { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'chat_messages',
      filter: `room_id=eq.${roomId}`
    }, (payload) => {
      callback(payload.new as ChatMessage);
    })
    .subscribe();
    
  return {
    unsubscribe: () => {
      subscription.unsubscribe();
    }
  };
} 