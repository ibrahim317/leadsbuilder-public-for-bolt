import { createCheckoutSession } from './createCheckoutSession';

/**
 * Redirect to Stripe checkout page
 * 
 * @param priceId - The Stripe price ID
 * @returns Promise with success status or error
 */
export async function redirectToCheckout(priceId: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    // Get the plan name based on the price ID
    const planName = getPlanNameFromPriceId(priceId);
    
    // Create a checkout session
    const { url, error } = await createCheckoutSession(priceId, planName);
    
    if (error) throw error;
    
    if (!url) {
      throw new Error('Failed to create checkout session');
    }
    
    // Redirect to the checkout page
    window.location.href = url;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Redirect to checkout error:', error);
    return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
  }
}

/**
 * Get plan name from price ID
 * This is a helper function to determine the plan name based on the price ID
 */
function getPlanNameFromPriceId(priceId: string): string {
  // This is a simplified implementation
  // In a real application, you might want to fetch this from a database or configuration
  const priceToPlanMap: Record<string, string> = {
    'price_1QQ3BsDWcrI6M6PNdkDSxpZU': 'Starter Monthly',
    'price_1QQ3E6DWcrI6M6PNkHobBmF7': 'Pro Monthly',
    'price_1QQ3GNDWcrI6M6PNmUODRfMo': 'Business Monthly',
    'price_1QXXT0DWcrI6M6PNcTDXkkOv': 'Starter Quarterly',
    'price_1QXXTzDWcrI6M6PNpzs9Ifuz': 'Pro Quarterly',
    'price_1QXYCyDWcrI6M6PN9P3ggB8X': 'Business Quarterly',
    'price_1QXYI1DWcrI6M6PNNWsj8UkC': 'Starter Yearly',
    'price_1QXYL4DWcrI6M6PNkZozkbn4': 'Pro Yearly',
    'price_1QXYLUDWcrI6M6PNLBAiaT9K': 'Business Yearly',
  };
  
  return priceToPlanMap[priceId] || 'Unknown Plan';
} 