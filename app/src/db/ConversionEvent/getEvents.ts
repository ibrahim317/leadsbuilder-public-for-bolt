import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbListResponse } from '../types';

// Define the ConversionEvent type locally to avoid import issues
export interface ConversionEventWithUser {
  id: string;
  user_id: string;
  event_type: string;
  source: string;
  created_at: string;
  metadata: Record<string, any>;
  user?: {
    email: string;
    full_name: string;
  };
}

/**
 * Fetches conversion events from the database
 * 
 * @param limit - Maximum number of events to fetch (default: 100)
 * @param page - Page number for pagination (default: 1)
 * @param eventType - Optional filter by event type
 * @param source - Optional filter by source
 * @param includeUser - Whether to include user details (default: false)
 * @returns Promise with conversion events data or error
 */
async function getEvents(
  limit = 100,
  page = 1,
  eventType?: string,
  source?: string,
  includeUser = false
): Promise<DbListResponse<ConversionEventWithUser>> {
  try {
    const offset = (page - 1) * limit;
    
    let query = supabaseClient
      .from('conversion_events')
      .select(includeUser 
        ? `*, user:users(email, full_name)` 
        : '*'
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply filters if provided
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    if (source) {
      query = query.eq('source', source);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching conversion events:', error);
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
    console.error('Error in getEvents:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
}

/**
 * Gets the count of conversion events by type
 * 
 * @returns Promise with event counts by type or error
 */
async function getEventCountsByType(): Promise<DbListResponse<{ event_type: string; count: number }>> {
  try {
    // Execute a SQL query to get counts by event type
    const { data, error } = await supabaseClient
      .from('conversion_events')
      .select('event_type')
      .then(({ data, error }) => {
        if (error) throw error;
        
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
      });
    
    if (error) {
      console.error('Error fetching event counts:', error);
      return { data: [], error: handleSupabaseError(error) };
    }
    
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error in getEventCountsByType:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
} 