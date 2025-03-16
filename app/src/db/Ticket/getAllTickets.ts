import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbListResponse, Ticket } from '../types';

/**
 * Fetch all tickets in the system
 * @returns List of all tickets and error (if any)
 */
async function getAllTickets(): Promise<DbListResponse<Ticket>> {
  try {
    const { data: tickets, error } = await supabaseClient
      .from("tickets")
      .select(
        `
        *,
        messages:ticket_messages(*)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: handleSupabaseError(error) };
    }

    return { data: tickets || [], error: null };
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    return { data: [], error: handleSupabaseError(error) };
  }
} 