import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbListResponse, Invoice } from '../types';

/**
 * Fetches invoices for a user
 * 
 * @param userId - The ID of the user to fetch invoices for
 * @param limit - Maximum number of invoices to fetch (default: 10)
 * @returns Promise with invoices data or error
 */
async function getInvoices(
  userId: string,
  limit = 10
): Promise<DbListResponse<Invoice>> {
  try {
    const { data, error } = await supabaseClient
      .from('stripe_invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching invoices:', error);
      return { data: [], error: handleSupabaseError(error) };
    }
    
    // Transform the data to match the Invoice type
    const invoices: Invoice[] = (data || []).map(invoice => ({
      id: invoice.id,
      user_id: invoice.user_id,
      amount: invoice.amount_total / 100, // Convert from cents to dollars/euros
      status: invoice.status,
      created_at: invoice.created_at,
      due_date: invoice.due_date || invoice.created_at,
      paid_at: invoice.paid_at,
      items: invoice.lines?.data?.map((item: any) => ({
        description: item.description,
        amount: item.amount / 100, // Convert from cents to dollars/euros
        quantity: item.quantity
      })) || []
    }));
    
    return { data: invoices, error: null };
  } catch (error) {
    console.error('Error in getInvoices:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
} 