# LeadsBuilder Documentation

Welcome to the LeadsBuilder documentation. This documentation provides a comprehensive overview of the LeadsBuilder application architecture, database schema, and implementation details.

## Table of Contents

### Architecture
- [Architecture Overview](./architecture.md) - High-level overview of the system architecture
- [Frontend Architecture](./frontend-architecture.md) - Details of the React frontend implementation
- [API Documentation](./api-docs.md) - API endpoints and usage examples

### Database
- [Database Schema](./database-schema.md) - Detailed database schema documentation

### Features
- [Payment System](./payment-system.md) - Payment flow and Stripe integration

### Development
- [Tasks](./tasks.md) - Development tasks and roadmap

## Getting Started

If you're new to the project, we recommend starting with the [Architecture Overview](./architecture.md) to understand the high-level structure of the application. Then, depending on your area of focus:

- **Frontend Developers**: Read the [Frontend Architecture](./frontend-architecture.md) document
- **Backend Developers**: Read the [Database Schema](./database-schema.md) and [API Documentation](./api-docs.md)
- **Payment Integration**: Read the [Payment System](./payment-system.md) document

## Key Concepts

### Payment-First Registration

LeadsBuilder implements a "payment-first" registration flow where users:
1. Select a subscription plan
2. Enter registration information
3. Complete payment through Stripe
4. Gain access to the application

This approach ensures that only paying customers get access to the system.

### Database Structure

The application uses a PostgreSQL database managed by Supabase with the following key tables:
- `users` - User accounts
- `subscriptions` - User subscriptions
- `plans` - Available subscription plans
- `lists` - User-created lists
- `profiles` - Lead profiles

### Edge Functions

Serverless functions handle complex operations like:
- Payment processing with Stripe
- Subscription management
- Webhook handling

## Contributing

When contributing to the documentation:
1. Follow the existing structure and formatting
2. Update diagrams when making architectural changes
3. Keep code examples up-to-date with the actual implementation
4. Add cross-references between related documents

## Further Resources

- [Supabase Documentation](https://supabase.io/docs)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [React Documentation](https://reactjs.org/docs/getting-started.html) 