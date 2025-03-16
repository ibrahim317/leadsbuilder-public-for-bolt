-- Create checkout_sessions table
CREATE TABLE IF NOT EXISTS public.checkout_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL UNIQUE,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  user_data JSONB NOT NULL,
  login_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.checkout_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for admins
CREATE POLICY "Admins can do anything with checkout_sessions"
  ON public.checkout_sessions
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create policy for service role
CREATE POLICY "Service role can do anything with checkout_sessions"
  ON public.checkout_sessions
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.checkout_sessions
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at(); 