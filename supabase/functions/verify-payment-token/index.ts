// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import * as jose from 'https://esm.sh/jose@4.14.4';

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
    // Get request body
    const { session_id, token } = await req.json();

    // Validate required fields
    if (!session_id) {
      return new Response(
        JSON.stringify({
          error: 'Missing required field: session_id',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if the session exists and is completed
    const { data: checkoutSession, error: sessionError } = await supabaseAdmin
      .from('checkout_sessions')
      .select('*')
      .eq('session_id', session_id)
      .single();

    if (sessionError || !checkoutSession) {
      return new Response(
        JSON.stringify({
          error: 'Invalid or expired session',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (checkoutSession.payment_status !== 'completed') {
      return new Response(
        JSON.stringify({
          error: 'Payment not completed',
          status: checkoutSession.payment_status,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get the user data from the checkout session
    const userData = checkoutSession.user_data;
    
    if (!userData || !userData.email) {
      return new Response(
        JSON.stringify({
          error: 'User data not found',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if a login token was already generated
    if (checkoutSession.login_token && !token) {
      // Return the existing token
      return new Response(
        JSON.stringify({
          loginToken: checkoutSession.login_token,
          email: userData.email,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // If a token is provided, verify it
    if (token) {
      // Verify the token
      try {
        const secret = new TextEncoder().encode(Deno.env.get('JWT_SECRET') ?? '');
        const { payload } = await jose.jwtVerify(token, secret);
        
        if (payload.session_id !== session_id) {
          throw new Error('Invalid token');
        }

        // Get the user by email
        const { data: users, error: userError } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', userData.email)
          .single();
        
        if (userError || !users) {
          return new Response(
            JSON.stringify({
              error: 'User not found',
            }),
            {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Sign in the user
        const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
          email: userData.email,
          password: userData.password,
        });

        if (signInError) {
          return new Response(
            JSON.stringify({
              error: 'Failed to sign in user',
            }),
            {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        // Return the session
        return new Response(
          JSON.stringify({
            session: signInData.session,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: 'Invalid or expired token',
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Generate a new login token
    const secret = new TextEncoder().encode(Deno.env.get('JWT_SECRET') ?? '');
    const loginToken = await new jose.SignJWT({ 
      session_id,
      email: userData.email,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15m')
      .sign(secret);

    // Store the token in the database
    await supabaseAdmin
      .from('checkout_sessions')
      .update({ login_token: loginToken })
      .eq('session_id', session_id);

    // Return the token
    return new Response(
      JSON.stringify({
        loginToken,
        email: userData.email,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error verifying payment token:', error);

    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred while verifying the payment token',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}); 