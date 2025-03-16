import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbSuccessResponse } from '../types';

/**
 * Delete a ticket by its ID
 * @param ticketId The ID of the ticket to delete
 * @returns Success status and error (if any)
 */
async function deleteTicket(ticketId: string): Promise<DbSuccessResponse> {
  try {
    const { error } = await supabaseClient
      .from("tickets")
      .delete()
      .eq('id', ticketId);

    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return { success: false, error: handleSupabaseError(error) };
  }
} 