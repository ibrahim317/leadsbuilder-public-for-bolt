import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Creates a checkout session for subscription purchase or upgrade
 * 
 * @param userId - The ID of the user creating the checkout session
 * @param planId - The ID of the subscription plan
 * @param successUrl - URL to redirect after successful payment
 * @param cancelUrl - URL to redirect if payment is cancelled
 * @returns Promise with checkout session URL or error
 */
async function createCheckoutSession(
  userId: string,
  planId: string,
  successUrl: string,
  cancelUrl: string
): Promise<DbResponse<{ checkoutUrl: string }>> {
  try {
    // Call the Supabase function that creates a Stripe checkout session
    const { data, error } = await supabaseClient.functions.invoke('create-checkout-session', {
      body: {
        userId,
        planId,
        successUrl,
        cancelUrl
      }
    });

    if (error) {
      console.error('Error creating checkout session:', error);
      return { data: null, error: handleSupabaseError(error) };
    }

    if (!data || !data.checkoutUrl) {
      return { 
        data: null, 
        error: new Error('Failed to create checkout session. No URL returned.')
      };
    }

    return { data: { checkoutUrl: data.checkoutUrl }, error: null };
  } catch (error) {
    console.error('Create checkout session error:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 