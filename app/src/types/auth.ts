export interface User {
  id: string;
  email: string;
  subscription_tier: 'starter' | 'pro' | 'business';
  subscription_status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  subscription_end_date?: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}