# Payment System Documentation

This document provides a comprehensive overview of the payment system in LeadsBuilder, including the subscription flow, Stripe integration, and database interactions.

## Overview

LeadsBuilder implements a "payment-first" registration flow where users select a plan, enter their registration information, make a payment, and then gain access to the application. This approach ensures that only paying customers get access to the system.

## Payment Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Select Plan    │────▶│  Registration   │────▶│  Stripe Payment │
│                 │     │     Form        │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                         │
                                                         │
                                                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  User Dashboard │◀────┤  Account Setup  │◀────┤  Payment Success│
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Step 1: Plan Selection

1. User visits the pricing page
2. User selects a subscription plan
3. Frontend captures the plan details (ID, name, price)

**Code Path:**
- `app/src/pages/pricing/PricingPage.tsx` - Displays available plans
- `app/src/db/Payment/getPricingPlans.ts` - Fetches plans from the database

### Step 2: Registration Form

1. User enters registration information (name, email, password, etc.)
2. Data is temporarily stored for use after payment
3. A temporary token is generated to identify the user

**Code Path:**
- `app/src/pages/auth/RegisterPage.tsx` - Collects user information
- `app/src/db/Payment/createCheckoutSession.ts` - Prepares for checkout

### Step 3: Stripe Checkout

1. Frontend calls the Payment module to create a checkout session
2. Payment module invokes the create-checkout-session Edge Function
3. Edge Function creates a Stripe checkout session and returns the URL
4. User is redirected to Stripe's hosted checkout page
5. Temporary user data is stored in the database

**Code Path:**
- `app/src/db/Payment/createCheckoutSession.ts` - Creates checkout session
- `supabase/functions/create-checkout-session/index.ts` - Edge function
- Database tables: `temp_users`, `checkout_sessions`

### Step 4: Payment Success

1. After successful payment, Stripe redirects to the success page
2. Success page verifies the payment using the session ID
3. Verification process confirms payment and retrieves user data
4. A one-time login token is generated for the user

**Code Path:**
- `app/src/pages/payment/success.tsx` - Handles post-payment flow
- `app/src/db/Payment/verifySubscription.ts` - Verifies payment
- `supabase/functions/verify-payment-token/index.ts` - Verifies and generates token

### Step 5: Account Setup

1. For new users, an account is created using the stored information
2. For existing users, their subscription is updated
3. User is automatically logged in using the one-time token

**Code Path:**
- `supabase/functions/stripe-webhook/index.ts` - Processes webhook events
- `app/src/contexts/AuthContext.tsx` - Handles authentication

## Stripe Integration

### Components

1. **Checkout Sessions**
   - Created via the `create-checkout-session` Edge Function
   - Uses Stripe Checkout for secure payment processing
   - Includes metadata about the user and selected plan

2. **Customer Portal**
   - Allows users to manage their subscription
   - Accessible via the `create-customer-portal-session` Edge Function
   - Enables users to update payment methods, cancel, or resume subscriptions

3. **Webhooks**
   - Processes events from Stripe asynchronously
   - Handles subscription lifecycle events (created, updated, canceled)
   - Updates the database to reflect subscription changes

### Key Stripe Events

| Event                         | Handler                                   | Action                                  |
|-------------------------------|-------------------------------------------|------------------------------------------|
| checkout.session.completed    | stripe-webhook/index.ts                   | Creates/updates user and subscription    |
| customer.subscription.updated | stripe-webhook/index.ts                   | Updates subscription status and details  |
| customer.subscription.deleted | stripe-webhook/index.ts                   | Marks subscription as canceled           |

## Database Interactions

### Tables Used

1. **plans**
   - Stores available subscription plans
   - Referenced during checkout session creation

2. **temp_users**
   - Stores temporary user data during registration
   - Used to create permanent user accounts after payment

3. **checkout_sessions**
   - Tracks Stripe checkout sessions
   - Stores user data and payment status
   - Contains one-time login tokens

4. **subscriptions**
   - Stores active subscriptions
   - Links users to their subscription details
   - Tracks subscription status and period

5. **subscription_payments**
   - Records payment history
   - Tracks amounts, dates, and payment methods

### Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│    plans    │────▶│ temp_users  │────▶│    users    │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                          │                    │
                          ▼                    ▼
                    ┌─────────────┐     ┌─────────────┐
                    │             │     │             │
                    │  checkout   │────▶│subscriptions│
                    │  sessions   │     │             │
                    │             │     └─────────────┘
                    └─────────────┘            │
                                               ▼
                                        ┌─────────────┐
                                        │             │
                                        │subscription │
                                        │  payments   │
                                        │             │
                                        └─────────────┘
```

## Frontend Implementation

### Payment Module

The Payment module (`app/src/db/Payment/`) provides a clean API for the frontend to interact with the payment system:

1. **getPricingPlans**
   - Fetches available subscription plans
   - Used on the pricing page

2. **createCheckoutSession**
   - Creates a Stripe checkout session
   - Redirects user to Stripe for payment

3. **getCheckoutSession**
   - Retrieves details of a checkout session
   - Used to verify payment status

4. **verifySubscription**
   - Verifies payment and subscription status
   - Used after payment completion

5. **handleSubscriptionChanges**
   - Manages subscription lifecycle (cancel, resume)
   - Used in account settings

### Usage Example

```typescript
// Example: Creating a checkout session
import { Payment } from '../../db';

async function handleSubscribe(plan) {
  const { data, error } = await Payment.createCheckoutSession({
    priceId: plan.stripe_price_id,
    planName: plan.name,
    customerEmail: userEmail,
    returnUrl: `${window.location.origin}/payment/success`
  });

  if (error) {
    console.error('Error creating checkout session:', error);
    return;
  }

  // Redirect to Stripe Checkout
  window.location.href = data.url;
}
```

## Edge Functions

### create-checkout-session

Creates a Stripe checkout session and stores temporary user data.

**Parameters:**
- `priceId`: Stripe price ID
- `planName`: Name of the selected plan
- `customerEmail`: User's email address
- `userId`: (Optional) User ID for existing users
- `token`: (Optional) Temporary token for new users
- `returnUrl`: (Optional) URL to redirect after payment

**Response:**
- `sessionId`: Stripe checkout session ID
- `url`: Checkout URL to redirect the user

### verify-payment-token

Verifies payment and generates/validates one-time login tokens.

**Parameters:**
- `session_id`: Stripe checkout session ID
- `token`: (Optional) One-time login token

**Response:**
- `loginToken`: One-time login token (if not provided)
- `session`: Supabase session (if token is valid)

### stripe-webhook

Processes Stripe webhook events.

**Events Handled:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Subscription Management

### Cancellation

Users can cancel their subscription, which will remain active until the end of the current billing period.

**Code Path:**
- `app/src/db/Payment/handleSubscriptionChanges.ts` - Cancellation logic
- `supabase/functions/cancel-subscription/index.ts` - Edge function

### Resumption

Canceled subscriptions can be resumed before the end of the billing period.

**Code Path:**
- `app/src/db/Payment/handleSubscriptionChanges.ts` - Resumption logic
- `supabase/functions/resume-subscription/index.ts` - Edge function

### Billing Portal

Users can access the Stripe Customer Portal to manage payment methods and billing details.

**Code Path:**
- `app/src/db/Billing/updatePaymentMethod.ts` - Redirects to portal
- `supabase/functions/create-customer-portal-session/index.ts` - Edge function

## Security Considerations

1. **Webhook Verification**
   - Stripe signatures are verified to prevent tampering
   - Only valid webhook events are processed

2. **One-Time Tokens**
   - Login tokens expire after 15 minutes
   - Tokens are tied to specific checkout sessions

3. **Row-Level Security**
   - Database access is restricted by RLS policies
   - Users can only access their own data

4. **Service Role**
   - Edge functions use the service role for database operations
   - Bypasses RLS for necessary operations

## Testing

The payment system can be tested using Stripe's test mode:

1. Use test card number: 4242 4242 4242 4242
2. Any future expiration date
3. Any 3-digit CVC
4. Any postal code

## Troubleshooting

Common issues and solutions:

1. **Payment Failed**
   - Check Stripe Dashboard for error details
   - Verify test card information

2. **Webhook Not Received**
   - Ensure webhook URL is correctly configured
   - Check Stripe Dashboard for delivery attempts

3. **User Not Created After Payment**
   - Check webhook logs for errors
   - Verify temp_users and checkout_sessions data

4. **Subscription Not Updated**
   - Check webhook logs for subscription events
   - Verify subscription data in the database 