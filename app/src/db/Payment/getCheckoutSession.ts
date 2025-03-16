import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';

/**
 * Interface for Stripe checkout session details
 */
interface CheckoutSession {
  id: string;
  status: string;
  customer: string;
  payment_status: string;
  amount_total: number;
  currency: string;
  metadata: {
    userId?: string;
    planName?: string;
    [key: string]: any;
  };
}

/**
 * Retrieves a Stripe checkout session by ID
 * 
 * @param sessionId The Stripe checkout session ID
 * @returns Promise with the checkout session details or error
 */
export async function getCheckoutSession(
  sessionId: string
): Promise<{ data: CheckoutSession | null; error: Error | null }> {
  try {
    if (!sessionId) {
      return {
        data: null,
        error: new Error('Missing required field: sessionId')
      };
    }

    // Call the Supabase Edge Function to retrieve the checkout session
    const { data, error } = await supabaseClient.functions.invoke('get-checkout-session', {
      body: { sessionId },
    });

    if (error) {
      throw error;
    }

    if (!data || !data.id) {
      throw new Error('Failed to retrieve checkout session');
    }

    return {
      data: data as CheckoutSession,
      error: null
    };
  } catch (error) {
    console.error('Error in getCheckoutSession:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 