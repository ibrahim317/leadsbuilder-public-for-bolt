-- First create the new enum type
DO $$ BEGIN
  CREATE TYPE subscription_tier_new AS ENUM ('starter', 'pro', 'business');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create temporary column and copy data
ALTER TABLE usage_limits ADD COLUMN tier_new subscription_tier_new;

-- Update the temporary column with mapped values
UPDATE usage_limits 
SET tier_new = 
  CASE tier::text
    WHEN 'free' THEN 'starter'::subscription_tier_new
    WHEN 'pro' THEN 'pro'::subscription_tier_new
    WHEN 'enterprise' THEN 'business'::subscription_tier_new
  END;

-- Drop the old column and rename the new one
ALTER TABLE usage_limits DROP COLUMN tier;
ALTER TABLE usage_limits RENAME COLUMN tier_new TO tier;
ALTER TABLE usage_limits ALTER COLUMN tier SET NOT NULL;

-- Do the same for users table
ALTER TABLE users ADD COLUMN subscription_tier_new subscription_tier_new;

UPDATE users 
SET subscription_tier_new = 
  CASE subscription_tier::text
    WHEN 'free' THEN 'starter'::subscription_tier_new
    WHEN 'pro' THEN 'pro'::subscription_tier_new
    WHEN 'enterprise' THEN 'business'::subscription_tier_new
  END;

ALTER TABLE users DROP COLUMN subscription_tier;
ALTER TABLE users RENAME COLUMN subscription_tier_new TO subscription_tier;
ALTER TABLE users ALTER COLUMN subscription_tier SET NOT NULL DEFAULT 'starter'::subscription_tier_new;

-- Do the same for subscriptions table
ALTER TABLE subscriptions ADD COLUMN tier_new subscription_tier_new;

UPDATE subscriptions 
SET tier_new = 
  CASE tier::text
    WHEN 'free' THEN 'starter'::subscription_tier_new
    WHEN 'pro' THEN 'pro'::subscription_tier_new
    WHEN 'enterprise' THEN 'business'::subscription_tier_new
  END;

ALTER TABLE subscriptions DROP COLUMN tier;
ALTER TABLE subscriptions RENAME COLUMN tier_new TO tier;
ALTER TABLE subscriptions ALTER COLUMN tier SET NOT NULL DEFAULT 'starter'::subscription_tier_new;

-- Drop the old type
DROP TYPE subscription_tier;

-- Rename the new type
ALTER TYPE subscription_tier_new RENAME TO subscription_tier;

-- Update the usage limits with new values
TRUNCATE TABLE usage_limits;
INSERT INTO usage_limits (tier, monthly_searches, max_list_profiles, max_crm_profiles) VALUES
  ('starter', 15, 200, 1000),
  ('pro', 30, 2000, 10000),
  ('business', -1, -1, -1);