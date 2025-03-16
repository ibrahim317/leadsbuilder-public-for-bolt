import { handlePaymentError } from "../../lib/error-handlers";
import { supabaseClient } from "../../lib/supabaseClient";
import { Subscription } from "../../lib/stripe/types";

/**
 * Verify subscription status
 */
export async function verifySubscription(): Promise<{ isActive: boolean; subscription: Subscription | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the subscription from the database
    const { data, error } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      // If no subscription found, return inactive
      if (error.code === 'PGRST116') {
        return { isActive: false, subscription: null, error: null };
      }
      throw error;
    }

    const subscription = data as Subscription;
    
    // Check if subscription is active
    const isActive = ['active', 'trialing'].includes(subscription.status);
    
    return {
      isActive,
      subscription,
      error: null,
    };
  } catch (error) {
    console.error('Verify subscription error:', error);
    return { isActive: false, subscription: null, error: handlePaymentError(error) };
  }
}