import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Interface for event data
 */
interface EventData {
  event_name: string;
  event_category?: string;
  element_id?: string;
  element_class?: string;
  page?: string;
  metadata?: Record<string, any>;
}

/**
 * Interface for tracked event response
 */
interface TrackedEvent extends EventData {
  id: string;
  user_id: string | null;
  created_at: string;
}

/**
 * Tracks a user event in the database
 * 
 * @param userId - The ID of the user associated with the event (optional)
 * @param event - The event data to track
 * @returns Promise with the tracked event or error
 */
async function trackEvent(
  userId: string | null,
  event: EventData
): Promise<DbResponse<TrackedEvent>> {
  try {
    const eventData = {
      user_id: userId,
      event_name: event.event_name,
      event_category: event.event_category || 'general',
      element_id: event.element_id || null,
      element_class: event.element_class || null,
      page: event.page || null,
      metadata: event.metadata || {}
    };

    const { data, error } = await supabaseClient
      .from('user_events')
      .insert([eventData])
      .select()
      .single();

    if (error) throw error;

    return {
      data: data as TrackedEvent,
      error: null
    };
  } catch (error) {
    console.error('Error tracking event:', error);
    return {
      data: null,
      error: handleSupabaseError(error)
    };
  }
} 