# LeadsBuilder Architecture Overview

This document provides a high-level overview of the LeadsBuilder application architecture, explaining how different components interact with each other.

## System Architecture

LeadsBuilder follows a modern web application architecture with the following key components:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│ Supabase Client │────▶│  Supabase API   │
│  (app/src)      │     │  (API Layer)    │     │  (Database)     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                                               ▲
         │                                               │
         │                                               │
         │                                               │
         │                                               │
         ▼                                               │
┌─────────────────┐                            ┌─────────────────┐
│                 │                            │                 │
│  Edge Functions │                            │  Stripe API     │
│  (Serverless)   │───────────────────────────▶│  (Payments)     │
│                 │                            │                 │
└─────────────────┘                            └─────────────────┘
```

### Key Components

1. **Frontend (app/src)**
   - React-based SPA with TypeScript
   - Organized into pages, components, and utility modules
   - Uses React Router for navigation
   - Communicates with backend via Supabase client

2. **Database Layer (app/src/db)**
   - Abstraction layer for database operations
   - Organized by domain (Auth, Billing, Payment, etc.)
   - Handles data fetching, error handling, and type safety

3. **Supabase Backend**
   - PostgreSQL database with Row-Level Security
   - Authentication and authorization
   - Storage for files and assets
   - Real-time subscriptions for live updates

4. **Edge Functions (supabase/functions)**
   - Serverless functions for secure operations
   - Handle payment processing with Stripe
   - Manage subscription lifecycle
   - Process webhooks and external integrations

5. **External Services**
   - Stripe for payment processing
   - Email services for notifications

## Code Organization

The codebase is organized as follows:

```
leadsbuilder/
├── app/                  # Frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── contexts/     # React contexts for state management
│   │   ├── db/           # Database interaction layer
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and helpers
│   │   ├── pages/        # Page components
│   │   └── types/        # TypeScript type definitions
│   └── ...
├── supabase/             # Supabase configuration and functions
│   ├── functions/        # Edge Functions
│   ├── migrations/       # Database migrations
│   └── ...
├── docs/                 # Documentation
└── ...
```

## Request Flow

A typical request in the application follows this flow:

1. User interacts with a component in the frontend
2. Component calls a function from the db/ layer
3. The db function uses the Supabase client to make an API call
4. For complex operations, the client calls a Supabase Edge Function
5. The Edge Function performs the operation and returns a result
6. The result is processed by the db layer and returned to the component
7. The component updates the UI based on the result

## Authentication Flow

1. User signs up or logs in through the frontend
2. Supabase Auth handles the authentication process
3. JWT tokens are stored in browser storage
4. The Supabase client includes the token in all subsequent requests
5. Row-Level Security policies in the database enforce access control

## Payment Flow

1. User selects a plan and enters registration information
2. Frontend calls the Payment module to create a checkout session
3. Payment module invokes the create-checkout-session Edge Function
4. User is redirected to Stripe for payment processing
5. After payment, Stripe redirects back to the success page
6. Success page verifies the payment and completes the registration
7. Stripe webhooks update subscription status asynchronously

## Deployment Architecture

The application is deployed as follows:

1. Frontend: Hosted on a CDN or static hosting service
2. Backend: Hosted on Supabase's managed platform
3. Edge Functions: Deployed to Supabase's serverless environment
4. Database: Managed PostgreSQL instance on Supabase

## Further Documentation

For more detailed information, refer to:

- [Database Schema](./database-schema.md)
- [API Documentation](./api-docs.md)
- [Payment System](./payment-system.md)
- [Frontend Architecture](./frontend-architecture.md) 