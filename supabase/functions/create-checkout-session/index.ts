// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import Stripe from 'https://esm.sh/stripe@12.0.0?dts';
import { corsHeaders, createJsonResponse, createErrorResponse } from '../index.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get request body
    const { priceId, planName, userId, customerEmail, token, returnUrl } = await req.json();

    // Validate required fields
    if (!priceId || !planName || !customerEmail) {
      return createErrorResponse('Missing required fields: priceId, planName, customerEmail', 400);
    }

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2022-11-15',
    });

    // Check if user already has a Stripe customer ID
    let customerId: string | undefined;
    
    if (userId) {
      const { data: existingSubscription, error: subscriptionError } = await supabaseAdmin
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        throw subscriptionError;
      }

      customerId = existingSubscription?.stripe_customer_id;
    }

    // Create a new Stripe customer if one doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          userId: userId || 'temp_user',
        },
      });

      customerId = customer.id;

      // If there's a userId, save the customer ID to the database
      if (userId) {
        await supabaseAdmin.from('subscriptions').insert({
          user_id: userId,
          stripe_customer_id: customerId,
          plan_id: priceId,
          plan_name: planName,
          status: 'incomplete',
        });
      } else {
        // For temporary users, store their info in a separate table
        await supabaseAdmin.from('temp_users').insert({
          email: customerEmail,
          token: token,
          stripe_customer_id: customerId,
          created_at: new Date().toISOString(),
        });
      }
    }

    // Determine the success URL
    const successUrl = returnUrl 
      ? `${returnUrl}?session_id={CHECKOUT_SESSION_ID}&token=${token || ''}&userId=${userId || ''}`
      : `${Deno.env.get('VITE_APP_URL') || 'http://localhost:5173'}/payment/success?session_id={CHECKOUT_SESSION_ID}&token=${token || ''}&userId=${userId || ''}`;

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: `${new URL(successUrl).origin}/pricing`,
      metadata: {
        userId: userId || '',
        planName,
        token: token || '',
        isTemp: userId ? 'false' : 'true',
        customerEmail,
      },
    });

    // Return the session ID and URL
    return createJsonResponse({
      sessionId: session.id,
      url: session.url,
    }, 200);
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return createErrorResponse(
      error.message || 'An error occurred while creating the checkout session',
      500
    );
  }
}); 