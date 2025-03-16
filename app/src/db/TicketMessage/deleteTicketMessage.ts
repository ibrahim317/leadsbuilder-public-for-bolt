import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbSuccessResponse } from '../types';

/**
 * Delete a ticket message
 * @param messageId The ID of the message to delete
 * @returns Success status and error (if any)
 */
async function deleteTicketMessage(messageId: string): Promise<DbSuccessResponse> {
  try {
    const { error } = await supabaseClient
      .from("ticket_messages")
      .delete()
      .eq('id', messageId);

    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting ticket message:", error);
    return { success: false, error: handleSupabaseError(error) };
  }
} 