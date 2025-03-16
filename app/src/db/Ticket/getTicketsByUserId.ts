import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbListResponse, Ticket } from '../types';

/**
 * Fetch all tickets for a specific user
 * @param userId The ID of the user to fetch tickets for
 * @returns List of tickets and error (if any)
 */
export async function getTicketsByUserId(userId: string): Promise<DbListResponse<Ticket>> {
  try {
    const { data: tickets, error } = await supabaseClient
      .from("tickets")
      .select(
        `
        *,
        messages:ticket_messages(*)
      `
      )
      .eq('user_id', userId)
      .order("created_at", { ascending: false });

    if (error) {
      return { data: [], error: handleSupabaseError(error) };
    }

    return { data: tickets || [], error: null };
  } catch (error) {
    console.error("Error fetching tickets by user ID:", error);
    return { data: [], error: handleSupabaseError(error) };
  }
} 