import { supabaseClient } from '../supabaseClient';

/**
 * Check if user has admin role
 */
export async function checkAdminRole(userId: string): Promise<boolean> {
  try {
    // For now, we'll return true
    // This should be replaced with a proper check against the users table
    // when it's configured
    return true;
    
    /* To be implemented when users table is configured
    const { data, error } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking admin role:', error);
      return false;
    }

    return data?.role === 'admin';
    */
  } catch (error) {
    console.error('Check admin role error:', error);
    return false;
  }
} 