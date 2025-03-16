import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse, UserSettings } from '../types';

/**
 * Updates user settings in the database
 * 
 * @param userId - The ID of the user to update settings for
 * @param settings - The settings to update
 * @returns Promise with updated settings data or error
 */
async function updateUserSettings(
  userId: string,
  settings: Partial<UserSettings>
): Promise<DbResponse<UserSettings>> {
  try {
    // Check if settings exist for this user
    const { data: existingSettings, error: checkError } = await supabaseClient
      .from('user_settings')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Error checking user settings:', checkError);
      return { data: null, error: handleSupabaseError(checkError) };
    }
    
    const now = new Date().toISOString();
    let result;
    
    // If settings exist, update them
    if (existingSettings?.id) {
      const { data, error } = await supabaseClient
        .from('user_settings')
        .update({
          ...settings,
          updated_at: now
        })
        .eq('user_id', userId)
        .select()
        .single();
      
      result = { data, error };
    } 
    // If settings don't exist, create them
    else {
      const { data, error } = await supabaseClient
        .from('user_settings')
        .insert([{
          user_id: userId,
          email_notifications: settings.email_notifications ?? true,
          theme: settings.theme ?? 'system',
          language: settings.language ?? 'fr',
          timezone: settings.timezone ?? 'Europe/Paris',
          created_at: now,
          updated_at: now
        }])
        .select()
        .single();
      
      result = { data, error };
    }
    
    if (result.error) {
      console.error('Error updating user settings:', result.error);
      return { data: null, error: handleSupabaseError(result.error) };
    }
    
    return { data: result.data, error: null };
  } catch (error) {
    console.error('Error in updateUserSettings:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Updates user profile in the database
 * 
 * @param userId - The ID of the user to update profile for
 * @param profileData - The profile data to update
 * @returns Promise with success status or error
 */
async function updateUserProfile(
  userId: string,
  profileData: Record<string, any>
) {
  try {
    const { error } = await supabaseClient
      .from('users')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (error) {
      console.error('Error updating user profile:', error);
      return { success: false, error: handleSupabaseError(error) };
    }
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    return { success: false, error: handleSupabaseError(error) };
  }
} 