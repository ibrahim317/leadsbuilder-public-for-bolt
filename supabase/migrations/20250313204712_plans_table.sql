-- Create plans table for storing subscription plans
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  priceId TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add index on priceId for faster lookups
CREATE INDEX IF NOT EXISTS idx_plans_price_id ON public.plans (priceId);

-- Enable Row Level Security
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read plans
CREATE POLICY "Anyone can read plans" ON public.plans
FOR SELECT USING (true);

-- Create policy to allow only service role to manage plans
CREATE POLICY "Service role can manage plans" ON public.plans
FOR ALL USING (auth.role() = 'service_role');

-- Insert default plans
INSERT INTO public.plans (name, price, features, priceId, description)
VALUES 
  ('Starter', 29, '["Jusqu''à 100 profils", "Jusqu''à 10 listes", "Support par email"]', 'price_starter', 'Idéal pour les débutants'),
  ('Pro', 49, '["Jusqu''à 500 profils", "Jusqu''à 50 listes", "Support prioritaire", "Exports illimités"]', 'price_pro', 'Pour les professionnels'),
  ('Business', 99, '["Profils illimités", "Listes illimitées", "Support dédié", "Exports illimités", "API access"]', 'price_business', 'Pour les entreprises'); 