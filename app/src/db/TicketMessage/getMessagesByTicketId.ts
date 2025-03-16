import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbListResponse, TicketMessage } from '../types';

/**
 * Get all messages for a specific ticket
 * @param ticketId The ID of the ticket
 * @returns List of messages and error (if any)
 */
async function getMessagesByTicketId(ticketId: string): Promise<DbListResponse<TicketMessage>> {
  try {
    const { data, error } = await supabaseClient
      .from("ticket_messages")
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (error) {
      return { data: [], error: handleSupabaseError(error) };
    }

    return { data: data as TicketMessage[], error: null };
  } catch (error) {
    console.error("Error fetching ticket messages:", error);
    return { data: [], error: handleSupabaseError(error) };
  }
} 