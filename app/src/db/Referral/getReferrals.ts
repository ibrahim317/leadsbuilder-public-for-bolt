import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbListResponse } from '../types';

/**
 * Interface representing a referral
 */
export interface Referral {
  id: string;
  code: string;
  status: string;
  created_at: string;
  converted_at: string | null;
  reward_status: string;
  referred: {
    email: string;
  } | null;
  referrer_id: string;
  referred_id: string | null;
}

/**
 * Fetches referrals for a user
 * @param userId The ID of the user to fetch referrals for
 * @returns A promise with the list of referrals or an error
 */
export async function getReferrals(userId: string): Promise<DbListResponse<Referral>> {
  try {
    // Fetch referrals where the user is the referrer and there is a referred user
    const { data, error } = await supabaseClient
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)
      .not('referred_id', 'is', null)
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as Referral[],
      error: null
    };
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return {
      data: [],
      error: handleSupabaseError(error)
    };
  }
} 