/**
 * Error handlers for Supabase and other services
 */

/**
 * Handle Supabase errors
 */
export const handleSupabaseError = (error: any): Error => {
  console.error('Detailed Supabase error:', error);
  
  if (!error) {
    return new Error('An unknown error occurred');
  }

  // Connection errors
  if (error.message?.includes('Failed to fetch') || error.code === 'NETWORK_ERROR') {
    return new Error('Server connection error. Please check your internet connection.');
  }

  // Authentication errors
  if (error.__isAuthError) {
    if (error.status === 500) {
      return new Error('The server is temporarily unavailable. Please try again later.');
    }
    if (error.message?.includes('Invalid login credentials')) {
      return new Error('Incorrect email or password');
    }
    if (error.message?.includes('Email not confirmed')) {
      return new Error('Please confirm your email before logging in');
    }
    if (error.message?.includes('User already registered')) {
      return new Error('An account already exists with this email');
    }
    if (error.message?.includes('database error')) {
      return new Error('Database connection error. Please try again.');
    }
    return new Error(error.message || 'Authentication error');
  }

  return new Error(error.message || 'An error occurred');
};

/**
 * Handle payment service errors
 */
export const handlePaymentError = (error: any): Error => {
  console.error('Payment error:', error);
  
  if (!error) {
    return new Error('An unknown payment error occurred');
  }

  // Handle specific payment errors here
  if (error.message?.includes('card')) {
    return new Error('There was an issue with your card. Please try another payment method.');
  }

  return new Error(error.message || 'A payment error occurred');
};