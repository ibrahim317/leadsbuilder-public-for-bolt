# Supabase Edge Functions for LeadsBuilder

This directory contains Supabase Edge Functions for handling Stripe payments and subscriptions.

## Functions

- `create-checkout-session`: Creates a Stripe checkout session for a subscription
- `get-checkout-session`: Retrieves a Stripe checkout session
- `cancel-subscription`: Cancels a subscription at the end of the current period
- `resume-subscription`: Resumes a canceled subscription
- `create-customer-portal-session`: Creates a Stripe customer portal session
- `stripe-webhook`: Handles Stripe webhook events

## Deployment

To deploy these functions to your Supabase project, follow these steps:

1. Install the Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to your Supabase account:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Deploy the functions:
   ```bash
   supabase functions deploy create-checkout-session
   supabase functions deploy get-checkout-session
   supabase functions deploy cancel-subscription
   supabase functions deploy resume-subscription
   supabase functions deploy create-customer-portal-session
   supabase functions deploy stripe-webhook
   ```

5. Set the required environment variables:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Webhook Setup

To set up the Stripe webhook:

1. Go to the Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://[your-project-ref].supabase.co/functions/v1/stripe-webhook`
4. Select the following events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. Copy the signing secret and set it as the `STRIPE_WEBHOOK_SECRET` environment variable

## Payment Flow Implementation

The application implements a payment-first user registration flow where users:

1. Select a pricing plan 
2. Enter registration information
3. Are redirected to Stripe for payment
4. After successful payment, either:
   - Are logged in automatically (if an account already exists)
   - Have their account created and are then logged in (for new users)

### Key Components:

1. **Temporary User Storage**
   - New users are initially stored in the `temp_users` table
   - Contains basic info and a temporary token for identification

2. **Checkout Session**
   - Created via the `create-checkout-session` function
   - Stores metadata about the user and selected plan
   - Redirects to Stripe for payment processing

3. **Webhook Handler**
   - The `stripe-webhook` function processes events from Stripe
   - On successful payment, converts temporary users to real accounts
   - Updates subscription status for existing users

4. **Post-Payment Verification**
   - The `verify-payment-token` function verifies completed payments
   - Generates a one-time login token for the user
   - Provides subscription details to the frontend

### Database Schema:

```sql
-- Temporary user storage during signup process
CREATE TABLE temp_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT,
  stripe_customer_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  user_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Checkout session storage
CREATE TABLE checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  user_data JSONB,
  login_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Subscription storage
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_id text not null,
  plan_name text not null,
  status text not null,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Pricing plans
CREATE TABLE pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  interval TEXT NOT NULL CHECK (interval IN ('month', 'year')),
  stripe_price_id TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'starter', 'pro', 'enterprise')),
  popular BOOLEAN DEFAULT false,
  custom_price BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies
alter table subscriptions enable row level security;

-- Allow users to read their own subscriptions
create policy "Users can read their own subscriptions"
  on subscriptions for select
  using (auth.uid() = user_id);

-- Allow the service role to manage all subscriptions
create policy "Service role can manage all subscriptions"
  on subscriptions for all
  using (auth.jwt() ->> 'role' = 'service_role');
``` 