import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbListResponse } from '../types';
import { ConversionEventWithUser } from './getEvents';

/**
 * Fetches recent conversion events with user details
 * 
 * @param limit - Maximum number of events to fetch (default: 10)
 * @param eventType - Optional filter by event type
 * @returns Promise with recent conversion events or error
 */
export async function getRecentConversions(
  limit = 10,
  eventType?: string
): Promise<DbListResponse<ConversionEventWithUser>> {
  try {
    let query = supabaseClient
      .from('conversion_events')
      .select(`
        id,
        user_id,
        event_type,
        source,
        created_at,
        metadata,
        user:users(email, full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    // Apply event type filter if provided
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching recent conversions:', error);
      return { data: [], error: handleSupabaseError(error) };
    }
    
    // Use unknown as intermediate type to avoid type errors
    const safeData = (data || []) as unknown as ConversionEventWithUser[];
    
    return { data: safeData, error: null };
  } catch (error) {
    console.error('Error in getRecentConversions:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
}

/**
 * Gets conversion events grouped by event type for a recent time period
 * 
 * @param days - Number of days to look back (default: 30)
 * @returns Promise with conversion counts by event type or error
 */
async function getRecentConversionsByType(
  days = 30
): Promise<DbListResponse<{ event_type: string; count: number }>> {
  try {
    // Calculate start date
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const { data, error } = await supabaseClient
      .from('conversion_events')
      .select('event_type')
      .gte('created_at', startDate.toISOString());
    
    if (error) {
      console.error('Error fetching recent conversions by type:', error);
      return { data: [], error: handleSupabaseError(error) };
    }
    
    // Count events by type
    const counts: Record<string, number> = {};
    (data || []).forEach(event => {
      const type = event.event_type;
      counts[type] = (counts[type] || 0) + 1;
    });
    
    // Convert to array format
    const result = Object.entries(counts)
      .map(([event_type, count]) => ({ event_type, count }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
    
    return { data: result, error: null };
  } catch (error) {
    console.error('Error in getRecentConversionsByType:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
} 