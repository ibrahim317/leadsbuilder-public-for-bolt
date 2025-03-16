// deno-lint-ignore-file no-explicit-any
/**
 * Supabase Edge Functions Index
 * 
 * This file serves as a central reference for all Edge Functions in the project.
 * It provides documentation and shared utilities for consistent implementation.
 */

// Common headers for CORS support
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Helper function to create a standard JSON response
 */
export function createJsonResponse(
  data: any, 
  status: number = 200, 
  headers: Record<string, string> = {}
): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json', ...headers },
    }
  );
}

/**
 * Helper function to create an error response
 */
export function createErrorResponse(
  message: string, 
  status: number = 400
): Response {
  return createJsonResponse({ error: message }, status);
}

/**
 * List of available Edge Functions:
 * 
 * 1. create-checkout-session
 *    - Creates a Stripe checkout session for subscription payment
 *    - Parameters: priceId, planName, userId, customerEmail, token, returnUrl
 * 
 * 2. get-checkout-session
 *    - Retrieves details of a Stripe checkout session
 *    - Parameters: sessionId
 * 
 * 3. verify-payment-token
 *    - Verifies payment and generates/validates one-time login token
 *    - Parameters: session_id, token (optional)
 * 
 * 4. stripe-webhook
 *    - Handles Stripe webhook events
 *    - Verifies signature and processes subscription events
 * 
 * 5. create-customer-portal-session
 *    - Creates a Stripe customer portal session for subscription management
 *    - No parameters required, uses authenticated user
 * 
 * 6. cancel-subscription
 *    - Cancels a subscription at period end
 *    - Parameters: subscriptionId (optional, uses user's subscription if not provided)
 * 
 * 7. resume-subscription
 *    - Resumes a canceled subscription
 *    - Parameters: subscriptionId (optional, uses user's subscription if not provided)
 */ 