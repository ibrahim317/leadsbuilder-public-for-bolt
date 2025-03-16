import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Interface for GDPR settings
 */
export interface GDPRSettings {
  id: string;
  user_id: string;
  data_retention_period: number;
  marketing_consent: boolean;
  analytics_consent: boolean;
  third_party_consent: boolean;
  last_updated: string;
}

/**
 * Retrieves GDPR settings for a user
 * 
 * @param userId - The ID of the user to get GDPR settings for
 * @returns Promise with GDPR settings or error
 */
export async function getSettings(userId: string): Promise<DbResponse<GDPRSettings>> {
  try {
    const { data, error } = await supabaseClient
      .from('gdpr_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // If no settings found, return default settings
      if (error.code === 'PGRST116') {
        return {
          data: {
            id: '',
            user_id: userId,
            data_retention_period: 365, // Default: 1 year
            marketing_consent: false,
            analytics_consent: false,
            third_party_consent: false,
            last_updated: new Date().toISOString()
          },
          error: null
        };
      }
      
      throw error;
    }
    
    return {
      data: data as GDPRSettings,
      error: null
    };
  } catch (error) {
    console.error('Error fetching GDPR settings:', error);
    return {
      data: null,
      error: handleSupabaseError(error)
    };
  }
} 