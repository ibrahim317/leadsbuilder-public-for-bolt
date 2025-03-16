-- Drop trigger
DROP TRIGGER IF EXISTS set_updated_at ON public.checkout_sessions;

-- Drop policies
DROP POLICY IF EXISTS "Admins can do anything with checkout_sessions" ON public.checkout_sessions;
DROP POLICY IF EXISTS "Service role can do anything with checkout_sessions" ON public.checkout_sessions;

-- Drop table
DROP TABLE IF EXISTS public.checkout_sessions; 