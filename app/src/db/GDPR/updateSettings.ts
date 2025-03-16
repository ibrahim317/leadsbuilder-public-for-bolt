import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';
import { GDPRSettings } from './getSettings';

/**
 * Interface for GDPR settings update
 */
interface GDPRSettingsUpdate {
  data_retention_period?: number;
  marketing_consent?: boolean;
  analytics_consent?: boolean;
  third_party_consent?: boolean;
}

/**
 * Updates GDPR settings for a user
 * 
 * @param userId - The ID of the user to update GDPR settings for
 * @param settings - The GDPR settings to update
 * @returns Promise with updated GDPR settings or error
 */
async function updateSettings(
  userId: string,
  settings: GDPRSettingsUpdate
): Promise<DbResponse<GDPRSettings>> {
  try {
    // First check if settings exist
    const { data: existingSettings, error: fetchError } = await supabaseClient
      .from('gdpr_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    const updateData = {
      ...settings,
      last_updated: new Date().toISOString()
    };
    
    if (fetchError && fetchError.code === 'PGRST116') {
      // Settings don't exist, create new record
      const { data: newSettings, error: insertError } = await supabaseClient
        .from('gdpr_settings')
        .insert([
          {
            user_id: userId,
            data_retention_period: settings.data_retention_period || 365,
            marketing_consent: settings.marketing_consent || false,
            analytics_consent: settings.analytics_consent || false,
            third_party_consent: settings.third_party_consent || false,
            last_updated: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      return {
        data: newSettings as GDPRSettings,
        error: null
      };
    } else if (fetchError) {
      throw fetchError;
    }
    
    // Settings exist, update them
    const { data: updatedSettings, error: updateError } = await supabaseClient
      .from('gdpr_settings')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    return {
      data: updatedSettings as GDPRSettings,
      error: null
    };
  } catch (error) {
    console.error('Error updating GDPR settings:', error);
    return {
      data: null,
      error: handleSupabaseError(error)
    };
  }
} 