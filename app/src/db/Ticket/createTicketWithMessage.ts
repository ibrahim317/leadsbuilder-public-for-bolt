import { handleSupabaseError } from '../../lib/error-handlers';
import type { DbResponse, Ticket } from '../types';
import { createTicket } from './createTicket';
import { createTicketMessage } from '../TicketMessage/createTicketMessage';

/**
 * Create a new ticket with an initial message
 * @param subject The subject of the ticket
 * @param category The category of the ticket
 * @param priority The priority of the ticket
 * @param message The content of the first message
 * @param userId The ID of the user creating the ticket
 * @returns The created ticket and error (if any)
 */
export async function createTicketWithMessage(
  subject: string,
  category: string,
  priority: string,
  message: string,
  userId: string
): Promise<DbResponse<Ticket>> {
  try {
    // Create the ticket first
    const { data: ticket, error: ticketError } = await createTicket(
      subject,
      category,
      priority,
      userId
    );

    if (ticketError) {
      return { data: null, error: ticketError };
    }

    if (!ticket) {
      return { data: null, error: new Error('Failed to create ticket: Unknown error') };
    }

    // Then add the first message
    const { error: messageError } = await createTicketMessage(
      ticket.id,
      message,
      userId,
      false // Not from staff
    );

    if (messageError) {
      // Message creation failed, but ticket was created
      console.error('Failed to add initial message to ticket:', messageError);
      // We could delete the ticket here to maintain consistency, but keeping it might be better
      return { data: ticket, error: messageError };
    }

    // If we get here, both the ticket and message were created successfully
    return { data: ticket, error: null };
  } catch (error) {
    console.error("Error creating ticket with message:", error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 