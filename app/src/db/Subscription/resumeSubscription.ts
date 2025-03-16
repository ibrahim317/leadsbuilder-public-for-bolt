import { supabaseClient } from "../../lib/supabaseClient";
import { handlePaymentError } from "../../lib/error-handlers";
import { verifySubscription } from "./verifySubscription";

/**
 * Resume subscription
 */
async function resumeSubscription(): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get the subscription
    const { subscription, error: verifyError } = await verifySubscription();
    
    if (verifyError) throw verifyError;
    
    if (!subscription) {
      throw new Error('No subscription found');
    }

    // Call the Supabase Edge Function to resume the subscription
    const { data, error } = await supabaseClient.functions.invoke('resume-subscription', {
      body: {
        subscriptionId: subscription.stripe_subscription_id,
        userId: user.id,
      },
    });

    if (error) throw error;

    if (!data || !data.success) {
      throw new Error('Failed to resume subscription');
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Resume subscription error:', error);
    return { success: false, error: handlePaymentError(error) };
  }
}