import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbResponse, TicketMessage } from '../types';

/**
 * Create a new message for a ticket
 * @param ticketId The ID of the ticket
 * @param message The message content
 * @param userId The ID of the user sending the message
 * @param isStaff Whether the message is from staff
 * @returns The created message and error (if any)
 */
export async function createTicketMessage(
  ticketId: string,
  message: string,
  userId: string,
  isStaff: boolean = false
): Promise<DbResponse<TicketMessage>> {
  try {
    const { data, error } = await supabaseClient
      .from("ticket_messages")
      .insert([
        {
          ticket_id: ticketId,
          message,
          user_id: userId,
          is_staff: isStaff,
        },
      ])
      .select()
      .single();

    if (error) {
      return { data: null, error: handleSupabaseError(error) };
    }

    return { data: data as TicketMessage, error: null };
  } catch (error) {
    console.error("Error creating ticket message:", error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 