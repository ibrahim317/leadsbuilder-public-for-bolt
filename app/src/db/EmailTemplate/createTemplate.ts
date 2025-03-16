import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse, EmailTemplate } from '../types';

interface CreateEmailTemplateParams {
  name: string;
  subject: string;
  content: string;
  type: string;
  userId: string;
  isDefault?: boolean;
  variables?: Record<string, string>;
}

/**
 * Creates a new email template
 * 
 * @param params - Parameters for the new email template
 * @returns Promise with the created template or error
 */
async function createTemplate(
  params: CreateEmailTemplateParams
): Promise<DbResponse<EmailTemplate>> {
  try {
    const { name, subject, content, type, userId, isDefault = false, variables = {} } = params;
    
    // Create template object
    const template = {
      name,
      subject,
      content,
      type,
      user_id: userId,
      is_default: isDefault,
      variables,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Insert template
    const { data, error } = await supabaseClient
      .from('email_templates')
      .insert([template])
      .select()
      .single();
    
    if (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
    
    return { data: data as EmailTemplate, error: null };
  } catch (error) {
    console.error('Error creating email template:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 