import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbResponse, Ticket } from '../types';

/**
 * Fetch a single ticket by its ID
 * @param ticketId The ID of the ticket to fetch
 * @returns The ticket object and error (if any)
 */
export async function getTicketById(ticketId: string): Promise<DbResponse<Ticket>> {
  try {
    const { data: ticket, error } = await supabaseClient
      .from("tickets")
      .select(
        `
        *,
        messages:ticket_messages(*)
      `
      )
      .eq('id', ticketId)
      .single();

    if (error) {
      return { data: null, error: handleSupabaseError(error) };
    }

    return { data: ticket as Ticket, error: null };
  } catch (error) {
    console.error("Error fetching ticket by ID:", error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 