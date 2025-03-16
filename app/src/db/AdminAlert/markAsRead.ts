import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Marks an admin alert as read
 * @param alertId The ID of the alert to mark as read
 * @returns A promise that resolves to a DbResponse with null data
 */
async function markAsRead(alertId: string): Promise<DbResponse<null>> {
  try {
    const { error } = await supabaseClient
      .from('admin_alerts')
      .update({ read: true })
      .eq('id', alertId);
    
    return { data: null, error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Mark alert as read error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Marks multiple admin alerts as read
 * @param alertIds Array of alert IDs to mark as read
 * @returns A promise that resolves to a DbResponse with null data
 */
async function markMultipleAsRead(alertIds: string[]): Promise<DbResponse<null>> {
  try {
    const { error } = await supabaseClient
      .from('admin_alerts')
      .update({ read: true })
      .in('id', alertIds);
    
    return { data: null, error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Mark multiple alerts as read error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Marks all admin alerts as read
 * @returns A promise that resolves to a DbResponse with null data
 */
async function markAllAsRead(): Promise<DbResponse<null>> {
  try {
    const { error } = await supabaseClient
      .from('admin_alerts')
      .update({ read: true })
      .eq('read', false);
    
    return { data: null, error: error ? handleSupabaseError(error) : null };
  } catch (error) {
    console.error('Mark all alerts as read error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 