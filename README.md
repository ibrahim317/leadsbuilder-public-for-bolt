# LeadsBuilder

LeadsBuilder is a web application for building and managing leads.

## Project Structure

The project is structured as follows:

- `app/`: Frontend application (React, Vite, React Router)
- `front/`: Landing page (before login)
- `supabase/`: Supabase edge functions for Stripe integration

## Backend Migration to Supabase

The backend has been migrated to use Supabase exclusively, with Stripe integration handled through Supabase edge functions.

### Service Layer

A service layer has been implemented to abstract Supabase operations:

- `SupabaseService`: Base service class with common functionality
- `AuthService`: Authentication-related operations
- `PaymentService`: Payment and subscription operations
- `UserService`: User profile operations

### Authentication

Authentication is handled through the `AuthContext` which uses the `AuthService`. The `useAuth` hook has been removed in favor of using the `AuthContext` directly.

### Stripe Integration

Stripe integration is handled through Supabase edge functions:

- `create-checkout-session`: Creates a Stripe checkout session
- `get-checkout-session`: Retrieves a Stripe checkout session
- `cancel-subscription`: Cancels a subscription
- `resume-subscription`: Resumes a canceled subscription
- `create-customer-portal-session`: Creates a Stripe customer portal session
- `stripe-webhook`: Handles Stripe webhook events

## Development

To run the application locally:

1. Install dependencies:
   ```bash
   cd app
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Frontend

The frontend can be deployed to any static hosting service, such as Vercel, Netlify, or Firebase Hosting.

### Supabase Edge Functions

See the [Supabase Edge Functions README](supabase/functions/README.md) for deployment instructions.
