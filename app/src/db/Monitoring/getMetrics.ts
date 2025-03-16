import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbListResponse, MetricData } from '../types';

/**
 * Fetches monitoring metrics from the database
 * 
 * @param limit - Maximum number of metrics to fetch (default: 100)
 * @param metricName - Optional filter by metric name
 * @param startDate - Optional start date for filtering metrics
 * @param endDate - Optional end date for filtering metrics
 * @returns Promise with metrics data or error
 */
export async function getMetrics(
  limit = 100,
  metricName?: string,
  startDate?: Date,
  endDate?: Date
): Promise<DbListResponse<MetricData>> {
  try {
    let query = supabaseClient
      .from('usage_metrics')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(limit);
    
    // Apply filters if provided
    if (metricName) {
      query = query.eq('metric_name', metricName);
    }
    
    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching metrics:', error);
      return { data: [], error: handleSupabaseError(error) };
    }
    
    // Transform data to match MetricData type
    const transformedData: MetricData[] = data.map(metric => ({
      id: metric.id,
      name: metric.metric_name,
      value: metric.metric_value,
      timestamp: metric.created_at,
      metadata: metric.metadata || {}
    }));
    
    return { data: transformedData, error: null };
  } catch (error) {
    console.error('Error in getMetrics:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
}

/**
 * Groups metrics by name and formats them for chart display
 * 
 * @param metrics - Array of metric data
 * @returns Record with metric names as keys and arrays of formatted data as values
 */
export function formatMetricsForCharts(
  metrics: MetricData[]
): Record<string, { timestamp: string; value: number }[]> {
  const groupedMetrics: Record<string, { timestamp: string; value: number }[]> = {};
  
  metrics.forEach(metric => {
    if (!groupedMetrics[metric.name]) {
      groupedMetrics[metric.name] = [];
    }
    
    groupedMetrics[metric.name].push({
      timestamp: new Date(metric.timestamp).toLocaleString(),
      value: metric.value
    });
  });
  
  return groupedMetrics;
} 