import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse, UserSettings } from '../types';

/**
 * Fetches user settings from the database
 * 
 * @param userId - The ID of the user to fetch settings for
 * @returns Promise with user settings data or error
 */
async function getUserSettings(userId: string): Promise<DbResponse<UserSettings>> {
  try {
    const { data, error } = await supabaseClient
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // If the error is 'not found', return default settings
      if (error.code === 'PGRST116') {
        const defaultSettings: UserSettings = {
          id: '',
          user_id: userId,
          email_notifications: true,
          theme: 'system',
          language: 'fr',
          timezone: 'Europe/Paris',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        return { data: defaultSettings, error: null };
      }
      
      console.error('Error fetching user settings:', error);
      return { data: null, error: handleSupabaseError(error) };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserSettings:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Fetches user profile and settings from the database
 * 
 * @param userId - The ID of the user to fetch profile for
 * @returns Promise with user profile data or error
 */
export async function getUserProfile(userId: string): Promise<DbResponse<any>> {
  try {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return { data: null, error: handleSupabaseError(error) };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 