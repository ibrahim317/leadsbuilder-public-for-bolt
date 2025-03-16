import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse, ConversionEvent } from '../types';

type ConversionStats = {
  total_conversions: number;
  conversion_rate: number;
  conversions_by_date: Array<{
    date: string;
    count: number;
  }>;
  conversions_by_type: Array<{
    type: string;
    count: number;
  }>;
  average_conversion_value: number;
};

type ConversionStatsParams = {
  startDate?: string;
  endDate?: string;
  eventType?: string;
};

/**
 * Fetches conversion statistics from the database
 * 
 * @param params - Optional parameters for filtering conversions
 * @returns Promise with conversion statistics or error
 */
export async function getConversionStats(
  params?: ConversionStatsParams
): Promise<DbResponse<ConversionStats>> {
  try {
    const { startDate, endDate, eventType } = params || {};
    
    // Base query for conversion events
    let query = supabaseClient
      .from('conversion_events')
      .select('*');
    
    // Apply filters if provided
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate);
    }
    
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    // Get conversion events
    const { data: events, error } = await query;
    
    if (error) {
      return { data: null, error: handleSupabaseError(error) };
    }

    // Get total users for conversion rate calculation
    const { count: totalUsers, error: usersError } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (usersError) {
      return { data: null, error: handleSupabaseError(usersError) };
    }

    // Calculate total conversions
    const totalConversions = events?.length || 0;
    
    // Calculate conversion rate
    const conversionRate = totalUsers ? totalConversions / totalUsers : 0;
    
    // Group conversions by date
    const conversionsByDate = events?.reduce((acc, event: ConversionEvent) => {
      // Handle null created_at safely
      const date = event.created_at ? new Date(event.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      const existingEntry = acc.find((item: { date: string; count: number }) => item.date === date);
      
      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        acc.push({ date, count: 1 });
      }
      
      return acc;
    }, [] as Array<{ date: string; count: number }>) || [];
    
    // Sort by date
    conversionsByDate.sort((a: { date: string }, b: { date: string }) => a.date.localeCompare(b.date));
    
    // Group conversions by type
    const conversionsByType = events?.reduce((acc, event: ConversionEvent) => {
      const type = event.event_type;
      const existingEntry = acc.find((item: { type: string; count: number }) => item.type === type);
      
      if (existingEntry) {
        existingEntry.count += 1;
      } else {
        acc.push({ type, count: 1 });
      }
      
      return acc;
    }, [] as Array<{ type: string; count: number }>) || [];
    
    // Sort by count (descending)
    conversionsByType.sort((a: { count: number }, b: { count: number }) => b.count - a.count);
    
    // Calculate average conversion value
    const totalValue = events?.reduce((sum, event: ConversionEvent) => {
      // Access metadata for value since it's not a direct property
      const value = typeof event.metadata === 'object' && event.metadata !== null 
        ? (event.metadata as any).value || 0 
        : 0;
      return sum + value;
    }, 0) || 0;
    
    const averageConversionValue = totalConversions ? totalValue / totalConversions : 0;
    
    const conversionStats: ConversionStats = {
      total_conversions: totalConversions,
      conversion_rate: conversionRate,
      conversions_by_date: conversionsByDate,
      conversions_by_type: conversionsByType,
      average_conversion_value: averageConversionValue
    };
    
    return { data: conversionStats, error: null };
  } catch (error) {
    console.error('Error fetching conversion stats:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 