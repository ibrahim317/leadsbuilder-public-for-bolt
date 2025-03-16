import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { redirectToCustomerPortal } from '../../lib/stripe/redirectToCustomerPortal';

/**
 * Updates payment method by redirecting to Stripe Customer Portal
 * 
 * @returns Promise with success status or error
 */
async function updatePaymentMethod(): Promise<{ success: boolean; error: Error | null }> {
  try {
    // Redirect to Stripe Customer Portal where the user can update their payment method
    const result = await redirectToCustomerPortal();
    
    return result;
  } catch (error) {
    console.error('Error in updatePaymentMethod:', error);
    return { success: false, error: handleSupabaseError(error) };
  }
}

/**
 * Cancels subscription at period end
 * 
 * @param subscriptionId - The ID of the subscription to cancel
 * @returns Promise with success status or error
 */
async function cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    // Call the Supabase Edge Function to cancel the subscription
    const { error } = await supabaseClient.functions.invoke('cancel-subscription', {
      body: {
        subscriptionId,
      },
    });
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in cancelSubscription:', error);
    return { success: false, error: handleSupabaseError(error) };
  }
}

/**
 * Reactivates a canceled subscription
 * 
 * @param subscriptionId - The ID of the subscription to reactivate
 * @returns Promise with success status or error
 */
async function reactivateSubscription(subscriptionId: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    // Call the Supabase Edge Function to reactivate the subscription
    const { error } = await supabaseClient.functions.invoke('reactivate-subscription', {
      body: {
        subscriptionId,
      },
    });
    
    if (error) throw error;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error in reactivateSubscription:', error);
    return { success: false, error: handleSupabaseError(error) };
  }
} 