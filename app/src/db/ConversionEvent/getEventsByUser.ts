import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbListResponse, DbResponse } from '../types';
import { ConversionEventWithUser } from './getEvents';

/**
 * Fetches conversion events for a specific user
 * 
 * @param userId - ID of the user to fetch events for
 * @param limit - Maximum number of events to fetch (default: 100)
 * @param page - Page number for pagination (default: 1)
 * @param eventType - Optional filter by event type
 * @returns Promise with conversion events data or error
 */
async function getEventsByUser(
  userId: string,
  limit = 100,
  page = 1,
  eventType?: string
): Promise<DbListResponse<ConversionEventWithUser>> {
  try {
    const offset = (page - 1) * limit;
    
    let query = supabaseClient
      .from('conversion_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply event type filter if provided
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching events by user:', error);
      return { data: [], error: handleSupabaseError(error) };
    }
    
    // Use unknown as intermediate type to avoid type errors
    const safeData = (data || []) as unknown as ConversionEventWithUser[];
    
    return { 
      data: safeData, 
      count: count || undefined, 
      error: null 
    };
  } catch (error) {
    console.error('Error in getEventsByUser:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
}

/**
 * Gets event counts by type for a specific user
 * 
 * @param userId - ID of the user to fetch event counts for
 * @returns Promise with event counts by type or error
 */
async function getEventCountsByUserAndType(
  userId: string
): Promise<DbListResponse<{ event_type: string; count: number }>> {
  try {
    const { data, error } = await supabaseClient
      .from('conversion_events')
      .select('event_type')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching event counts by user and type:', error);
      return { data: [], error: handleSupabaseError(error) };
    }
    
    // Count events by type
    const counts: Record<string, number> = {};
    (data || []).forEach(event => {
      const type = event.event_type;
      counts[type] = (counts[type] || 0) + 1;
    });
    
    // Convert to array format
    const result = Object.entries(counts).map(([event_type, count]) => ({
      event_type,
      count
    }));
    
    return { data: result, error: null };
  } catch (error) {
    console.error('Error in getEventCountsByUserAndType:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
}

/**
 * Gets the user's first and last events
 * 
 * @param userId - ID of the user to fetch events for
 * @returns Promise with first and last events or error
 */
async function getUserFirstAndLastEvents(
  userId: string
): Promise<DbResponse<{ first: ConversionEventWithUser | null; last: ConversionEventWithUser | null }>> {
  try {
    // Get first event (oldest)
    const { data: firstEvent, error: firstError } = await supabaseClient
      .from('conversion_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();
    
    if (firstError && firstError.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
      console.error('Error fetching first event:', firstError);
      return { 
        data: null, 
        error: handleSupabaseError(firstError) 
      };
    }
    
    // Get last event (newest)
    const { data: lastEvent, error: lastError } = await supabaseClient
      .from('conversion_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (lastError && lastError.code !== 'PGRST116') {
      console.error('Error fetching last event:', lastError);
      return { 
        data: null, 
        error: handleSupabaseError(lastError) 
      };
    }
    
    return { 
      data: { 
        first: firstEvent as unknown as ConversionEventWithUser, 
        last: lastEvent as unknown as ConversionEventWithUser 
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Error in getUserFirstAndLastEvents:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 