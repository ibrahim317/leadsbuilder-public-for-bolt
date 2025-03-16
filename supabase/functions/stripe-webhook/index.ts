// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import Stripe from 'https://esm.sh/stripe@12.0.0?dts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Get the request body
    const body = await req.text();
    
    // Get the signature from the headers
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return new Response(
        JSON.stringify({
          error: 'Missing Stripe signature',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2022-11-15',
    });

    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
    );

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get the subscription
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        // Update the subscription in the database
        await supabaseAdmin
          .from('subscriptions')
          .update({
            stripe_subscription_id: subscription.id,
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('user_id', session.metadata?.userId);

        // Store the checkout session in the database for one-time login
        if (session.metadata?.userId && session.metadata?.token) {
          // Get the temporary user data
          const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(
            session.metadata.userId
          );

          if (!userError && userData?.user) {
            // Store the checkout session with user data
            await supabaseAdmin.from('checkout_sessions').insert({
              session_id: session.id,
              payment_status: 'completed',
              user_data: {
                email: userData.user.email,
                password: userData.user.user_metadata?.password || '',
                name: userData.user.user_metadata?.first_name || '',
                plan_id: session.metadata.planName || '',
              },
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });

            // Update the user to remove the temporary flag and add subscription info
            await supabaseAdmin.auth.admin.updateUserById(session.metadata.userId, {
              user_metadata: {
                ...userData.user.user_metadata,
                is_temp: false,
                subscription_tier: session.metadata.planName || 'paid',
                subscription_status: 'active',
                stripe_customer_id: session.customer as string
              }
            });
          }
        }

        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update the subscription in the database
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update the subscription in the database
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            cancel_at_period_end: false,
          })
          .eq('stripe_subscription_id', subscription.id);

        break;
      }
      // Add more event handlers as needed
    }

    // Return a success response
    return new Response(
      JSON.stringify({ received: true }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error handling webhook:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred while handling the webhook',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}); 