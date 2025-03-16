import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';

/**
 * Interface for subscription verification response
 */
interface SubscriptionVerificationResult {
  success: boolean;
  message?: string;
  subscription?: {
    status: string;
    tier: string;
    current_period_end?: string;
  };
}

/**
 * Verifies a subscription status after payment
 * 
 * @param sessionId The Stripe checkout session ID
 * @param token Optional one-time token for temp users
 * @param userId Optional user ID
 * @returns Promise with verification result or error
 */
export async function verifySubscription(
  sessionId: string,
  token?: string | null,
  userId?: string | null
): Promise<{ data: SubscriptionVerificationResult | null; error: Error | null }> {
  try {
    if (!sessionId) {
      return {
        data: null,
        error: new Error('Missing required field: sessionId')
      };
    }

    // Call the Supabase Edge Function to verify the payment
    const { data, error } = await supabaseClient.functions.invoke('verify-payment-token', {
      body: { 
        session_id: sessionId,
        token,
        user_id: userId
      },
    });

    if (error) {
      throw error;
    }

    // Check for errors in the response
    if (data?.error) {
      return {
        data: {
          success: false,
          message: data.error
        },
        error: null
      };
    }

    // Return the verification result
    return {
      data: {
        success: true,
        message: data?.message || 'Payment verified successfully',
        subscription: data?.subscription
      },
      error: null
    };
  } catch (error) {
    console.error('Error in verifySubscription:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 