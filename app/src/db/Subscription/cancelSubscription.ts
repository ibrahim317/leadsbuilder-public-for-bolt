import { supabaseClient } from "../../lib/supabaseClient";
import { handlePaymentError } from "../../lib/error-handlers";
import { verifySubscription } from "./verifySubscription";

/**
 * Cancel subscription
 */
async function cancelSubscription(): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the subscription
    const { subscription, error: verifyError } = await verifySubscription();
    
    if (verifyError) throw verifyError;
    
    if (!subscription) {
      throw new Error('No active subscription found');
    }

    // Call the Supabase Edge Function to cancel the subscription
    const { data, error } = await supabaseClient.functions.invoke('cancel-subscription', {
      body: {
        subscriptionId: subscription.stripe_subscription_id,
        userId: user.id,
      },
    });

    if (error) throw error;

    if (!data || !data.success) {
      throw new Error('Failed to cancel subscription');
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return { success: false, error: handlePaymentError(error) };
  }
}

