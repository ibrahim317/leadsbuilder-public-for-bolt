import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Interface for delete user data response
 */
interface DeleteUserDataResponse {
  success: boolean;
  message: string;
}

/**
 * Deletes user data for GDPR compliance
 * This is a destructive operation that anonymizes or removes user data
 * 
 * @param userId - The ID of the user whose data should be deleted
 * @param deleteAccount - Whether to completely delete the account (true) or just anonymize data (false)
 * @returns Promise with success status or error
 */
export async function deleteUserData(
  userId: string,
  deleteAccount: boolean = false
): Promise<DbResponse<DeleteUserDataResponse>> {
  try {
    if (deleteAccount) {
      // Call RPC function to delete user account and all associated data
      const { data, error } = await supabaseClient
        .rpc('gdpr_delete_user_account', {
          user_id_param: userId
        });
      
      if (error) throw error;
      
      return {
        data: {
          success: true,
          message: 'Account and all associated data have been deleted.'
        },
        error: null
      };
    } else {
      // Call RPC function to anonymize user data but keep the account
      const { data, error } = await supabaseClient
        .rpc('gdpr_anonymize_user_data', {
          user_id_param: userId
        });
      
      if (error) throw error;
      
      return {
        data: {
          success: true,
          message: 'User data has been anonymized while preserving the account.'
        },
        error: null
      };
    }
  } catch (error) {
    console.error('Error deleting user data:', error);
    return {
      data: null,
      error: handleSupabaseError(error)
    };
  }
} 