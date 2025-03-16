import { supabaseClient } from "../supabaseClient";
import { handlePaymentError } from "../error-handlers";

/**
 * Redirect to customer portal
 */
export async function redirectToCustomerPortal(): Promise<{ success: boolean; error: Error | null }> {
  try {
    const { data: { user } } = await supabaseClient.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Call the Supabase Edge Function to create a portal session
    const { data, error } = await supabaseClient.functions.invoke('create-portal-session', {
      body: {
        userId: user.id,
        returnUrl: `${window.location.origin}/settings`,
      },
    });

    if (error) throw error;

    if (!data || !data.url) {
      throw new Error('Failed to create customer portal session');
    }

    // Redirect to the portal
    window.location.href = data.url;

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Redirect to customer portal error:', error);
    return { success: false, error: handlePaymentError(error) };
  }
} 