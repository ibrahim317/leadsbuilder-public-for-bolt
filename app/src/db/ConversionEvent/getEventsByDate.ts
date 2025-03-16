import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbListResponse } from '../types';
import { ConversionEventWithUser } from './getEvents';

/**
 * Fetches conversion events within a date range
 * 
 * @param startDate - Start date for filtering events
 * @param endDate - End date for filtering events
 * @param limit - Maximum number of events to fetch (default: 100)
 * @param page - Page number for pagination (default: 1)
 * @param eventType - Optional filter by event type
 * @param includeUser - Whether to include user details (default: false)
 * @returns Promise with conversion events data or error
 */
async function getEventsByDate(
  startDate: Date,
  endDate: Date,
  limit = 100,
  page = 1,
  eventType?: string,
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
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply event type filter if provided
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching events by date:', error);
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
    console.error('Error in getEventsByDate:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
}

/**
 * Gets event counts grouped by date
 * 
 * @param startDate - Start date for filtering events
 * @param endDate - End date for filtering events
 * @param interval - Interval for grouping ('day', 'week', 'month')
 * @param eventType - Optional filter by event type
 * @returns Promise with event counts by date or error
 */
async function getEventCountsByDate(
  startDate: Date,
  endDate: Date,
  interval: 'day' | 'week' | 'month' = 'day',
  eventType?: string
): Promise<DbListResponse<{ date: string; count: number }>> {
  try {
    // Fetch events within date range
    let query = supabaseClient
      .from('conversion_events')
      .select('created_at')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());
    
    // Apply event type filter if provided
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching event counts by date:', error);
      return { data: [], error: handleSupabaseError(error) };
    }
    
    // Group events by date according to interval
    const counts: Record<string, number> = {};
    
    (data || []).forEach(event => {
      const date = new Date(event.created_at);
      let dateKey: string;
      
      switch (interval) {
        case 'day':
          dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
          break;
        case 'week':
          // Get the first day of the week (Sunday)
          const day = date.getDay();
          const diff = date.getDate() - day;
          const weekStart = new Date(date);
          weekStart.setDate(diff);
          dateKey = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        default:
          dateKey = date.toISOString().split('T')[0];
      }
      
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });
    
    // Convert to array format and sort by date
    const result = Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return { data: result, error: null };
  } catch (error) {
    console.error('Error in getEventCountsByDate:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
} 