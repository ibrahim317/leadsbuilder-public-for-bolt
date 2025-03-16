import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbListResponse, ErrorLog } from '../types';

interface GetErrorsOptions {
  limit?: number;
  offset?: number;
  userId?: string;
  resolved?: boolean;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  startDate?: string;
  endDate?: string;
}

/**
 * Retrieves error logs from the database with optional filtering
 * @param options - Options for filtering and pagination
 * @returns Promise with error logs or error
 */
async function getErrors(options: GetErrorsOptions = {}): Promise<DbListResponse<ErrorLog>> {
  try {
    const {
      limit = 50,
      offset = 0,
      userId,
      resolved,
      severity,
      startDate,
      endDate
    } = options;

    let query = supabaseClient
      .from('error_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    if (resolved !== undefined) {
      query = query.eq('resolved', resolved);
    }

    if (severity) {
      query = query.eq('severity', severity);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return {
      data: data || [],
      count: count || undefined,
      error: null
    };
  } catch (error) {
    console.error('Failed to get error logs:', error);
    return {
      data: [],
      error: handleSupabaseError(error)
    };
  }
} 