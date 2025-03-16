# API Documentation

This document provides a comprehensive overview of the LeadsBuilder API, including both the database API and Edge Functions.

## Overview

LeadsBuilder uses two primary API layers:

1. **Supabase Database API**: Direct database access through the Supabase client
2. **Edge Functions API**: Serverless functions for complex operations

## Supabase Database API

### Authentication

#### Sign Up

```typescript
const { data, error } = await supabaseClient.auth.signUp({
  email: 'user@example.com',
  password: 'password123',
  options: {
    data: {
      first_name: 'John',
      last_name: 'Doe'
    }
  }
});
```

#### Sign In

```typescript
const { data, error } = await supabaseClient.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

#### Sign Out

```typescript
const { error } = await supabaseClient.auth.signOut();
```

#### Get Current User

```typescript
const { data: { user }, error } = await supabaseClient.auth.getUser();
```

### Subscriptions

#### Get User Subscription

```typescript
const { data, error } = await supabaseClient
  .from('subscriptions')
  .select('*')
  .eq('user_id', userId)
  .single();
```

#### Get Subscription Payments

```typescript
const { data, error } = await supabaseClient
  .from('subscription_payments')
  .select('*')
  .eq('subscription_id', subscriptionId)
  .order('created_at', { ascending: false });
```

### Plans

#### Get All Plans

```typescript
const { data, error } = await supabaseClient
  .from('plans')
  .select('*')
  .order('price', { ascending: true });
```

#### Get Plan by ID

```typescript
const { data, error } = await supabaseClient
  .from('plans')
  .select('*')
  .eq('id', planId)
  .single();
```

### Lists

#### Get User Lists

```typescript
const { data, error } = await supabaseClient
  .from('lists')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false });
```

#### Create List

```typescript
const { data, error } = await supabaseClient
  .from('lists')
  .insert({
    user_id: userId,
    name: 'My List',
    description: 'A list of leads'
  })
  .select()
  .single();
```

#### Update List

```typescript
const { data, error } = await supabaseClient
  .from('lists')
  .update({
    name: 'Updated List Name',
    description: 'Updated description'
  })
  .eq('id', listId)
  .select()
  .single();
```

#### Delete List

```typescript
const { error } = await supabaseClient
  .from('lists')
  .delete()
  .eq('id', listId);
```

### Profiles

#### Get Profiles in List

```typescript
const { data, error } = await supabaseClient
  .from('list_profiles')
  .select(`
    id,
    profiles (*)
  `)
  .eq('list_id', listId);
```

#### Add Profile to List

```typescript
const { data, error } = await supabaseClient
  .from('list_profiles')
  .insert({
    list_id: listId,
    profile_id: profileId
  });
```

#### Remove Profile from List

```typescript
const { error } = await supabaseClient
  .from('list_profiles')
  .delete()
  .eq('list_id', listId)
  .eq('profile_id', profileId);
```

## Edge Functions API

Edge Functions are serverless functions that run on Supabase's infrastructure. They provide a secure way to perform complex operations that can't be done directly from the client.

### Payment Functions

#### Create Checkout Session

Creates a Stripe checkout session for subscription payment.

**Endpoint**: `/functions/v1/create-checkout-session`

**Method**: POST

**Request Body**:
```json
{
  "priceId": "price_1234567890",
  "planName": "Pro",
  "customerEmail": "user@example.com",
  "userId": "user-uuid-1234",  // Optional
  "returnUrl": "https://example.com/success"  // Optional
}
```

**Response**:
```json
{
  "sessionId": "cs_test_1234567890",
  "url": "https://checkout.stripe.com/pay/cs_test_1234567890"
}
```

**Error Response**:
```json
{
  "error": "Missing required fields: priceId, planName, customerEmail"
}
```

#### Get Checkout Session

Retrieves details of a Stripe checkout session.

**Endpoint**: `/functions/v1/get-checkout-session`

**Method**: POST

**Request Body**:
```json
{
  "sessionId": "cs_test_1234567890"
}
```

**Response**:
```json
{
  "id": "cs_test_1234567890",
  "status": "complete",
  "customer": "cus_1234567890",
  "payment_status": "paid",
  "amount_total": 4900,
  "currency": "eur",
  "metadata": {
    "userId": "user-uuid-1234",
    "planName": "Pro"
  }
}
```

**Error Response**:
```json
{
  "error": "Missing required field: sessionId"
}
```

#### Verify Payment Token

Verifies payment and generates/validates one-time login tokens.

**Endpoint**: `/functions/v1/verify-payment-token`

**Method**: POST

**Request Body (Generate Token)**:
```json
{
  "session_id": "cs_test_1234567890"
}
```

**Response (Generate Token)**:
```json
{
  "loginToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "user@example.com"
}
```

**Request Body (Validate Token)**:
```json
{
  "session_id": "cs_test_1234567890",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Validate Token)**:
```json
{
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_at": 1672531200
  }
}
```

**Error Response**:
```json
{
  "error": "Invalid or expired token"
}
```

#### Cancel Subscription

Cancels a subscription at the end of the current billing period.

**Endpoint**: `/functions/v1/cancel-subscription`

**Method**: POST

**Request Body**:
```json
{
  "subscriptionId": "sub_1234567890"  // Optional, uses user's subscription if not provided
}
```

**Response**:
```json
{
  "success": true,
  "message": "Subscription will be canceled at the end of the billing period",
  "subscription": {
    "id": "sub_1234567890",
    "status": "active",
    "cancel_at_period_end": true,
    "current_period_end": "2023-12-31T23:59:59Z"
  }
}
```

**Error Response**:
```json
{
  "error": "Subscription not found"
}
```

#### Resume Subscription

Resumes a canceled subscription.

**Endpoint**: `/functions/v1/resume-subscription`

**Method**: POST

**Request Body**:
```json
{
  "subscriptionId": "sub_1234567890"  // Optional, uses user's subscription if not provided
}
```

**Response**:
```json
{
  "success": true,
  "message": "Subscription has been resumed",
  "subscription": {
    "id": "sub_1234567890",
    "status": "active",
    "cancel_at_period_end": false
  }
}
```

**Error Response**:
```json
{
  "error": "Subscription cannot be resumed"
}
```

#### Create Customer Portal Session

Creates a Stripe customer portal session for subscription management.

**Endpoint**: `/functions/v1/create-customer-portal-session`

**Method**: POST

**Request Body**:
```json
{}  // No parameters required, uses authenticated user
```

**Response**:
```json
{
  "url": "https://billing.stripe.com/session/live_1234567890"
}
```

**Error Response**:
```json
{
  "error": "User has no active subscription"
}
```

### Webhook Endpoint

Processes Stripe webhook events.

**Endpoint**: `/functions/v1/stripe-webhook`

**Method**: POST

**Headers**:
```
stripe-signature: t=1675283600,v1=1234567890...
```

**Request Body**:
```
Raw event data from Stripe
```

**Response**:
```json
{
  "received": true
}
```

**Error Response**:
```json
{
  "error": "Invalid signature"
}
```

## Error Handling

All API endpoints follow a consistent error handling pattern:

1. **Client Errors (400-level)**:
   - Missing required fields
   - Invalid parameters
   - Authentication/authorization errors

2. **Server Errors (500-level)**:
   - Database errors
   - External service errors
   - Unexpected exceptions

Error responses include:
- An `error` field with a human-readable message
- HTTP status code appropriate to the error type

## Authentication and Authorization

### Authentication

All API requests (except public endpoints) require authentication using a JWT token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Authorization

Access to resources is controlled by Row-Level Security policies in the database:

1. Users can only access their own data
2. Service role can access all data
3. Edge Functions use the service role for privileged operations

## Rate Limiting

API endpoints are subject to rate limiting:

- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

Exceeding these limits results in a 429 Too Many Requests response.

## Versioning

The API is versioned through the URL path:

- Current version: `/functions/v1/`
- Future versions: `/functions/v2/`, etc.

## Testing

API endpoints can be tested using the Supabase client or direct HTTP requests:

```typescript
// Using Supabase client
const { data, error } = await supabaseClient.functions.invoke('create-checkout-session', {
  body: {
    priceId: 'price_1234567890',
    planName: 'Pro',
    customerEmail: 'user@example.com'
  }
});

// Using fetch
const response = await fetch('https://your-project.supabase.co/functions/v1/create-checkout-session', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    priceId: 'price_1234567890',
    planName: 'Pro',
    customerEmail: 'user@example.com'
  })
});
```

## Best Practices

1. **Always handle errors** from API calls
2. **Validate input** before sending to the API
3. **Use TypeScript interfaces** for request/response types
4. **Implement retry logic** for transient failures
5. **Cache responses** when appropriate
6. **Use the appropriate HTTP method** for each operation 