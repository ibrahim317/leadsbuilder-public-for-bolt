-- Create a new table for temporary users during the payment process
CREATE TABLE IF NOT EXISTS public.temp_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT,
  stripe_customer_id TEXT,
  payment_status TEXT DEFAULT 'pending',
  user_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create an index on the email column for faster lookups
CREATE INDEX IF NOT EXISTS idx_temp_users_email ON public.temp_users (email);

-- Create an index on the token column for faster lookups
CREATE INDEX IF NOT EXISTS idx_temp_users_token ON public.temp_users (token);

-- Enable row-level security
ALTER TABLE public.temp_users ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow the service role to manage all rows
CREATE POLICY "Service role can manage all temp users"
  ON public.temp_users
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a table for storing checkout session data
CREATE TABLE IF NOT EXISTS public.checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL UNIQUE,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  user_data JSONB,
  login_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create an index on the session_id column for faster lookups
CREATE INDEX IF NOT EXISTS idx_checkout_sessions_session_id ON public.checkout_sessions (session_id);

-- Enable row-level security
ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow the service role to manage all rows
CREATE POLICY "Service role can manage all checkout sessions"
  ON public.checkout_sessions
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create a table for pricing plans if it doesn't exist
CREATE TABLE IF NOT EXISTS public.pricing_plans (
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

-- Create a table for pricing plan features if it doesn't exist
CREATE TABLE IF NOT EXISTS public.pricing_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pricing_plan_id UUID REFERENCES public.pricing_plans(id),
  name TEXT NOT NULL,
  description TEXT,
  included BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add some example pricing plans if the table is empty
INSERT INTO public.pricing_plans (name, description, price, currency, interval, stripe_price_id, tier, popular)
SELECT 
  'Starter', 
  'Perfect for small businesses just getting started', 
  1900, 
  'EUR', 
  'month', 
  'price_1NcXxXXXXXXXXXXXXXXXXXX', 
  'starter',
  false
WHERE NOT EXISTS (SELECT 1 FROM public.pricing_plans WHERE name = 'Starter')
UNION ALL
SELECT 
  'Pro', 
  'Best for growing businesses needing advanced features', 
  4900, 
  'EUR', 
  'month', 
  'price_2NcXxXXXXXXXXXXXXXXXXXX', 
  'pro',
  true
WHERE NOT EXISTS (SELECT 1 FROM public.pricing_plans WHERE name = 'Pro')
UNION ALL
SELECT 
  'Enterprise', 
  'For large organizations with custom requirements', 
  9900, 
  'EUR', 
  'month', 
  'price_3NcXxXXXXXXXXXXXXXXXXXX', 
  'enterprise',
  false
WHERE NOT EXISTS (SELECT 1 FROM public.pricing_plans WHERE name = 'Enterprise');

-- Make sure the subscription table has all the required fields
ALTER TABLE public.subscriptions 
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS plan_id TEXT,
  ADD COLUMN IF NOT EXISTS plan_name TEXT,
  ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT false; 