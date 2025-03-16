import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbResponse, Ticket } from '../types';

/**
 * Create a new ticket
 * @param subject The subject of the ticket
 * @param category The category of the ticket
 * @param priority The priority of the ticket
 * @param userId The ID of the user creating the ticket
 * @returns The created ticket and error (if any)
 */
export async function createTicket(
  subject: string,
  category: string,
  priority: string,
  userId: string
): Promise<DbResponse<Ticket>> {
  try {
    const { data: ticket, error } = await supabaseClient
      .from("tickets")
      .insert([
        {
          subject,
          category,
          priority,
          user_id: userId,
          status: 'open', // Default status for new tickets
        },
      ])
      .select()
      .single();

    if (error) {
      return { data: null, error: handleSupabaseError(error) };
    }

    return { data: ticket as Ticket, error: null };
  } catch (error) {
    console.error("Error creating ticket:", error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 