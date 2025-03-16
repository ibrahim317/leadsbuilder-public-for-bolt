import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbListResponse, DbResponse } from '../types';
import { TrackedMetric } from './trackMetric';

/**
 * Interface for metrics filter options
 */
interface MetricsFilter {
  name?: string;
  category?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

/**
 * Gets metrics from the database with optional filtering
 * 
 * @param filter - Optional filter parameters
 * @returns Promise with list of metrics or error
 */
async function getMetrics(
  filter: MetricsFilter = {}
): Promise<DbListResponse<TrackedMetric>> {
  try {
    let query = supabaseClient
      .from('metrics')
      .select('*');
    
    // Apply filters if provided
    if (filter.name) {
      query = query.eq('name', filter.name);
    }
    
    if (filter.category) {
      query = query.eq('category', filter.category);
    }
    
    if (filter.userId) {
      query = query.eq('user_id', filter.userId);
    }
    
    if (filter.startDate) {
      query = query.gte('created_at', filter.startDate);
    }
    
    if (filter.endDate) {
      query = query.lte('created_at', filter.endDate);
    }
    
    // Order by creation date, newest first
    query = query.order('created_at', { ascending: false });
    
    // Apply limit if provided
    if (filter.limit) {
      query = query.limit(filter.limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return {
      data: data as TrackedMetric[],
      error: null
    };
  } catch (error) {
    console.error('Error getting metrics:', error);
    return {
      data: [],
      error: handleSupabaseError(error)
    };
  }
}

/**
 * Gets aggregated metrics (sum, average, count) for a specific metric name
 * 
 * @param name - The name of the metric to aggregate
 * @param filter - Optional filter parameters
 * @returns Promise with aggregated metrics or error
 */
async function getAggregatedMetrics(
  name: string,
  filter: Omit<MetricsFilter, 'name' | 'limit'> = {}
): Promise<DbResponse<{ sum: number; average: number; count: number }>> {
  try {
    let query = supabaseClient
      .from('metrics')
      .select('value')
      .eq('name', name);
    
    // Apply filters if provided
    if (filter.category) {
      query = query.eq('category', filter.category);
    }
    
    if (filter.userId) {
      query = query.eq('user_id', filter.userId);
    }
    
    if (filter.startDate) {
      query = query.gte('created_at', filter.startDate);
    }
    
    if (filter.endDate) {
      query = query.lte('created_at', filter.endDate);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Calculate aggregations
    const values = data.map(item => item.value);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const count = values.length;
    const average = count > 0 ? sum / count : 0;
    
    return {
      data: { sum, average, count },
      error: null
    };
  } catch (error) {
    console.error('Error getting aggregated metrics:', error);
    return {
      data: null,
      error: handleSupabaseError(error)
    };
  }
} 