import { supabaseClient } from '../supabaseClient';

/**
 * Check if email is verified
 */
async function isEmailVerified(): Promise<boolean> {
  try {
    const { data } = await supabaseClient.auth.getUser();
    return data.user?.email_confirmed_at != null;
  } catch (error) {
    console.error('Check email verification error:', error);
    return false;
  }
} 