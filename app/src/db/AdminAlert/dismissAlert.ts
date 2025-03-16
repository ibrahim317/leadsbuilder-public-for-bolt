import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Dismisses (deletes) an admin alert
 * @param alertId The ID of the alert to dismiss
 * @returns A promise that resolves to a DbResponse with null data
 */
async function dismissAlert(alertId: string): Promise<DbResponse<null>> {
  try {
    const { error } = await supabaseClient
      .from('admin_alerts')
      .delete()
      .eq('id', alertId);
    
    return { data: null, error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Dismiss alert error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Dismisses (deletes) multiple admin alerts
 * @param alertIds Array of alert IDs to dismiss
 * @returns A promise that resolves to a DbResponse with null data
 */
async function dismissMultipleAlerts(alertIds: string[]): Promise<DbResponse<null>> {
  try {
    const { error } = await supabaseClient
      .from('admin_alerts')
      .delete()
      .in('id', alertIds);
    
    return { data: null, error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Dismiss multiple alerts error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Dismisses (deletes) all read admin alerts
 * @returns A promise that resolves to a DbResponse with null data
 */
async function dismissAllReadAlerts(): Promise<DbResponse<null>> {
  try {
    const { error } = await supabaseClient
      .from('admin_alerts')
      .delete()
      .eq('read', true);
    
    return { data: null, error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Dismiss all read alerts error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 