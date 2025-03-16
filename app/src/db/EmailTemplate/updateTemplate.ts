import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse, EmailTemplate } from '../types';

interface UpdateEmailTemplateParams {
  id: string;
  name?: string;
  subject?: string;
  content?: string;
  type?: string;
  isDefault?: boolean;
  variables?: Record<string, string>;
  userId: string; // For security, ensure the user owns the template
}

/**
 * Updates an existing email template
 * 
 * @param params - Parameters for updating the email template
 * @returns Promise with the updated template or error
 */
export async function updateTemplate(
  params: UpdateEmailTemplateParams
): Promise<DbResponse<EmailTemplate>> {
  try {
    const { id, name, subject, content, type, isDefault, variables, userId } = params;
    
    // Create update object with only the fields that are provided
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString()
    };
    
    if (name !== undefined) updateData.name = name;
    if (subject !== undefined) updateData.subject = subject;
    if (content !== undefined) updateData.content = content;
    if (type !== undefined) updateData.type = type;
    if (isDefault !== undefined) updateData.is_default = isDefault;
    if (variables !== undefined) updateData.variables = variables;
    
    // Update template
    const { data, error } = await supabaseClient
      .from('email_templates')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', userId) // Ensure the user owns the template
      .select()
      .single();
    
    if (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
    
    return { data: data as EmailTemplate, error: null };
  } catch (error) {
    console.error('Error updating email template:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 