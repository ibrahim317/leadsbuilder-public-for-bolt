import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';

/**
 * Parameters for creating a checkout session
 */
interface CheckoutSessionParams {
  priceId: string;
  planName: string;
  customerEmail: string;
  userId?: string;
  returnUrl?: string;
}

/**
 * Result from creating a checkout session
 */
interface CheckoutSessionResult {
  sessionId: string;
  url: string;
}

/**
 * Creates a new Stripe checkout session for subscription
 * 
 * @param params The checkout session parameters
 * @returns Promise with the sessionId and redirect URL or error
 */
export async function createCheckoutSession(
  params: CheckoutSessionParams
): Promise<{ data: CheckoutSessionResult | null; error: Error | null }> {
  try {
    const { priceId, planName, customerEmail, userId, returnUrl } = params;

    if (!priceId || !planName || !customerEmail) {
      return {
        data: null,
        error: new Error('Missing required fields: priceId, planName, customerEmail')
      };
    }

    // Generate a token for temporary users if userId isn't provided
    const token = userId ? null : Math.random().toString(36).substring(2, 15);

    // Call the Supabase Edge Function to create a checkout session
    const { data, error } = await supabaseClient.functions.invoke('create-checkout-session', {
      body: {
        priceId,
        planName,
        userId,
        customerEmail,
        token,
        returnUrl
      },
    });

    if (error) {
      throw error;
    }

    if (!data?.sessionId || !data?.url) {
      throw new Error('Failed to create checkout session');
    }

    return {
      data: {
        sessionId: data.sessionId,
        url: data.url
      },
      error: null
    };
  } catch (error) {
    console.error('Error in createCheckoutSession:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 