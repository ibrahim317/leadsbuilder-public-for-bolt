import { supabaseClient } from '../supabaseClient';

/**
 * Clean up session
 */
export async function cleanupSession(): Promise<void> {
  try {
    await supabaseClient.auth.signOut();
    sessionStorage.clear();
  } catch (error) {
    console.error('Error clearing session:', error);
  }
} 