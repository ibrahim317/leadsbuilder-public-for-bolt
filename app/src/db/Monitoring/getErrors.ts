import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbListResponse, ErrorLog } from '../types';

/**
 * Fetches error logs from the database
 * 
 * @param limit - Maximum number of errors to fetch (default: 100)
 * @param severity - Optional filter by severity level
 * @param resolved - Optional filter by resolved status
 * @param startDate - Optional start date for filtering errors
 * @param endDate - Optional end date for filtering errors
 * @returns Promise with error logs data or error
 */
export async function getErrors(
  limit = 100,
  severity?: 'low' | 'medium' | 'high' | 'critical',
  resolved?: boolean,
  startDate?: Date,
  endDate?: Date
): Promise<DbListResponse<ErrorLog>> {
  try {
    let query = supabaseClient
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    // Apply filters if provided
    if (severity) {
      query = query.eq('severity', severity);
    }
    
    if (resolved !== undefined) {
      query = query.eq('resolved', resolved);
    }
    
    if (startDate) {
      query = query.gte('created_at', startDate.toISOString());
    }
    
    if (endDate) {
      query = query.lte('created_at', endDate.toISOString());
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching error logs:', error);
      return { data: [], error: handleSupabaseError(error) };
    }
    
    return { data: data || [], error: null };
  } catch (error) {
    console.error('Error in getErrors:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
}

/**
 * Marks an error log as resolved
 * 
 * @param errorId - ID of the error log to mark as resolved
 * @returns Promise with success status or error
 */
export async function markErrorAsResolved(errorId: string) {
  try {
    const { error } = await supabaseClient
      .from('error_logs')
      .update({ 
        resolved: true,
        resolved_at: new Date().toISOString()
      })
      .eq('id', errorId);
    
    if (error) {
      console.error('Error marking error as resolved:', error);
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in markErrorAsResolved:', error);
    return { success: false, error: handleSupabaseError(error) };
  }
} 