import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { AdminAlert, DbResponse } from '../types';

/**
 * Input for creating a new admin alert
 */
interface CreateAlertInput {
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  metadata?: Record<string, any>;
}

/**
 * Creates a new admin alert
 * @param alert The alert data to create
 * @returns A promise that resolves to a DbResponse with the created AdminAlert
 */
async function createAlert(alert: CreateAlertInput): Promise<DbResponse<AdminAlert>> {
  try {
    const newAlert = {
      type: alert.type,
      message: alert.message,
      read: false,
      metadata: alert.metadata || {},
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabaseClient
      .from('admin_alerts')
      .insert(newAlert)
      .select()
      .single();
    
    return { 
      data: data as AdminAlert || null, 
      error: error ? handleSupabaseError(error) : null 
    };
  } catch (error) {
    console.error('Create admin alert error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Creates multiple admin alerts at once
 * @param alerts Array of alert data to create
 * @returns A promise that resolves to a DbResponse with an array of created AdminAlerts
 */
async function createMultipleAlerts(
  alerts: CreateAlertInput[]
): Promise<DbResponse<AdminAlert[]>> {
  try {
    const newAlerts = alerts.map(alert => ({
      type: alert.type,
      message: alert.message,
      read: false,
      metadata: alert.metadata || {},
      created_at: new Date().toISOString()
    }));
    
    const { data, error } = await supabaseClient
      .from('admin_alerts')
      .insert(newAlerts)
      .select();
    
    return { 
      data: data as AdminAlert[] || null, 
      error: error ? handleSupabaseError(error) : null 
    };
  } catch (error) {
    console.error('Create multiple admin alerts error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 