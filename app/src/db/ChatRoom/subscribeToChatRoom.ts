import { supabaseClient } from '../../lib/supabaseClient';
import { ChatRoom, ChatMessage } from '../types';

/**
 * Subscribes to real-time updates for a chat room
 * @param roomId The ID of the chat room to subscribe to
 * @param onRoomUpdate Callback function for room updates
 * @param onNewMessage Callback function for new messages
 * @returns A function to unsubscribe from the real-time updates
 */
export function subscribeToChatRoom(
  roomId: string,
  onRoomUpdate?: (room: ChatRoom) => void,
  onNewMessage?: (message: ChatMessage) => void
): () => void {
  // Subscribe to room updates
  const roomSubscription = supabaseClient
    .channel(`room:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'chat_rooms',
        filter: `id=eq.${roomId}`
      },
      (payload) => {
        if (onRoomUpdate) {
          onRoomUpdate(payload.new as ChatRoom);
        }
      }
    )
    .subscribe();

  // Subscribe to new messages
  const messageSubscription = supabaseClient
    .channel(`room-messages:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        if (onNewMessage) {
          onNewMessage(payload.new as ChatMessage);
        }
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabaseClient.removeChannel(roomSubscription);
    supabaseClient.removeChannel(messageSubscription);
  };
} 