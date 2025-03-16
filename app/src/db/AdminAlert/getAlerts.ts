import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { AdminAlert, DbListResponse } from '../types';

/**
 * Fetches admin alerts with optional filtering and sorting
 * @param limit Maximum number of alerts to fetch (default: 10)
 * @param includeRead Whether to include alerts that have been marked as read (default: false)
 * @param sortBy Field to sort by (default: 'created_at')
 * @param sortOrder Sort order (default: 'desc')
 * @returns A promise that resolves to a DbListResponse with an array of AdminAlert objects
 */
async function getAlerts(
  limit = 10,
  includeRead = false,
  sortBy: keyof AdminAlert = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<DbListResponse<AdminAlert>> {
  try {
    let query = supabaseClient
      .from('admin_alerts')
      .select('*', { count: 'exact' });
    
    // Apply read filter if needed
    if (!includeRead) {
      query = query.eq('read', false);
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    // Apply limit
    query = query.limit(limit);
    
    const { data, error, count } = await query;
    
    return { 
      data: data as AdminAlert[] || [], 
      count: count || 0,
      error: error ? handleSupabaseError(error) : null 
    };
  } catch (error) {
    console.error('Get admin alerts error:', error);
    return { data: [], count: 0, error: handleSupabaseError(error) };
  }
} 