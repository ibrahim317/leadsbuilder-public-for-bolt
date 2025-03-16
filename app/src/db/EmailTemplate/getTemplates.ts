import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbListResponse, EmailTemplate } from '../types';

interface GetEmailTemplatesParams {
  userId?: string;
  type?: string;
  limit?: number;
  offset?: number;
  searchTerm?: string;
}

/**
 * Fetches email templates from the database
 * 
 * @param params - Optional parameters for filtering templates
 * @returns Promise with email templates list or error
 */
export async function getTemplates(
  params?: GetEmailTemplatesParams
): Promise<DbListResponse<EmailTemplate>> {
  try {
    const { userId, type, limit = 20, offset = 0, searchTerm } = params || {};
    
    // Build query
    let query = supabaseClient
      .from('email_templates')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });
    
    // Add filters if provided
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    if (type) {
      query = query.eq('type', type);
    }
    
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%`);
    }
    
    // Add pagination
    query = query.range(offset, offset + limit - 1);
    
    // Execute query
    const { data, count, error } = await query;
    
    if (error) {
      return { data: [], error: handleSupabaseError(error) };
    }
    
    return { 
      data: data as EmailTemplate[], 
      count: count || 0,
      error: null 
    };
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
} 