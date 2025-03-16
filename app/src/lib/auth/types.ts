import type { User, Session } from '@supabase/supabase-js';

// Interface for temporary user data
export interface TempUserData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  activity?: string;
  token: string;
  userId: string;
}

// Response types
interface AuthResponse<T> {
  data: T | null;
  error: Error | null;
}

interface UserResponse {
  user: User | null;
  error: Error | null;
}

interface SessionResponse {
  session: Session | null;
  error: Error | null;
}

interface ErrorResponse {
  error: Error | null;
}

// Admin status storage key
export const ADMIN_STATUS_KEY = 'leadbuilder_is_admin'; 