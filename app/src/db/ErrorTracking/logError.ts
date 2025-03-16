import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

interface ErrorDetails {
  error_type: string;
  error_message: string;
  error_stack?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  user_id?: string;
}

/**
 * Logs an application error to the database
 * @param details - Error details including type, message, stack trace, and severity
 * @returns Promise with success status or error
 */
async function logError(details: ErrorDetails): Promise<DbResponse<null>> {
  try {
    const browserInfo = typeof window !== 'undefined' ? {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      vendor: navigator.vendor
    } : null;

    const url = typeof window !== 'undefined' ? window.location.href : null;

    const { error } = await supabaseClient.from('error_logs').insert({
      error_type: details.error_type,
      error_message: details.error_message,
      error_stack: details.error_stack,
      browser_info: browserInfo,
      url: url,
      severity: details.severity || 'medium',
      user_id: details.user_id
    });

    if (error) {
      throw error;
    }

    return {
      data: null,
      error: null
    };
  } catch (error) {
    console.error('Failed to log error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 