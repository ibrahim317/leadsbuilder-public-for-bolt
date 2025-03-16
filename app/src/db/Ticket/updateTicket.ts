import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbSuccessResponse, Ticket } from '../types';

/**
 * Update an existing ticket
 * @param ticketId The ID of the ticket to update
 * @param updates The fields to update
 * @returns Success status and error (if any)
 */
async function updateTicket(
  ticketId: string,
  updates: Partial<Ticket>
): Promise<DbSuccessResponse> {
  try {
    const { error } = await supabaseClient
      .from("tickets")
      .update(updates)
      .eq('id', ticketId);

    if (error) {
      return { success: false, error: handleSupabaseError(error) };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error updating ticket:", error);
    return { success: false, error: handleSupabaseError(error) };
  }
} 