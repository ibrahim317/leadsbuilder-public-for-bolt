import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

export interface DashboardUserStats {
  total: number;
  new_last_week: number;
  active: number;
}

export interface ConversionData {
  event_type: string;
  count: number;
}

export interface RevenueData {
  date: string;
  amount: number;
}

interface DashboardStats {
  userData: DashboardUserStats;
  conversionData: ConversionData[];
  revenueData: RevenueData[];
}

/**
 * Fetches dashboard statistics including user data, conversion data, and revenue data
 * 
 * @param timeframe - Time period for data aggregation ('day', 'week', 'month', 'year')
 * @returns Promise with dashboard statistics or error
 */
export async function getStats(
  timeframe: 'day' | 'week' | 'month' | 'year' = 'week'
): Promise<DbResponse<DashboardStats>> {
  try {
    // Calculate start date based on timeframe
    const startDate = getStartDateForTimeframe(timeframe);
    
    // Fetch all data in parallel
    const [userData, conversionData, revenueData] = await Promise.all([
      getUserData(),
      getConversionData(startDate),
      getRevenueData(startDate, timeframe)
    ]);
    
    return {
      data: {
        userData,
        conversionData,
        revenueData
      },
      error: null
    };
  } catch (error) {
    console.error('Error in getStats:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Fetches user statistics
 * 
 * @returns Promise with user statistics
 */
async function getUserData(): Promise<DashboardUserStats> {
  try {
    // Total users
    const { count: total, error: totalError } = await supabaseClient
      .from('users')
      .select('id', { count: 'exact', head: true });

    if (totalError) throw totalError;

    // New users in the last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { count: newUsers, error: newUsersError } = await supabaseClient
      .from('users')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString());

    if (newUsersError) throw newUsersError;

    // Active users (logged in within the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: active, error: activeError } = await supabaseClient
      .from('users')
      .select('id', { count: 'exact', head: true })
      .gte('last_sign_in_at', thirtyDaysAgo.toISOString());

    if (activeError) throw activeError;

    return {
      total: total || 0,
      new_last_week: newUsers || 0,
      active: active || 0
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
}

/**
 * Fetches conversion event data
 * 
 * @param startDate - Start date for filtering conversion events
 * @returns Promise with conversion event data
 */
async function getConversionData(startDate: Date): Promise<ConversionData[]> {
  try {
    const { data, error } = await supabaseClient
      .from('conversion_events')
      .select('event_type')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    // Group the data by event type
    const eventCounts: Record<string, number> = {};
    (data || []).forEach((item: { event_type: string }) => {
      const eventType = item.event_type || 'unknown';
      eventCounts[eventType] = (eventCounts[eventType] || 0) + 1;
    });

    // Convert to the format expected by the component
    return Object.entries(eventCounts).map(([event_type, count]) => ({
      event_type,
      count
    }));
  } catch (error) {
    console.error('Error fetching conversion data:', error);
    throw error;
  }
}

/**
 * Fetches revenue data
 * 
 * @param startDate - Start date for filtering revenue data
 * @param timeframe - Time period for data aggregation
 * @returns Promise with revenue data
 */
async function getRevenueData(
  startDate: Date,
  timeframe: 'day' | 'week' | 'month' | 'year'
): Promise<RevenueData[]> {
  try {
    const { data, error } = await supabaseClient
      .from('subscriptions')
      .select(`
        created_at,
        stripe_subscription_id,
        stripe_subscriptions (
          price_id,
          stripe_prices (
            unit_amount
          )
        )
      `)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group revenue by day/week/month based on timeframe
    const groupedData: Record<string, number> = {};

    (data || []).forEach((item: any) => {
      let dateKey;
      const date = new Date(item.created_at);

      switch (timeframe) {
        case 'day':
          dateKey = `${date.getHours()}h`;
          break;
        case 'week':
          dateKey = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][date.getDay()];
          break;
        case 'month':
          dateKey = date.getDate().toString();
          break;
        case 'year':
          dateKey = [
            'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
            'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
          ][date.getMonth()];
          break;
        default:
          dateKey = date.toISOString().split('T')[0];
      }

      const amount = item.stripe_subscriptions?.[0]?.stripe_prices?.[0]?.unit_amount || 0;
      groupedData[dateKey] = (groupedData[dateKey] || 0) + amount;
    });

    return Object.entries(groupedData).map(([date, amount]) => ({
      date,
      amount
    }));
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw error;
  }
}

/**
 * Calculates the start date based on the selected timeframe
 * 
 * @param timeframe - Time period ('day', 'week', 'month', 'year')
 * @returns Start date for the selected timeframe
 */
function getStartDateForTimeframe(timeframe: 'day' | 'week' | 'month' | 'year'): Date {
  const now = new Date();
  let result: Date;
  
  switch (timeframe) {
    case 'day':
      result = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week': {
      const day = now.getDay();
      result = new Date(now.setDate(now.getDate() - day));
      break;
    }
    case 'month':
      result = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'year':
      result = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      result = new Date(now.setDate(now.getDate() - 7));
      break;
  }
  
  return result;
} 