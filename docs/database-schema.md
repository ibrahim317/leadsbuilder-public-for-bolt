# Database Schema Documentation

This document provides a detailed overview of the LeadsBuilder database schema, including tables, relationships, and data types.

## Overview

The LeadsBuilder application uses a PostgreSQL database managed by Supabase. The schema is designed to support:

- User authentication and management
- Subscription and payment processing
- Lead management and campaigns
- Customer relationship management
- Support ticketing

## Entity Relationship Diagram

```
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│               │       │               │       │               │
│     Users     │◄──────┤ Subscriptions │◄──────┤  Subscription │
│               │       │               │       │   Payments    │
└───────────────┘       └───────────────┘       └───────────────┘
       ▲                        ▲
       │                        │
       │                        │
┌───────────────┐       ┌───────────────┐
│               │       │               │
│  Temp Users   │       │     Plans     │
│               │       │               │
└───────────────┘       └───────────────┘
       ▲
       │
       │
┌───────────────┐
│               │
│   Checkout    │
│   Sessions    │
│               │
└───────────────┘
```

## Tables

### Users

The core table for user accounts.

| Column         | Type                     | Nullable | Description                           |
|----------------|--------------------------|----------|---------------------------------------|
| id             | uuid                     | NO       | Primary key                           |
| email          | text                     | NO       | User's email address                  |
| created_at     | timestamp with time zone | YES      | Account creation timestamp            |
| updated_at     | timestamp with time zone | YES      | Last update timestamp                 |
| email_verified | boolean                  | YES      | Whether email has been verified       |
| subscription_id| uuid                     | YES      | Foreign key to subscriptions table    |

**Relationships:**
- One-to-one relationship with `subscriptions` table

### Subscriptions

Stores subscription information for users.

| Column             | Type                     | Nullable | Description                           |
|--------------------|--------------------------|----------|---------------------------------------|
| id                 | uuid                     | NO       | Primary key                           |
| user_id            | uuid                     | YES      | Foreign key to users table            |
| status             | subscription_status      | NO       | Subscription status (enum)            |
| start_date         | timestamp with time zone | NO       | When subscription started             |
| end_date           | timestamp with time zone | YES      | When subscription ends/ended          |
| trial_end_date     | timestamp with time zone | YES      | When trial period ends                |
| created_at         | timestamp with time zone | YES      | Record creation timestamp             |
| updated_at         | timestamp with time zone | YES      | Last update timestamp                 |
| stripe_customer_id | text                     | YES      | Stripe customer ID                    |
| stripe_subscription_id | text                 | YES      | Stripe subscription ID                |
| plan_id            | text                     | YES      | Reference to plan ID                  |
| plan_name          | text                     | YES      | Name of the subscription plan         |
| cancel_at_period_end | boolean                | YES      | Whether subscription cancels at end   |

**Relationships:**
- Many-to-one relationship with `users` table
- One-to-many relationship with `subscription_payments` table

### Subscription_Payments

Records payment history for subscriptions.

| Column          | Type                     | Nullable | Description                           |
|-----------------|--------------------------|----------|---------------------------------------|
| id              | uuid                     | NO       | Primary key                           |
| subscription_id | uuid                     | YES      | Foreign key to subscriptions table    |
| amount          | integer                  | NO       | Payment amount in cents               |
| currency        | text                     | NO       | Currency code (e.g., EUR)             |
| status          | text                     | NO       | Payment status                        |
| payment_method  | text                     | NO       | Method used for payment               |
| created_at      | timestamp with time zone | YES      | Payment timestamp                     |

**Relationships:**
- Many-to-one relationship with `subscriptions` table

### Plans

Defines available subscription plans.

| Column        | Type                     | Nullable | Description                           |
|---------------|--------------------------|----------|---------------------------------------|
| id            | uuid                     | NO       | Primary key                           |
| name          | character varying        | NO       | Plan name (e.g., "Starter", "Pro")    |
| price         | numeric                  | NO       | Price amount                          |
| price_display | character varying        | NO       | Formatted price for display           |
| period        | character varying        | NO       | Billing period (e.g., "par mois")     |
| priceid       | character varying        | NO       | Stripe price ID                       |
| features      | jsonb                    | NO       | Features included in the plan         |
| popular       | boolean                  | YES      | Whether plan is marked as popular     |
| created_at    | timestamp with time zone | YES      | Record creation timestamp             |
| updated_at    | timestamp with time zone | YES      | Last update timestamp                 |

### Temp_Users

Stores temporary user data during registration process.

| Column        | Type                     | Nullable | Description                           |
|---------------|--------------------------|----------|---------------------------------------|
| id            | uuid                     | NO       | Primary key                           |
| token         | text                     | NO       | Temporary token for identification    |
| email         | text                     | NO       | User's email address                  |
| password      | text                     | NO       | Hashed password                       |
| first_name    | text                     | NO       | User's first name                     |
| phone         | text                     | YES      | User's phone number                   |
| activity      | text                     | NO       | User's business activity              |
| plan_id       | text                     | NO       | Selected plan ID                      |
| created_at    | timestamp with time zone | NO       | Record creation timestamp             |
| expires_at    | timestamp with time zone | NO       | When temporary record expires         |

### Checkout_Sessions

Tracks Stripe checkout sessions.

| Column         | Type                     | Nullable | Description                           |
|----------------|--------------------------|----------|---------------------------------------|
| id             | uuid                     | NO       | Primary key                           |
| session_id     | text                     | NO       | Stripe checkout session ID            |
| payment_status | text                     | NO       | Status of the payment                 |
| user_data      | jsonb                    | NO       | User data for account creation        |
| login_token    | text                     | YES      | One-time login token                  |
| created_at     | timestamp with time zone | YES      | Record creation timestamp             |
| updated_at     | timestamp with time zone | YES      | Last update timestamp                 |

### Lists

Stores lead lists.

| Column        | Type                     | Nullable | Description                           |
|---------------|--------------------------|----------|---------------------------------------|
| id            | uuid                     | NO       | Primary key                           |
| user_id       | uuid                     | YES      | Foreign key to users table            |
| name          | text                     | NO       | List name                             |
| description   | text                     | YES      | List description                      |
| created_at    | timestamp with time zone | YES      | Record creation timestamp             |
| updated_at    | timestamp with time zone | YES      | Last update timestamp                 |

**Relationships:**
- Many-to-one relationship with `users` table
- One-to-many relationship with `list_profiles` table

### List_Profiles

Associates profiles with lists.

| Column        | Type                     | Nullable | Description                           |
|---------------|--------------------------|----------|---------------------------------------|
| id            | uuid                     | NO       | Primary key                           |
| list_id       | uuid                     | YES      | Foreign key to lists table            |
| profile_id    | uuid                     | YES      | Foreign key to profiles table         |
| created_at    | timestamp with time zone | YES      | Record creation timestamp             |

**Relationships:**
- Many-to-one relationship with `lists` table
- Many-to-one relationship with `profiles` table

## Enums

### subscription_status

Defines possible subscription statuses.

| Value     | Description                                 |
|-----------|---------------------------------------------|
| active    | Subscription is active and paid             |
| canceled  | Subscription has been canceled              |
| past_due  | Payment is past due                         |
| unpaid    | Payment failed and subscription is inactive |

## Row-Level Security Policies

The database uses Row-Level Security (RLS) policies to control access to data:

1. **Users Table**
   - Users can only read and update their own records
   - Service role can manage all records

2. **Subscriptions Table**
   - Users can only read their own subscriptions
   - Service role can manage all subscriptions

3. **Temp_Users Table**
   - Only service role can access these records

4. **Checkout_Sessions Table**
   - Only service role can access these records

5. **Lists Table**
   - Users can only access their own lists
   - Service role can manage all lists

## Indexes

The database includes the following indexes for performance optimization:

1. **Email Indexes**
   - `idx_users_email` on `users(email)`
   - `idx_temp_users_email` on `temp_users(email)`

2. **Token Indexes**
   - `idx_temp_users_token` on `temp_users(token)`

3. **Session Indexes**
   - `idx_checkout_sessions_session_id` on `checkout_sessions(session_id)`

4. **Foreign Key Indexes**
   - Automatically created on all foreign key columns

## Database Migrations

Database changes are managed through migration files in the `supabase/migrations/` directory. These migrations are applied in order based on their timestamp prefixes.

Key migrations include:
- Initial schema creation
- Addition of subscription-related tables
- Creation of payment processing tables
- Implementation of Row-Level Security policies 