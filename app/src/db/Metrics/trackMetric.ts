import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Interface for metric data
 */
interface MetricData {
  name: string;
  value: number;
  category?: string;
  metadata?: Record<string, any>;
}

/**
 * Interface for tracked metric response
 */
export interface TrackedMetric extends MetricData {
  id: string;
  user_id: string | null;
  created_at: string;
}

/**
 * Tracks a metric in the database
 * 
 * @param userId - The ID of the user associated with the metric (optional)
 * @param metric - The metric data to track
 * @returns Promise with the tracked metric or error
 */
async function trackMetric(
  userId: string | null,
  metric: MetricData
): Promise<DbResponse<TrackedMetric>> {
  try {
    const metricData = {
      user_id: userId,
      name: metric.name,
      value: metric.value,
      category: metric.category || 'general',
      metadata: metric.metadata || {}
    };

    const { data, error } = await supabaseClient
      .from('metrics')
      .insert([metricData])
      .select()
      .single();

    if (error) throw error;

    return {
      data: data as TrackedMetric,
      error: null
    };
  } catch (error) {
    console.error('Error tracking metric:', error);
    return {
      data: null,
      error: handleSupabaseError(error)
    };
  }
} 