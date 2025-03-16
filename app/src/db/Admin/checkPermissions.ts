import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Interface for permission check response
 */
interface PermissionCheckResponse {
  isAdmin: boolean;
  role: string | null;
  permissions: string[];
}

/**
 * Checks if a user has admin permissions
 * 
 * @param userId - The ID of the user to check permissions for
 * @returns Promise with permission check response or error
 */
export async function checkPermissions(userId: string): Promise<DbResponse<PermissionCheckResponse>> {
  try {
    // Get user profile with role
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role, permissions')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    // Check if user has admin role
    const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin';
    
    // Get permissions array or default to empty array
    const permissions = profile?.permissions || [];
    
    return {
      data: {
        isAdmin,
        role: profile?.role || null,
        permissions
      },
      error: null
    };
  } catch (error) {
    console.error('Error checking permissions:', error);
    return {
      data: null,
      error: handleSupabaseError(error)
    };
  }
} 