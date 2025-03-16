import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';

/**
 * Interface for subscription update parameters
 */
interface SubscriptionAction {
  action: 'cancel' | 'resume';
  subscriptionId?: string;  // Optional as it might be fetched automatically
}

/**
 * Result from subscription action
 */
interface SubscriptionActionResult {
  success: boolean;
  message: string;
  redirectUrl?: string;
}

/**
 * Handles subscription changes like cancellation or resumption
 * 
 * @param params The subscription action parameters
 * @returns Promise with the result of the action or error
 */
export async function handleSubscriptionChanges(
  params: SubscriptionAction
): Promise<{ data: SubscriptionActionResult | null; error: Error | null }> {
  try {
    const { action, subscriptionId } = params;
    
    let endpoint: string;
    switch (action) {
      case 'cancel':
        endpoint = 'cancel-subscription';
        break;
      case 'resume':
        endpoint = 'resume-subscription';
        break;
      default:
        return {
          data: null,
          error: new Error(`Invalid action: ${action}`)
        };
    }

    // Call the appropriate Supabase Edge Function
    const { data, error } = await supabaseClient.functions.invoke(endpoint, {
      body: { subscriptionId },
    });

    if (error) {
      throw error;
    }

    if (!data || data.error) {
      throw new Error(data?.error || `Failed to ${action} subscription`);
    }

    return {
      data: {
        success: true,
        message: data.message || `Subscription ${action === 'cancel' ? 'cancelled' : 'resumed'} successfully`,
        redirectUrl: data.url
      },
      error: null
    };
  } catch (error) {
    console.error(`Error in ${params.action} subscription:`, error);
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Redirects to the Stripe Customer Portal to manage billing
 * 
 * @returns Promise with the redirect URL or error
 */
async function redirectToCustomerPortal(): Promise<{ data: { url: string } | null; error: Error | null }> {
  try {
    // Call the Supabase Edge Function
    const { data, error } = await supabaseClient.functions.invoke('create-customer-portal-session', {
      body: {}
    });

    if (error) {
      throw error;
    }

    if (!data?.url) {
      throw new Error('Failed to create customer portal session');
    }

    return {
      data: { url: data.url },
      error: null
    };
  } catch (error) {
    console.error('Error in redirectToCustomerPortal:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 