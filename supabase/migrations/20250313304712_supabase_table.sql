-- Create temp_users table for storing temporary user data during checkout
CREATE TABLE IF NOT EXISTS public.temp_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  phone TEXT,
  activity TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Add index on token for faster lookups
CREATE INDEX IF NOT EXISTS idx_temp_users_token ON public.temp_users (token);

-- Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_temp_users_email ON public.temp_users (email);

-- Add expiration policy to automatically delete expired records
CREATE OR REPLACE FUNCTION delete_expired_temp_users()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.temp_users WHERE expires_at < NOW();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run every hour
DROP TRIGGER IF EXISTS trigger_delete_expired_temp_users ON public.temp_users;
CREATE TRIGGER trigger_delete_expired_temp_users
AFTER INSERT ON public.temp_users
EXECUTE PROCEDURE delete_expired_temp_users();

-- Enable Row Level Security
ALTER TABLE public.temp_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow only service role to access temp_users
CREATE POLICY "Service role can manage temp_users" ON public.temp_users
FOR ALL USING (auth.role() = 'service_role'); 