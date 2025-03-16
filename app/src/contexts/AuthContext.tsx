import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabaseClient } from '../lib/supabaseClient';
import { 
  TempUserData, 
  signIn as authSignIn, 
  signOut as authSignOut, 
  resetPassword as authResetPassword,
  getSession as authGetSession,
  checkAdminRole as authCheckAdminRole
} from '../lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  tempUserData: TempUserData | null;
  setTempUserData: (data: TempUserData | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [tempUserData, setTempUserData] = useState<TempUserData | null>(() => {
    const savedData = localStorage.getItem('tempUserData');
    return savedData ? JSON.parse(savedData) : null;
  });

  useEffect(() => {
    // Save temp user data to localStorage when it changes
    if (tempUserData) {
      localStorage.setItem('tempUserData', JSON.stringify(tempUserData));
    } else {
      localStorage.removeItem('tempUserData');
    }
  }, [tempUserData]);

  useEffect(() => {
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event: any, session: Session | null) => {
        if (session?.user) {
          setUser(session.user);
          const isAdminUser = await authCheckAdminRole(session.user.id);
          setIsAdmin(isAdminUser);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
        
        if (event === 'SIGNED_IN' && tempUserData) {
          // Clear temp user data when user signs in
          setTempUserData(null);
        }
      }
    );

    // Get initial session
    const initAuth = async () => {
      const { session } = await authGetSession();
      
      if (session?.user) {
        setUser(session.user);
        const isAdminUser = await authCheckAdminRole(session.user.id);
        setIsAdmin(isAdminUser);
      }
      
      setLoading(false);
    };

    initAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { user, error } = await authSignIn(email, password);
      
      if (error) {
        setError(error.message);
        throw error;
      }
      
      if (user) {
        const isAdminUser = await authCheckAdminRole(user.id);
        setIsAdmin(isAdminUser);
      }
    } catch (err) {
      console.error('Error signing in:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await authSignOut();
      
      if (error) {
        setError(error.message);
        throw error;
      }
      
      setIsAdmin(false);
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during sign out');
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setError(null);
      const { error } = await authResetPassword(email);
      
      if (error) {
        setError(error.message);
        throw error;
      }
    } catch (err) {
      console.error('Error resetting password:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during password reset');
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    isAdmin,
    tempUserData,
    setTempUserData,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 