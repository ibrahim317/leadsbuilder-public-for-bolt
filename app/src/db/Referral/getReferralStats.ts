import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';
import { Referral } from './getReferrals';

/**
 * Interface for referral statistics
 */
export interface ReferralStats {
  total: number;
  converted: number;
  pending: number;
}

/**
 * Calculates referral statistics for a user
 * @param userId The ID of the user to calculate statistics for
 * @returns A promise with the referral statistics or an error
 */
export async function getReferralStats(userId: string): Promise<DbResponse<ReferralStats>> {
  try {
    // Fetch all referrals for the user
    const { data, error } = await supabaseClient
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)
      .not('referred_id', 'is', null);
    
    if (error) {
      throw error;
    }
    
    const referrals = data as Referral[];
    
    // Calculate statistics
    const total = referrals.length;
    const converted = referrals.filter(r => r.status === 'converted').length;
    const pending = total - converted;
    
    return {
      data: { total, converted, pending },
      error: null
    };
  } catch (error) {
    console.error('Error calculating referral statistics:', error);
    return {
      data: null,
      error: handleSupabaseError(error)
    };
  }
} 