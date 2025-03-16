# Frontend Architecture

This document provides a detailed overview of the frontend architecture in LeadsBuilder, including the component structure, state management, and data flow.

## Overview

The LeadsBuilder frontend is built with React and TypeScript, following a component-based architecture. It uses modern React patterns including hooks, contexts, and functional components.

## Directory Structure

```
app/src/
├── components/       # Reusable UI components
├── contexts/         # React contexts for state management
├── db/               # Database interaction layer
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and helpers
├── pages/            # Page components
└── types/            # TypeScript type definitions
```

## Key Components

### Pages

Pages represent the top-level routes in the application. Each page is a React component that corresponds to a specific URL route.

**Key Pages:**
- `pages/auth/LoginPage.tsx` - User login
- `pages/auth/RegisterPage.tsx` - User registration
- `pages/pricing/PricingPage.tsx` - Subscription plan selection
- `pages/payment/success.tsx` - Payment success handling
- `pages/dashboard/DashboardPage.tsx` - Main user dashboard

### Components

Components are reusable UI elements that can be composed to build pages. They follow a functional approach with hooks for state and effects.

**Component Categories:**
1. **Layout Components**
   - `Header.tsx` - Main navigation header
   - `Sidebar.tsx` - Dashboard sidebar navigation
   - `Footer.tsx` - Page footer

2. **Form Components**
   - `Input.tsx` - Text input fields
   - `Button.tsx` - Action buttons
   - `Select.tsx` - Dropdown selectors

3. **Data Display Components**
   - `Table.tsx` - Data tables
   - `Card.tsx` - Content cards
   - `Modal.tsx` - Modal dialogs

4. **Feedback Components**
   - `Alert.tsx` - Alert messages
   - `Toast.tsx` - Toast notifications
   - `Spinner.tsx` - Loading indicators

### Contexts

Contexts provide a way to share state across components without prop drilling. They use React's Context API for state management.

**Key Contexts:**
- `AuthContext.tsx` - Manages user authentication state
- `SubscriptionContext.tsx` - Manages subscription information
- `UIContext.tsx` - Manages UI state (themes, modals, etc.)

### Hooks

Custom hooks encapsulate reusable logic that can be shared across components.

**Key Hooks:**
- `useAuth.ts` - Authentication-related functionality
- `useSubscription.ts` - Subscription-related functionality
- `useForm.ts` - Form handling and validation
- `useApi.ts` - API request handling

## Data Flow

The frontend follows a unidirectional data flow pattern:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  User Actions   │────▶│  State Updates  │────▶│   UI Updates    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                                               │
        │                                               │
        ▼                                               │
┌─────────────────┐                                     │
│                 │                                     │
│  API Requests   │◀────────────────────────────────────┘
│                 │
└─────────────────┘
```

1. **User Actions**: User interacts with the UI (clicks, form submissions, etc.)
2. **State Updates**: Component or context state is updated
3. **UI Updates**: Components re-render based on new state
4. **API Requests**: Data is fetched from or sent to the backend

## Database Layer

The `db/` directory contains modules for interacting with the Supabase backend. Each module corresponds to a specific domain and provides a clean API for data operations.

**Key Modules:**
- `db/Auth/` - Authentication operations
- `db/Payment/` - Payment and subscription operations
- `db/Billing/` - Billing and invoice operations
- `db/User/` - User profile operations
- `db/List/` - List management operations

**Example Usage:**
```typescript
import { Payment } from '../../db';

async function handleSubscribe() {
  const { data, error } = await Payment.createCheckoutSession({
    priceId: 'price_123',
    planName: 'Pro',
    customerEmail: 'user@example.com'
  });
  
  if (error) {
    // Handle error
    return;
  }
  
  // Redirect to checkout
  window.location.href = data.url;
}
```

## Authentication Flow

The authentication flow is managed by the `AuthContext` and related components:

1. **Login/Registration**:
   - User enters credentials
   - Credentials are sent to Supabase Auth
   - JWT token is received and stored
   - User state is updated in `AuthContext`

2. **Session Management**:
   - `AuthContext` checks for existing session on app load
   - Session is refreshed automatically when needed
   - Protected routes redirect unauthenticated users to login

3. **Logout**:
   - User clicks logout
   - Session is cleared from storage
   - User state is reset in `AuthContext`
   - User is redirected to login page

## Routing

Routing is handled using React Router. Routes are defined in a central location and include both public and protected routes.

**Route Types:**
- **Public Routes**: Accessible without authentication (login, register, pricing)
- **Protected Routes**: Require authentication (dashboard, settings, lists)
- **Special Routes**: Handle specific flows (payment success, verification)

**Example Route Structure:**
```typescript
<Routes>
  {/* Public Routes */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/pricing" element={<PricingPage />} />
  
  {/* Protected Routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="/lists" element={<ListsPage />} />
  </Route>
  
  {/* Special Routes */}
  <Route path="/payment/success" element={<PaymentSuccessPage />} />
</Routes>
```

## State Management

State management follows a hybrid approach:

1. **Local Component State**: For UI-specific state that doesn't need to be shared
2. **Context API**: For shared state across components
3. **URL Parameters**: For state that should be reflected in the URL

**State Categories:**
- **Authentication State**: Current user, permissions
- **Subscription State**: Plan details, status
- **UI State**: Theme, sidebar state, active modals
- **Form State**: Input values, validation errors
- **Data State**: Lists, profiles, campaigns

## Error Handling

Error handling is implemented at multiple levels:

1. **API Level**: Errors from API calls are caught and formatted
2. **Component Level**: Components handle and display relevant errors
3. **Global Level**: Unexpected errors are caught by an error boundary

**Error Handling Pattern:**
```typescript
try {
  const { data, error } = await someApiCall();
  
  if (error) {
    // Handle expected error
    setError(error.message);
    return;
  }
  
  // Process data
  setData(data);
} catch (unexpectedError) {
  // Handle unexpected error
  console.error('Unexpected error:', unexpectedError);
  setError('An unexpected error occurred');
}
```

## Styling

The application uses a combination of:

1. **Tailwind CSS**: For utility-based styling
2. **CSS Modules**: For component-specific styles
3. **Global CSS**: For app-wide styles and variables

**Style Organization:**
- Base styles in `app/src/index.css`
- Component-specific styles in `[ComponentName].module.css`
- Tailwind utility classes directly in components

## Performance Optimization

Several techniques are used to optimize performance:

1. **Code Splitting**: Using React.lazy and Suspense
2. **Memoization**: Using React.memo, useMemo, and useCallback
3. **Virtualization**: For long lists and tables
4. **Lazy Loading**: For images and non-critical resources

## Testing

The frontend includes several types of tests:

1. **Unit Tests**: For individual components and functions
2. **Integration Tests**: For component interactions
3. **End-to-End Tests**: For complete user flows

**Testing Tools:**
- Jest for unit and integration tests
- React Testing Library for component tests
- Cypress for end-to-end tests

## Build and Deployment

The frontend is built using Vite and deployed as a static site:

1. **Development**: `npm run dev` - Starts development server
2. **Build**: `npm run build` - Creates production build
3. **Preview**: `npm run preview` - Previews production build locally

## Best Practices

The codebase follows these best practices:

1. **Component Composition**: Building complex UIs from simple components
2. **Single Responsibility**: Each component has a single responsibility
3. **DRY Principle**: Avoiding code duplication through abstraction
4. **Separation of Concerns**: UI logic separate from business logic
5. **Accessibility**: Following WCAG guidelines for accessibility
6. **Responsive Design**: Adapting to different screen sizes
7. **Progressive Enhancement**: Core functionality works without JS

## Future Improvements

Planned improvements to the frontend architecture:

1. **State Management**: Consider Redux or Zustand for more complex state
2. **Performance Monitoring**: Add real-time performance monitoring
3. **A/B Testing**: Implement infrastructure for A/B testing
4. **Internationalization**: Add support for multiple languages
5. **PWA Features**: Add offline support and installability 