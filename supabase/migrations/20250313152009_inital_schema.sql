create type "public"."message_type" as enum ('1er_message', '1er_followup', '2eme_followup', '3eme_followup', '4eme_followup', '5eme_followup', 'rdv', 'pas_interesse', 'non_contacté');

create type "public"."subscription_status" as enum ('active', 'canceled', 'past_due', 'unpaid');

create type "public"."subscription_tier" as enum ('starter', 'pro', 'business');

create type "public"."user_role" as enum ('user', 'admin', 'moderator');

create table "public"."campaign_profiles" (
    "id" bigint generated always as identity not null,
    "profile_id" bigint,
    "user_id" uuid,
    "list_id" bigint,
    "created_at" timestamp with time zone default now(),
    "archived" boolean default false,
    "archived_at" timestamp with time zone,
    "start_date" timestamp with time zone default now()
);


alter table "public"."campaign_profiles" enable row level security;

create table "public"."chat_messages" (
    "id" uuid not null default uuid_generate_v4(),
    "room_id" uuid,
    "user_id" uuid,
    "message" text not null,
    "created_at" timestamp with time zone default now(),
    "is_staff" boolean default false
);


alter table "public"."chat_messages" enable row level security;

create table "public"."chat_rooms" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "agent_id" uuid,
    "status" text not null default 'active'::text,
    "created_at" timestamp with time zone default now(),
    "ended_at" timestamp with time zone
);


alter table "public"."chat_rooms" enable row level security;

create table "public"."conversion_events" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "event_type" text not null,
    "source" text,
    "created_at" timestamp with time zone default now(),
    "metadata" jsonb default '{}'::jsonb
);


alter table "public"."conversion_events" enable row level security;

create table "public"."email_templates" (
    "id" uuid not null default gen_random_uuid(),
    "name" character varying(255) not null,
    "subject" character varying(255) not null,
    "content" text not null,
    "variables" jsonb not null default '[]'::jsonb,
    "created_at" timestamp with time zone default now(),
    "last_modified" timestamp with time zone default now()
);


alter table "public"."email_templates" enable row level security;

create table "public"."list_profiles" (
    "list_id" bigint not null,
    "profile_id" bigint not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."list_profiles" enable row level security;

create table "public"."lists" (
    "id" bigint generated always as identity not null,
    "name" text not null,
    "user_id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."lists" enable row level security;

create table "public"."messages" (
    "id" bigint generated always as identity not null,
    "profile_id" bigint,
    "type" text not null,
    "sent_at" timestamp with time zone not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."messages" enable row level security;

create table "public"."profiles" (
    "id" bigint generated always as identity not null,
    "instagram_url" text,
    "username" text,
    "full_name" text,
    "bio" text,
    "website" text,
    "email" text,
    "phone" text,
    "country" text default 'France'::text,
    "city" text,
    "language" text default 'French'::text,
    "followers" integer default 0,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."profiles" enable row level security;

create table "public"."referrals" (
    "id" uuid not null default uuid_generate_v4(),
    "referrer_id" uuid,
    "referred_id" uuid,
    "status" text not null default 'pending'::text,
    "created_at" timestamp with time zone default now(),
    "converted_at" timestamp with time zone,
    "reward_status" text default 'pending'::text,
    "code" text
);


alter table "public"."referrals" enable row level security;


create table "public"."subscription_payments" (
    "id" uuid not null default gen_random_uuid(),
    "subscription_id" uuid,
    "amount" integer not null,
    "currency" text not null default 'EUR'::text,
    "status" text not null,
    "payment_method" text not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."subscription_payments" enable row level security;

create table "public"."subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "status" subscription_status not null default 'active'::subscription_status,
    "start_date" timestamp with time zone not null default now(),
    "end_date" timestamp with time zone,
    "trial_end_date" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "tier" subscription_tier not null default 'starter'::subscription_tier,
    "current_period_start" timestamp with time zone,
    "current_period_end" timestamp with time zone
);


alter table "public"."subscriptions" enable row level security;

create table "public"."ticket_messages" (
    "id" uuid not null default uuid_generate_v4(),
    "ticket_id" uuid,
    "user_id" uuid,
    "message" text not null,
    "created_at" timestamp with time zone default now(),
    "is_staff" boolean default false
);


alter table "public"."ticket_messages" enable row level security;

create table "public"."tickets" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid,
    "subject" text not null,
    "status" text not null default 'open'::text,
    "priority" text not null default 'medium'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "assigned_to" uuid,
    "category" text not null
);


alter table "public"."tickets" enable row level security;

create table "public"."tracking_config" (
    "id" bigint not null default 1,
    "facebook_pixel_id" text,
    "tiktok_pixel_id" text,
    "google_analytics_id" text,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
);


alter table "public"."tracking_config" enable row level security;

create table "public"."usage_limits" (
    "monthly_searches" integer not null,
    "max_list_profiles" integer not null,
    "max_crm_profiles" integer not null,
    "tier" subscription_tier not null default 'starter'::subscription_tier
);


alter table "public"."usage_limits" enable row level security;

create table "public"."user_roles" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "role" user_role default 'user'::user_role,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."user_roles" enable row level security;

create table "public"."user_usage" (
    "user_id" uuid not null,
    "monthly_searches_used" integer default 0,
    "list_profiles_count" integer default 0,
    "crm_profiles_count" integer default 0,
    "last_reset_date" date not null default CURRENT_DATE
);


alter table "public"."user_usage" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "email" text not null,
    "subscription_status" subscription_status default 'active'::subscription_status,
    "subscription_end_date" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "subscription_tier" subscription_tier not null default 'starter'::subscription_tier,
    "email_verified" boolean default false
);


alter table "public"."users" enable row level security;

CREATE INDEX campaign_profiles_list_id_idx ON public.campaign_profiles USING btree (list_id);

CREATE UNIQUE INDEX campaign_profiles_pkey ON public.campaign_profiles USING btree (id);

CREATE INDEX campaign_profiles_profile_id_idx ON public.campaign_profiles USING btree (profile_id);

CREATE UNIQUE INDEX campaign_profiles_profile_id_user_id_key ON public.campaign_profiles USING btree (profile_id, user_id);

CREATE INDEX campaign_profiles_user_id_idx ON public.campaign_profiles USING btree (user_id);

CREATE UNIQUE INDEX chat_messages_pkey ON public.chat_messages USING btree (id);

CREATE UNIQUE INDEX chat_rooms_pkey ON public.chat_rooms USING btree (id);

CREATE UNIQUE INDEX conversion_events_pkey ON public.conversion_events USING btree (id);

CREATE UNIQUE INDEX email_templates_name_key ON public.email_templates USING btree (name);

CREATE UNIQUE INDEX email_templates_pkey ON public.email_templates USING btree (id);

CREATE UNIQUE INDEX list_profiles_pkey ON public.list_profiles USING btree (list_id, profile_id);

CREATE UNIQUE INDEX lists_pkey ON public.lists USING btree (id);

CREATE UNIQUE INDEX messages_pkey ON public.messages USING btree (id);

CREATE INDEX messages_profile_id_idx ON public.messages USING btree (profile_id);

CREATE INDEX messages_sent_at_idx ON public.messages USING btree (sent_at);

CREATE INDEX messages_type_idx ON public.messages USING btree (type);

CREATE INDEX profiles_city_idx ON public.profiles USING btree (city);

CREATE INDEX profiles_followers_idx ON public.profiles USING btree (followers);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE INDEX profiles_username_idx ON public.profiles USING btree (username);

CREATE UNIQUE INDEX referrals_code_key ON public.referrals USING btree (code);

CREATE UNIQUE INDEX referrals_pkey ON public.referrals USING btree (id);


CREATE UNIQUE INDEX subscription_payments_pkey ON public.subscription_payments USING btree (id);

CREATE INDEX subscription_payments_subscription_id_idx ON public.subscription_payments USING btree (subscription_id);

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE INDEX subscriptions_user_id_idx ON public.subscriptions USING btree (user_id);

CREATE UNIQUE INDEX subscriptions_user_id_key ON public.subscriptions USING btree (user_id);

CREATE UNIQUE INDEX ticket_messages_pkey ON public.ticket_messages USING btree (id);

CREATE UNIQUE INDEX tickets_pkey ON public.tickets USING btree (id);

CREATE UNIQUE INDEX tracking_config_pkey ON public.tracking_config USING btree (id);

CREATE UNIQUE INDEX user_roles_pkey ON public.user_roles USING btree (id);

CREATE UNIQUE INDEX user_roles_user_id_role_key ON public.user_roles USING btree (user_id, role);

CREATE INDEX user_usage_last_reset_date_idx ON public.user_usage USING btree (last_reset_date);

CREATE UNIQUE INDEX user_usage_pkey ON public.user_usage USING btree (user_id);

CREATE INDEX users_id_idx ON public.users USING btree (id);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."campaign_profiles" add constraint "campaign_profiles_pkey" PRIMARY KEY using index "campaign_profiles_pkey";

alter table "public"."chat_messages" add constraint "chat_messages_pkey" PRIMARY KEY using index "chat_messages_pkey";

alter table "public"."chat_rooms" add constraint "chat_rooms_pkey" PRIMARY KEY using index "chat_rooms_pkey";

alter table "public"."conversion_events" add constraint "conversion_events_pkey" PRIMARY KEY using index "conversion_events_pkey";

alter table "public"."email_templates" add constraint "email_templates_pkey" PRIMARY KEY using index "email_templates_pkey";

alter table "public"."list_profiles" add constraint "list_profiles_pkey" PRIMARY KEY using index "list_profiles_pkey";

alter table "public"."lists" add constraint "lists_pkey" PRIMARY KEY using index "lists_pkey";

alter table "public"."messages" add constraint "messages_pkey" PRIMARY KEY using index "messages_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."referrals" add constraint "referrals_pkey" PRIMARY KEY using index "referrals_pkey";

alter table "public"."subscription_payments" add constraint "subscription_payments_pkey" PRIMARY KEY using index "subscription_payments_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."ticket_messages" add constraint "ticket_messages_pkey" PRIMARY KEY using index "ticket_messages_pkey";

alter table "public"."tickets" add constraint "tickets_pkey" PRIMARY KEY using index "tickets_pkey";

alter table "public"."tracking_config" add constraint "tracking_config_pkey" PRIMARY KEY using index "tracking_config_pkey";

alter table "public"."user_roles" add constraint "user_roles_pkey" PRIMARY KEY using index "user_roles_pkey";

alter table "public"."user_usage" add constraint "user_usage_pkey" PRIMARY KEY using index "user_usage_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."campaign_profiles" add constraint "campaign_profiles_list_id_fkey" FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE SET NULL not valid;

alter table "public"."campaign_profiles" validate constraint "campaign_profiles_list_id_fkey";

alter table "public"."campaign_profiles" add constraint "campaign_profiles_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."campaign_profiles" validate constraint "campaign_profiles_profile_id_fkey";

alter table "public"."campaign_profiles" add constraint "campaign_profiles_profile_id_user_id_key" UNIQUE using index "campaign_profiles_profile_id_user_id_key";

alter table "public"."campaign_profiles" add constraint "campaign_profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."campaign_profiles" validate constraint "campaign_profiles_user_id_fkey";

alter table "public"."chat_messages" add constraint "chat_messages_room_id_fkey" FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_room_id_fkey";

alter table "public"."chat_messages" add constraint "chat_messages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_user_id_fkey";

alter table "public"."chat_rooms" add constraint "chat_rooms_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES auth.users(id) not valid;

alter table "public"."chat_rooms" validate constraint "chat_rooms_agent_id_fkey";

alter table "public"."chat_rooms" add constraint "chat_rooms_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."chat_rooms" validate constraint "chat_rooms_user_id_fkey";

alter table "public"."conversion_events" add constraint "conversion_events_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."conversion_events" validate constraint "conversion_events_user_id_fkey";

alter table "public"."email_templates" add constraint "email_templates_name_key" UNIQUE using index "email_templates_name_key";

alter table "public"."list_profiles" add constraint "list_profiles_list_id_fkey" FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE not valid;

alter table "public"."list_profiles" validate constraint "list_profiles_list_id_fkey";

alter table "public"."list_profiles" add constraint "list_profiles_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."list_profiles" validate constraint "list_profiles_profile_id_fkey";

alter table "public"."lists" add constraint "lists_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."lists" validate constraint "lists_user_id_fkey";

alter table "public"."messages" add constraint "messages_profile_id_fkey" FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."messages" validate constraint "messages_profile_id_fkey";

alter table "public"."messages" add constraint "messages_type_check" CHECK ((type = ANY (ARRAY['1er_message'::text, '1er_followup'::text, '2eme_followup'::text, '3eme_followup'::text, '4eme_followup'::text, '5eme_followup'::text, 'rdv'::text, 'pas_interesse'::text]))) not valid;

alter table "public"."messages" validate constraint "messages_type_check";

alter table "public"."referrals" add constraint "referrals_code_key" UNIQUE using index "referrals_code_key";

alter table "public"."referrals" add constraint "referrals_referred_id_fkey" FOREIGN KEY (referred_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."referrals" validate constraint "referrals_referred_id_fkey";

alter table "public"."referrals" add constraint "referrals_referrer_id_fkey" FOREIGN KEY (referrer_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."referrals" validate constraint "referrals_referrer_id_fkey";

alter table "public"."subscription_payments" add constraint "subscription_payments_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE not valid;

alter table "public"."subscription_payments" validate constraint "subscription_payments_subscription_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_key" UNIQUE using index "subscriptions_user_id_key";

alter table "public"."ticket_messages" add constraint "ticket_messages_ticket_id_fkey" FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE not valid;

alter table "public"."ticket_messages" validate constraint "ticket_messages_ticket_id_fkey";

alter table "public"."ticket_messages" add constraint "ticket_messages_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."ticket_messages" validate constraint "ticket_messages_user_id_fkey";

alter table "public"."tickets" add constraint "tickets_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES auth.users(id) not valid;

alter table "public"."tickets" validate constraint "tickets_assigned_to_fkey";

alter table "public"."tickets" add constraint "tickets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."tickets" validate constraint "tickets_user_id_fkey";

alter table "public"."tracking_config" add constraint "single_row" CHECK ((id = 1)) not valid;

alter table "public"."tracking_config" validate constraint "single_row";

alter table "public"."usage_limits" add constraint "usage_limits_max_crm_profiles_check" CHECK ((max_crm_profiles >= '-1'::integer)) not valid;

alter table "public"."usage_limits" validate constraint "usage_limits_max_crm_profiles_check";

alter table "public"."usage_limits" add constraint "usage_limits_max_list_profiles_check" CHECK ((max_list_profiles >= '-1'::integer)) not valid;

alter table "public"."usage_limits" validate constraint "usage_limits_max_list_profiles_check";

alter table "public"."usage_limits" add constraint "usage_limits_monthly_searches_check" CHECK ((monthly_searches >= '-1'::integer)) not valid;

alter table "public"."usage_limits" validate constraint "usage_limits_monthly_searches_check";

alter table "public"."user_roles" add constraint "user_roles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_roles" validate constraint "user_roles_user_id_fkey";

alter table "public"."user_roles" add constraint "user_roles_user_id_role_key" UNIQUE using index "user_roles_user_id_role_key";

alter table "public"."user_usage" add constraint "user_usage_crm_profiles_count_check" CHECK ((crm_profiles_count >= 0)) not valid;

alter table "public"."user_usage" validate constraint "user_usage_crm_profiles_count_check";

alter table "public"."user_usage" add constraint "user_usage_list_profiles_count_check" CHECK ((list_profiles_count >= 0)) not valid;

alter table "public"."user_usage" validate constraint "user_usage_list_profiles_count_check";

alter table "public"."user_usage" add constraint "user_usage_monthly_searches_used_check" CHECK ((monthly_searches_used >= 0)) not valid;

alter table "public"."user_usage" validate constraint "user_usage_monthly_searches_used_check";

alter table "public"."user_usage" add constraint "user_usage_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_usage" validate constraint "user_usage_user_id_fkey";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."users" validate constraint "users_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_list_to_campaign(p_list_id bigint, p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO campaign_profiles (profile_id, user_id, list_id)
  SELECT DISTINCT lp.profile_id, p_user_id, p_list_id
  FROM list_profiles lp
  JOIN lists l ON l.id = lp.list_id
  WHERE l.id = p_list_id
  AND l.user_id = p_user_id
  ON CONFLICT (profile_id, user_id) 
  DO UPDATE SET list_id = EXCLUDED.list_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.add_role(user_id uuid, role user_role)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO user_roles (user_id, role)
    VALUES ($1, $2)
    ON CONFLICT (user_id, role) DO NOTHING;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.archive_campaign_profiles()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE campaign_profiles
  SET 
    archived = true,
    archived_at = now()
  WHERE list_id = OLD.id;
  
  RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.cancel_subscription(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE subscriptions
  SET 
    status = 'canceled',
    end_date = COALESCE(trial_end_date, now() + '30 days'::interval),
    updated_at = now()
  WHERE user_id = p_user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_and_add_admin_role()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    user_exists boolean;
BEGIN
    -- Vérifier si l'utilisateur a déjà le rôle admin
    SELECT EXISTS (
        SELECT 1 
        FROM user_roles ur
        JOIN auth.users u ON ur.user_id = u.id
        WHERE ur.role = 'admin'
    ) INTO user_exists;

    -- Si aucun admin n'existe, ajouter le rôle admin au premier utilisateur
    IF NOT user_exists THEN
        INSERT INTO user_roles (user_id, role)
        SELECT id, 'admin'
        FROM auth.users
        ORDER BY created_at
        LIMIT 1;
        
        RAISE NOTICE 'Rôle admin ajouté au premier utilisateur';
    ELSE
        RAISE NOTICE 'Un utilisateur admin existe déjà';
    END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_crm_profile_limit(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_tier text;
    profile_limit integer;
    current_count integer;
BEGIN
    -- Get user's subscription tier
    SELECT subscription_tier INTO user_tier
    FROM users WHERE id = user_id;
    
    -- Get profile limit for tier
    SELECT max_crm_profiles INTO profile_limit
    FROM usage_limits WHERE tier = user_tier;
    
    -- If business tier or unlimited (-1), return true
    IF user_tier = 'business' OR profile_limit = -1 THEN
        RETURN true;
    END IF;
    
    -- Get current profile count
    SELECT crm_profiles_count INTO current_count
    FROM user_usage WHERE user_id = user_id;
    
    -- Return true if under limit
    RETURN COALESCE(current_count, 0) < profile_limit;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_list_profile_limit(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_tier text;
    profile_limit integer;
    current_count integer;
BEGIN
    -- Get user's subscription tier
    SELECT subscription_tier INTO user_tier
    FROM users WHERE id = user_id;
    
    -- Get profile limit for tier
    SELECT max_list_profiles INTO profile_limit
    FROM usage_limits WHERE tier = user_tier;
    
    -- If business tier or unlimited (-1), return true
    IF user_tier = 'business' OR profile_limit = -1 THEN
        RETURN true;
    END IF;
    
    -- Get current profile count
    SELECT list_profiles_count INTO current_count
    FROM user_usage WHERE user_id = user_id;
    
    -- Return true if under limit
    RETURN COALESCE(current_count, 0) < profile_limit;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_search_limit(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    user_tier text;
    monthly_limit integer;
    current_usage integer;
    last_reset timestamp with time zone;
BEGIN
    -- Get user's subscription tier
    SELECT subscription_tier INTO user_tier
    FROM users WHERE id = user_id;
    
    -- Get monthly limit for tier
    SELECT monthly_searches INTO monthly_limit
    FROM usage_limits WHERE tier = user_tier;
    
    -- If business tier or unlimited (-1), return true
    IF user_tier = 'business' OR monthly_limit = -1 THEN
        RETURN true;
    END IF;
    
    -- Get current usage and last reset date
    SELECT monthly_searches_used, last_reset_date 
    INTO current_usage, last_reset
    FROM user_usage WHERE user_id = user_id;
    
    -- If it's been a month since last reset, reset the counter
    IF last_reset < date_trunc('month', now()) THEN
        UPDATE user_usage 
        SET monthly_searches_used = 0,
            last_reset_date = now()
        WHERE user_id = user_id;
        RETURN true;
    END IF;
    
    -- Return true if under limit
    RETURN COALESCE(current_usage, 0) < monthly_limit;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.check_subscription_status(p_user_id uuid)
 RETURNS record
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  result record;
BEGIN
  SELECT 
    s.tier,
    s.status,
    s.trial_end_date,
    s.end_date,
    CASE 
      WHEN s.trial_end_date IS NOT NULL AND s.trial_end_date > now() THEN true
      ELSE false
    END as is_trial,
    CASE 
      WHEN s.status = 'active' AND (s.end_date IS NULL OR s.end_date > now()) THEN true
      ELSE false
    END as is_active
  INTO result
  FROM subscriptions s
  WHERE s.user_id = p_user_id;

  RETURN result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.count_profiles(bio_filter text DEFAULT NULL::text, name_filter text DEFAULT NULL::text)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  total_count integer;
BEGIN
  IF bio_filter IS NULL AND name_filter IS NULL THEN
    -- Aucun filtre, compter tous les profils
    SELECT COUNT(*) INTO total_count FROM profiles;
  ELSIF bio_filter IS NOT NULL AND name_filter IS NULL THEN
    -- Filtre sur bio uniquement
    SELECT COUNT(*) INTO total_count FROM profiles 
    WHERE bio ILIKE '%' || bio_filter || '%';
  ELSIF bio_filter IS NULL AND name_filter IS NOT NULL THEN
    -- Filtre sur nom uniquement
    SELECT COUNT(*) INTO total_count FROM profiles 
    WHERE username ILIKE '%' || name_filter || '%' 
    OR full_name ILIKE '%' || name_filter || '%';
  ELSE
    -- Les deux filtres
    SELECT COUNT(*) INTO total_count FROM profiles 
    WHERE (bio ILIKE '%' || bio_filter || '%')
    AND (username ILIKE '%' || name_filter || '%' 
         OR full_name ILIKE '%' || name_filter || '%');
  END IF;
  
  RETURN total_count;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.create_subscription(p_user_id uuid, p_tier subscription_tier, p_trial_days integer DEFAULT 14)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_subscription_id uuid;
BEGIN
  INSERT INTO subscriptions (
    user_id,
    tier,
    status,
    start_date,
    trial_end_date
  )
  VALUES (
    p_user_id,
    p_tier,
    'active',
    now(),
    CASE WHEN p_trial_days > 0 THEN now() + (p_trial_days || ' days')::interval ELSE null END
  )
  RETURNING id INTO v_subscription_id;

  RETURN v_subscription_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.generate_referral_code()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
    code TEXT;
    exists_already BOOLEAN;
BEGIN
    LOOP
        -- Générer un code aléatoire de 8 caractères
        code := UPPER(SUBSTRING(MD5(''||NOW()::TEXT||RANDOM()::TEXT) FOR 8));
        
        -- Vérifier si le code existe déjà
        SELECT EXISTS (
            SELECT 1 FROM referrals WHERE referrals.code = code
        ) INTO exists_already;
        
        -- Sortir de la boucle si le code est unique
        EXIT WHEN NOT exists_already;
    END LOOP;
    
    RETURN code;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_campaign_profiles_count(p_user_id uuid)
 RETURNS bigint
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM campaign_profiles
    WHERE user_id = p_user_id
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_subscription_limits(p_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_tier subscription_tier;
BEGIN
  SELECT tier INTO v_tier
  FROM subscriptions
  WHERE user_id = p_user_id;

  RETURN CASE v_tier
    WHEN 'free' THEN jsonb_build_object(
      'max_profiles', 100,
      'max_lists', 1,
      'advanced_search', false,
      'export_allowed', false
    )
    WHEN 'pro' THEN jsonb_build_object(
      'max_profiles', -1,
      'max_lists', -1,
      'advanced_search', true,
      'export_allowed', true
    )
    WHEN 'enterprise' THEN jsonb_build_object(
      'max_profiles', -1,
      'max_lists', -1,
      'advanced_search', true,
      'export_allowed', true
    )
    ELSE jsonb_build_object(
      'max_profiles', 0,
      'max_lists', 0,
      'advanced_search', false,
      'export_allowed', false
    )
  END;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_usage_info(p_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_tier subscription_tier;
  v_limits jsonb;
  v_usage jsonb;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO v_tier
  FROM users
  WHERE id = p_user_id;

  IF v_tier IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- Get limits
  SELECT jsonb_build_object(
    'monthly_searches', monthly_searches,
    'max_list_profiles', max_list_profiles,
    'max_crm_profiles', max_crm_profiles
  )
  INTO v_limits
  FROM usage_limits
  WHERE tier = v_tier;

  -- Get usage
  SELECT jsonb_build_object(
    'monthly_searches_used', COALESCE(monthly_searches_used, 0),
    'list_profiles_count', COALESCE(list_profiles_count, 0),
    'crm_profiles_count', COALESCE(crm_profiles_count, 0)
  )
  INTO v_usage
  FROM user_usage
  WHERE user_id = p_user_id;

  -- Create empty usage if none exists
  IF v_usage IS NULL THEN
    v_usage := jsonb_build_object(
      'monthly_searches_used', 0,
      'list_profiles_count', 0,
      'crm_profiles_count', 0
    );
  END IF;

  RETURN jsonb_build_object(
    'limits', v_limits,
    'usage', v_usage
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_limits(p_user_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_tier subscription_tier;
  v_limits jsonb;
BEGIN
  -- Récupérer le niveau d'abonnement de l'utilisateur
  SELECT subscription_tier INTO v_tier
  FROM users
  WHERE id = p_user_id;

  -- Récupérer les limites
  SELECT jsonb_build_object(
    'monthly_searches', monthly_searches,
    'max_list_profiles', max_list_profiles,
    'max_crm_profiles', max_crm_profiles
  ) INTO v_limits
  FROM usage_limits
  WHERE tier = v_tier;

  RETURN v_limits;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (new.id, new.email);
    RETURN new;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.has_role(role user_role)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND user_roles.role = $1
    );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.increment_search_count(user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    can_search boolean;
BEGIN
    -- Check if user can perform search
    can_search := public.check_search_limit(user_id);
    
    IF can_search THEN
        -- Increment the counter
        UPDATE user_usage 
        SET monthly_searches_used = COALESCE(monthly_searches_used, 0) + 1,
            updated_at = now()
        WHERE user_id = user_id;
        
        -- Create usage record if it doesn't exist
        IF NOT FOUND THEN
            INSERT INTO user_usage (user_id, monthly_searches_used)
            VALUES (user_id, 1);
        END IF;
    END IF;
    
    RETURN can_search;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_profile_in_campaign(p_profile_id bigint, p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM campaign_profiles
    WHERE profile_id = p_profile_id
    AND user_id = p_user_id
  );
END;
$function$
;

CREATE OR REPLACE FUNCTION public.remove_from_campaign(p_profile_id bigint, p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  DELETE FROM campaign_profiles
  WHERE profile_id = p_profile_id
  AND user_id = p_user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.sync_auth_users()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Synchroniser les utilisateurs existants
  INSERT INTO users (
    id,
    email,
    subscription_tier,
    subscription_status,
    created_at,
    updated_at
  )
  SELECT
    au.id,
    au.email,
    COALESCE(
      (au.raw_user_meta_data->>'subscription_tier')::subscription_tier,
      'free'::subscription_tier
    ),
    'active'::subscription_status,
    au.created_at,
    now()
  FROM auth.users au
  LEFT JOIN users u ON u.id = au.id
  WHERE u.id IS NULL;

  -- Mettre à jour les emails des utilisateurs existants
  UPDATE users u
  SET
    email = au.email,
    updated_at = now()
  FROM auth.users au
  WHERE u.id = au.id
  AND u.email != au.email;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_subscription_tier(p_user_id uuid, p_tier subscription_tier)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  UPDATE subscriptions
  SET 
    tier = p_tier,
    updated_at = now()
  WHERE user_id = p_user_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_subscription_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."campaign_profiles" to "anon";

grant insert on table "public"."campaign_profiles" to "anon";

grant references on table "public"."campaign_profiles" to "anon";

grant select on table "public"."campaign_profiles" to "anon";

grant trigger on table "public"."campaign_profiles" to "anon";

grant truncate on table "public"."campaign_profiles" to "anon";

grant update on table "public"."campaign_profiles" to "anon";

grant delete on table "public"."campaign_profiles" to "authenticated";

grant insert on table "public"."campaign_profiles" to "authenticated";

grant references on table "public"."campaign_profiles" to "authenticated";

grant select on table "public"."campaign_profiles" to "authenticated";

grant trigger on table "public"."campaign_profiles" to "authenticated";

grant truncate on table "public"."campaign_profiles" to "authenticated";

grant update on table "public"."campaign_profiles" to "authenticated";

grant delete on table "public"."campaign_profiles" to "service_role";

grant insert on table "public"."campaign_profiles" to "service_role";

grant references on table "public"."campaign_profiles" to "service_role";

grant select on table "public"."campaign_profiles" to "service_role";

grant trigger on table "public"."campaign_profiles" to "service_role";

grant truncate on table "public"."campaign_profiles" to "service_role";

grant update on table "public"."campaign_profiles" to "service_role";

grant delete on table "public"."chat_messages" to "anon";

grant insert on table "public"."chat_messages" to "anon";

grant references on table "public"."chat_messages" to "anon";

grant select on table "public"."chat_messages" to "anon";

grant trigger on table "public"."chat_messages" to "anon";

grant truncate on table "public"."chat_messages" to "anon";

grant update on table "public"."chat_messages" to "anon";

grant delete on table "public"."chat_messages" to "authenticated";

grant insert on table "public"."chat_messages" to "authenticated";

grant references on table "public"."chat_messages" to "authenticated";

grant select on table "public"."chat_messages" to "authenticated";

grant trigger on table "public"."chat_messages" to "authenticated";

grant truncate on table "public"."chat_messages" to "authenticated";

grant update on table "public"."chat_messages" to "authenticated";

grant delete on table "public"."chat_messages" to "service_role";

grant insert on table "public"."chat_messages" to "service_role";

grant references on table "public"."chat_messages" to "service_role";

grant select on table "public"."chat_messages" to "service_role";

grant trigger on table "public"."chat_messages" to "service_role";

grant truncate on table "public"."chat_messages" to "service_role";

grant update on table "public"."chat_messages" to "service_role";

grant delete on table "public"."chat_rooms" to "anon";

grant insert on table "public"."chat_rooms" to "anon";

grant references on table "public"."chat_rooms" to "anon";

grant select on table "public"."chat_rooms" to "anon";

grant trigger on table "public"."chat_rooms" to "anon";

grant truncate on table "public"."chat_rooms" to "anon";

grant update on table "public"."chat_rooms" to "anon";

grant delete on table "public"."chat_rooms" to "authenticated";

grant insert on table "public"."chat_rooms" to "authenticated";

grant references on table "public"."chat_rooms" to "authenticated";

grant select on table "public"."chat_rooms" to "authenticated";

grant trigger on table "public"."chat_rooms" to "authenticated";

grant truncate on table "public"."chat_rooms" to "authenticated";

grant update on table "public"."chat_rooms" to "authenticated";

grant delete on table "public"."chat_rooms" to "service_role";

grant insert on table "public"."chat_rooms" to "service_role";

grant references on table "public"."chat_rooms" to "service_role";

grant select on table "public"."chat_rooms" to "service_role";

grant trigger on table "public"."chat_rooms" to "service_role";

grant truncate on table "public"."chat_rooms" to "service_role";

grant update on table "public"."chat_rooms" to "service_role";

grant delete on table "public"."conversion_events" to "anon";

grant insert on table "public"."conversion_events" to "anon";

grant references on table "public"."conversion_events" to "anon";

grant select on table "public"."conversion_events" to "anon";

grant trigger on table "public"."conversion_events" to "anon";

grant truncate on table "public"."conversion_events" to "anon";

grant update on table "public"."conversion_events" to "anon";

grant delete on table "public"."conversion_events" to "authenticated";

grant insert on table "public"."conversion_events" to "authenticated";

grant references on table "public"."conversion_events" to "authenticated";

grant select on table "public"."conversion_events" to "authenticated";

grant trigger on table "public"."conversion_events" to "authenticated";

grant truncate on table "public"."conversion_events" to "authenticated";

grant update on table "public"."conversion_events" to "authenticated";

grant delete on table "public"."conversion_events" to "service_role";

grant insert on table "public"."conversion_events" to "service_role";

grant references on table "public"."conversion_events" to "service_role";

grant select on table "public"."conversion_events" to "service_role";

grant trigger on table "public"."conversion_events" to "service_role";

grant truncate on table "public"."conversion_events" to "service_role";

grant update on table "public"."conversion_events" to "service_role";

grant delete on table "public"."email_templates" to "anon";

grant insert on table "public"."email_templates" to "anon";

grant references on table "public"."email_templates" to "anon";

grant select on table "public"."email_templates" to "anon";

grant trigger on table "public"."email_templates" to "anon";

grant truncate on table "public"."email_templates" to "anon";

grant update on table "public"."email_templates" to "anon";

grant delete on table "public"."email_templates" to "authenticated";

grant insert on table "public"."email_templates" to "authenticated";

grant references on table "public"."email_templates" to "authenticated";

grant select on table "public"."email_templates" to "authenticated";

grant trigger on table "public"."email_templates" to "authenticated";

grant truncate on table "public"."email_templates" to "authenticated";

grant update on table "public"."email_templates" to "authenticated";

grant delete on table "public"."email_templates" to "service_role";

grant insert on table "public"."email_templates" to "service_role";

grant references on table "public"."email_templates" to "service_role";

grant select on table "public"."email_templates" to "service_role";

grant trigger on table "public"."email_templates" to "service_role";

grant truncate on table "public"."email_templates" to "service_role";

grant update on table "public"."email_templates" to "service_role";

grant delete on table "public"."list_profiles" to "anon";

grant insert on table "public"."list_profiles" to "anon";

grant references on table "public"."list_profiles" to "anon";

grant select on table "public"."list_profiles" to "anon";

grant trigger on table "public"."list_profiles" to "anon";

grant truncate on table "public"."list_profiles" to "anon";

grant update on table "public"."list_profiles" to "anon";

grant delete on table "public"."list_profiles" to "authenticated";

grant insert on table "public"."list_profiles" to "authenticated";

grant references on table "public"."list_profiles" to "authenticated";

grant select on table "public"."list_profiles" to "authenticated";

grant trigger on table "public"."list_profiles" to "authenticated";

grant truncate on table "public"."list_profiles" to "authenticated";

grant update on table "public"."list_profiles" to "authenticated";

grant delete on table "public"."list_profiles" to "service_role";

grant insert on table "public"."list_profiles" to "service_role";

grant references on table "public"."list_profiles" to "service_role";

grant select on table "public"."list_profiles" to "service_role";

grant trigger on table "public"."list_profiles" to "service_role";

grant truncate on table "public"."list_profiles" to "service_role";

grant update on table "public"."list_profiles" to "service_role";

grant delete on table "public"."lists" to "anon";

grant insert on table "public"."lists" to "anon";

grant references on table "public"."lists" to "anon";

grant select on table "public"."lists" to "anon";

grant trigger on table "public"."lists" to "anon";

grant truncate on table "public"."lists" to "anon";

grant update on table "public"."lists" to "anon";

grant delete on table "public"."lists" to "authenticated";

grant insert on table "public"."lists" to "authenticated";

grant references on table "public"."lists" to "authenticated";

grant select on table "public"."lists" to "authenticated";

grant trigger on table "public"."lists" to "authenticated";

grant truncate on table "public"."lists" to "authenticated";

grant update on table "public"."lists" to "authenticated";

grant delete on table "public"."lists" to "service_role";

grant insert on table "public"."lists" to "service_role";

grant references on table "public"."lists" to "service_role";

grant select on table "public"."lists" to "service_role";

grant trigger on table "public"."lists" to "service_role";

grant truncate on table "public"."lists" to "service_role";

grant update on table "public"."lists" to "service_role";

grant delete on table "public"."messages" to "anon";

grant insert on table "public"."messages" to "anon";

grant references on table "public"."messages" to "anon";

grant select on table "public"."messages" to "anon";

grant trigger on table "public"."messages" to "anon";

grant truncate on table "public"."messages" to "anon";

grant update on table "public"."messages" to "anon";

grant delete on table "public"."messages" to "authenticated";

grant insert on table "public"."messages" to "authenticated";

grant references on table "public"."messages" to "authenticated";

grant select on table "public"."messages" to "authenticated";

grant trigger on table "public"."messages" to "authenticated";

grant truncate on table "public"."messages" to "authenticated";

grant update on table "public"."messages" to "authenticated";

grant delete on table "public"."messages" to "service_role";

grant insert on table "public"."messages" to "service_role";

grant references on table "public"."messages" to "service_role";

grant select on table "public"."messages" to "service_role";

grant trigger on table "public"."messages" to "service_role";

grant truncate on table "public"."messages" to "service_role";

grant update on table "public"."messages" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."referrals" to "anon";

grant insert on table "public"."referrals" to "anon";

grant references on table "public"."referrals" to "anon";

grant select on table "public"."referrals" to "anon";

grant trigger on table "public"."referrals" to "anon";

grant truncate on table "public"."referrals" to "anon";

grant update on table "public"."referrals" to "anon";

grant delete on table "public"."referrals" to "authenticated";

grant insert on table "public"."referrals" to "authenticated";

grant references on table "public"."referrals" to "authenticated";

grant select on table "public"."referrals" to "authenticated";

grant trigger on table "public"."referrals" to "authenticated";

grant truncate on table "public"."referrals" to "authenticated";

grant update on table "public"."referrals" to "authenticated";

grant delete on table "public"."referrals" to "service_role";

grant insert on table "public"."referrals" to "service_role";

grant references on table "public"."referrals" to "service_role";

grant select on table "public"."referrals" to "service_role";

grant trigger on table "public"."referrals" to "service_role";

grant truncate on table "public"."referrals" to "service_role";

grant update on table "public"."referrals" to "service_role";

grant delete on table "public"."subscription_payments" to "anon";

grant insert on table "public"."subscription_payments" to "anon";

grant references on table "public"."subscription_payments" to "anon";

grant select on table "public"."subscription_payments" to "anon";

grant trigger on table "public"."subscription_payments" to "anon";

grant truncate on table "public"."subscription_payments" to "anon";

grant update on table "public"."subscription_payments" to "anon";

grant delete on table "public"."subscription_payments" to "authenticated";

grant insert on table "public"."subscription_payments" to "authenticated";

grant references on table "public"."subscription_payments" to "authenticated";

grant select on table "public"."subscription_payments" to "authenticated";

grant trigger on table "public"."subscription_payments" to "authenticated";

grant truncate on table "public"."subscription_payments" to "authenticated";

grant update on table "public"."subscription_payments" to "authenticated";

grant delete on table "public"."subscription_payments" to "service_role";

grant insert on table "public"."subscription_payments" to "service_role";

grant references on table "public"."subscription_payments" to "service_role";

grant select on table "public"."subscription_payments" to "service_role";

grant trigger on table "public"."subscription_payments" to "service_role";

grant truncate on table "public"."subscription_payments" to "service_role";

grant update on table "public"."subscription_payments" to "service_role";

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant delete on table "public"."subscriptions" to "authenticated";

grant insert on table "public"."subscriptions" to "authenticated";

grant references on table "public"."subscriptions" to "authenticated";

grant select on table "public"."subscriptions" to "authenticated";

grant trigger on table "public"."subscriptions" to "authenticated";

grant truncate on table "public"."subscriptions" to "authenticated";

grant update on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant references on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant trigger on table "public"."subscriptions" to "service_role";

grant truncate on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";

grant delete on table "public"."ticket_messages" to "anon";

grant insert on table "public"."ticket_messages" to "anon";

grant references on table "public"."ticket_messages" to "anon";

grant select on table "public"."ticket_messages" to "anon";

grant trigger on table "public"."ticket_messages" to "anon";

grant truncate on table "public"."ticket_messages" to "anon";

grant update on table "public"."ticket_messages" to "anon";

grant delete on table "public"."ticket_messages" to "authenticated";

grant insert on table "public"."ticket_messages" to "authenticated";

grant references on table "public"."ticket_messages" to "authenticated";

grant select on table "public"."ticket_messages" to "authenticated";

grant trigger on table "public"."ticket_messages" to "authenticated";

grant truncate on table "public"."ticket_messages" to "authenticated";

grant update on table "public"."ticket_messages" to "authenticated";

grant delete on table "public"."ticket_messages" to "service_role";

grant insert on table "public"."ticket_messages" to "service_role";

grant references on table "public"."ticket_messages" to "service_role";

grant select on table "public"."ticket_messages" to "service_role";

grant trigger on table "public"."ticket_messages" to "service_role";

grant truncate on table "public"."ticket_messages" to "service_role";

grant update on table "public"."ticket_messages" to "service_role";

grant delete on table "public"."tickets" to "anon";

grant insert on table "public"."tickets" to "anon";

grant references on table "public"."tickets" to "anon";

grant select on table "public"."tickets" to "anon";

grant trigger on table "public"."tickets" to "anon";

grant truncate on table "public"."tickets" to "anon";

grant update on table "public"."tickets" to "anon";

grant delete on table "public"."tickets" to "authenticated";

grant insert on table "public"."tickets" to "authenticated";

grant references on table "public"."tickets" to "authenticated";

grant select on table "public"."tickets" to "authenticated";

grant trigger on table "public"."tickets" to "authenticated";

grant truncate on table "public"."tickets" to "authenticated";

grant update on table "public"."tickets" to "authenticated";

grant delete on table "public"."tickets" to "service_role";

grant insert on table "public"."tickets" to "service_role";

grant references on table "public"."tickets" to "service_role";

grant select on table "public"."tickets" to "service_role";

grant trigger on table "public"."tickets" to "service_role";

grant truncate on table "public"."tickets" to "service_role";

grant update on table "public"."tickets" to "service_role";

grant delete on table "public"."tracking_config" to "anon";

grant insert on table "public"."tracking_config" to "anon";

grant references on table "public"."tracking_config" to "anon";

grant select on table "public"."tracking_config" to "anon";

grant trigger on table "public"."tracking_config" to "anon";

grant truncate on table "public"."tracking_config" to "anon";

grant update on table "public"."tracking_config" to "anon";

grant delete on table "public"."tracking_config" to "authenticated";

grant insert on table "public"."tracking_config" to "authenticated";

grant references on table "public"."tracking_config" to "authenticated";

grant select on table "public"."tracking_config" to "authenticated";

grant trigger on table "public"."tracking_config" to "authenticated";

grant truncate on table "public"."tracking_config" to "authenticated";

grant update on table "public"."tracking_config" to "authenticated";

grant delete on table "public"."tracking_config" to "service_role";

grant insert on table "public"."tracking_config" to "service_role";

grant references on table "public"."tracking_config" to "service_role";

grant select on table "public"."tracking_config" to "service_role";

grant trigger on table "public"."tracking_config" to "service_role";

grant truncate on table "public"."tracking_config" to "service_role";

grant update on table "public"."tracking_config" to "service_role";

grant delete on table "public"."usage_limits" to "anon";

grant insert on table "public"."usage_limits" to "anon";

grant references on table "public"."usage_limits" to "anon";

grant select on table "public"."usage_limits" to "anon";

grant trigger on table "public"."usage_limits" to "anon";

grant truncate on table "public"."usage_limits" to "anon";

grant update on table "public"."usage_limits" to "anon";

grant delete on table "public"."usage_limits" to "authenticated";

grant insert on table "public"."usage_limits" to "authenticated";

grant references on table "public"."usage_limits" to "authenticated";

grant select on table "public"."usage_limits" to "authenticated";

grant trigger on table "public"."usage_limits" to "authenticated";

grant truncate on table "public"."usage_limits" to "authenticated";

grant update on table "public"."usage_limits" to "authenticated";

grant delete on table "public"."usage_limits" to "service_role";

grant insert on table "public"."usage_limits" to "service_role";

grant references on table "public"."usage_limits" to "service_role";

grant select on table "public"."usage_limits" to "service_role";

grant trigger on table "public"."usage_limits" to "service_role";

grant truncate on table "public"."usage_limits" to "service_role";

grant update on table "public"."usage_limits" to "service_role";

grant delete on table "public"."user_roles" to "anon";

grant insert on table "public"."user_roles" to "anon";

grant references on table "public"."user_roles" to "anon";

grant select on table "public"."user_roles" to "anon";

grant trigger on table "public"."user_roles" to "anon";

grant truncate on table "public"."user_roles" to "anon";

grant update on table "public"."user_roles" to "anon";

grant delete on table "public"."user_roles" to "authenticated";

grant insert on table "public"."user_roles" to "authenticated";

grant references on table "public"."user_roles" to "authenticated";

grant select on table "public"."user_roles" to "authenticated";

grant trigger on table "public"."user_roles" to "authenticated";

grant truncate on table "public"."user_roles" to "authenticated";

grant update on table "public"."user_roles" to "authenticated";

grant delete on table "public"."user_roles" to "service_role";

grant insert on table "public"."user_roles" to "service_role";

grant references on table "public"."user_roles" to "service_role";

grant select on table "public"."user_roles" to "service_role";

grant trigger on table "public"."user_roles" to "service_role";

grant truncate on table "public"."user_roles" to "service_role";

grant update on table "public"."user_roles" to "service_role";

grant delete on table "public"."user_usage" to "anon";

grant insert on table "public"."user_usage" to "anon";

grant references on table "public"."user_usage" to "anon";

grant select on table "public"."user_usage" to "anon";

grant trigger on table "public"."user_usage" to "anon";

grant truncate on table "public"."user_usage" to "anon";

grant update on table "public"."user_usage" to "anon";

grant delete on table "public"."user_usage" to "authenticated";

grant insert on table "public"."user_usage" to "authenticated";

grant references on table "public"."user_usage" to "authenticated";

grant select on table "public"."user_usage" to "authenticated";

grant trigger on table "public"."user_usage" to "authenticated";

grant truncate on table "public"."user_usage" to "authenticated";

grant update on table "public"."user_usage" to "authenticated";

grant delete on table "public"."user_usage" to "service_role";

grant insert on table "public"."user_usage" to "service_role";

grant references on table "public"."user_usage" to "service_role";

grant select on table "public"."user_usage" to "service_role";

grant trigger on table "public"."user_usage" to "service_role";

grant truncate on table "public"."user_usage" to "service_role";

grant update on table "public"."user_usage" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "campaign_profiles_delete_policy"
on "public"."campaign_profiles"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "campaign_profiles_insert_policy"
on "public"."campaign_profiles"
as permissive
for insert
to authenticated
with check ((auth.uid() = user_id));


create policy "campaign_profiles_select_policy"
on "public"."campaign_profiles"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "campaign_profiles_update_policy"
on "public"."campaign_profiles"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Les utilisateurs peuvent voir les messages de leurs conversatio"
on "public"."chat_messages"
as permissive
for select
to public
using (((auth.uid() IN ( SELECT chat_rooms.user_id
   FROM chat_rooms
  WHERE (chat_rooms.id = chat_messages.room_id))) OR (auth.uid() IN ( SELECT chat_rooms.agent_id
   FROM chat_rooms
  WHERE (chat_rooms.id = chat_messages.room_id))) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text)));


create policy "Les utilisateurs peuvent voir leurs conversations"
on "public"."chat_rooms"
as permissive
for select
to public
using (((auth.uid() = user_id) OR (auth.uid() = agent_id) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text)));


create policy "Lecture des templates pour utilisateurs authentifiés"
on "public"."email_templates"
as permissive
for select
to authenticated
using (true);


create policy "Modification des templates pour administrateurs"
on "public"."email_templates"
as permissive
for update
to authenticated
using (has_role('admin'::user_role));


create policy "Allow users to manage profiles in their lists"
on "public"."list_profiles"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM lists
  WHERE ((lists.id = list_profiles.list_id) AND (lists.user_id = auth.uid())))));


create policy "lists_delete_policy"
on "public"."lists"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "lists_insert_policy"
on "public"."lists"
as permissive
for insert
to authenticated
with check (((auth.uid() = user_id) AND (auth.uid() IS NOT NULL)));


create policy "lists_select_policy"
on "public"."lists"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "lists_update_policy"
on "public"."lists"
as permissive
for update
to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "messages_insert_policy"
on "public"."messages"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM campaign_profiles cp
  WHERE ((cp.profile_id = cp.profile_id) AND (cp.user_id = auth.uid())))));


create policy "messages_select_policy"
on "public"."messages"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM campaign_profiles cp
  WHERE ((cp.profile_id = messages.profile_id) AND (cp.user_id = auth.uid())))));


create policy "Allow insert profiles without auth"
on "public"."profiles"
as permissive
for insert
to authenticated, anon
with check (true);


create policy "Allow public read access"
on "public"."profiles"
as permissive
for select
to authenticated, anon
using (true);


create policy "Les utilisateurs peuvent voir leurs parrainages"
on "public"."referrals"
as permissive
for select
to public
using (((auth.uid() = referrer_id) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text)));


create policy "user can create his own referral code"
on "public"."referrals"
as permissive
for insert
to public
with check (((auth.uid() = referrer_id) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text)));


create policy "Users can view their own payments"
on "public"."subscription_payments"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM subscriptions s
  WHERE ((s.id = subscription_payments.subscription_id) AND (s.user_id = auth.uid())))));


create policy "Users can update their own subscription"
on "public"."subscriptions"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own subscription"
on "public"."subscriptions"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Les utilisateurs peuvent voir les messages de leurs tickets"
on "public"."ticket_messages"
as permissive
for select
to public
using (((auth.uid() IN ( SELECT tickets.user_id
   FROM tickets
  WHERE (tickets.id = ticket_messages.ticket_id))) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text)));


create policy "Les utilisateurs peuvent créer des tickets"
on "public"."tickets"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Les utilisateurs peuvent voir leurs propres tickets"
on "public"."tickets"
as permissive
for select
to public
using (((auth.uid() = user_id) OR ((auth.jwt() ->> 'role'::text) = 'admin'::text)));


create policy "Allow admins full access to tracking_config"
on "public"."tracking_config"
as permissive
for all
to public
using ((auth.uid() IN ( SELECT user_roles.user_id
   FROM user_roles
  WHERE (user_roles.role = 'admin'::user_role))));


create policy "Anyone can read usage limits"
on "public"."usage_limits"
as permissive
for select
to authenticated
using (true);


create policy "Everyone can view usage limits"
on "public"."usage_limits"
as permissive
for select
to authenticated
using (true);


create policy "Allow admin to manage roles"
on "public"."user_roles"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_roles user_roles_1
  WHERE ((user_roles_1.user_id = auth.uid()) AND (user_roles_1.role = 'admin'::user_role)))));


create policy "Allow read access to authenticated users"
on "public"."user_roles"
as permissive
for select
to authenticated
using (true);


create policy "Users can read their own usage"
on "public"."user_usage"
as permissive
for select
to authenticated
using ((auth.uid() = user_id));


create policy "Users can update own usage"
on "public"."user_usage"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view own usage"
on "public"."user_usage"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can update own profile"
on "public"."users"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can update their own data"
on "public"."users"
as permissive
for update
to authenticated
using ((auth.uid() = id))
with check ((auth.uid() = id));


create policy "Users can view own profile"
on "public"."users"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Users can view their own data"
on "public"."users"
as permissive
for select
to authenticated
using ((auth.uid() = id));


CREATE TRIGGER archive_campaign_profiles_trigger BEFORE DELETE ON public.lists FOR EACH ROW EXECUTE FUNCTION archive_campaign_profiles();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON public.messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER update_subscription_timestamp BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION update_subscription_updated_at();

CREATE TRIGGER update_user_timestamp BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_user_updated_at();


