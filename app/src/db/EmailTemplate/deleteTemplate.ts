import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

interface DeleteEmailTemplateParams {
  id: string;
  userId: string; // For security, ensure the user owns the template
}

/**
 * Deletes an email template
 * 
 * @param params - Parameters containing template ID and user ID
 * @returns Promise with success status or error
 */
async function deleteTemplate(
  params: DeleteEmailTemplateParams
): Promise<DbResponse<boolean>> {
  try {
    const { id, userId } = params;
    
    // Delete the template
    const { error } = await supabaseClient
      .from('email_templates')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Ensure the user owns the template
    
    if (error) {
      return { data: false, error: handleSupabaseError(error) };
    }
    
    return { data: true, error: null };
  } catch (error) {
    console.error('Error deleting email template:', error);
    return { data: false, error: handleSupabaseError(error) };
  }
} 