import { supabaseClient } from '../supabaseClient';
import { handlePaymentError } from '../error-handlers';

export async function createCheckoutSession(priceId: string, planName: string): Promise<{ sessionId: string | null; url: string | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Call the Supabase Edge Function to create a checkout session
    const { data, error } = await supabaseClient.functions.invoke('create-checkout-session', {
      body: {
        priceId,
        planName,
        userId: user.id,
        customerEmail: user.email,
        successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/pricing`,
      },
    });

    if (error) throw error;

    if (!data || !data.sessionId || !data.url) {
      throw new Error('Failed to create checkout session');
    }

    return {
      sessionId: data.sessionId,
      url: data.url,
      error: null,
    };
  } catch (error) {
    console.error('Create checkout session error:', error);
    return { sessionId: null, url: null, error: handlePaymentError(error) };
  }
}
