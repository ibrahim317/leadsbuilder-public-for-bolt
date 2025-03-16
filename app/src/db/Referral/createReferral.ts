import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Interface for the referral code response
 */
interface ReferralCodeResponse {
  code: string;
}

/**
 * Creates or retrieves a referral code for a user
 * @param userId The ID of the user to create/retrieve a referral code for
 * @returns A promise with the referral code or an error
 */
export async function createReferral(userId: string): Promise<DbResponse<ReferralCodeResponse>> {
  try {
    // First, check if the user already has a referral code
    const { data: existingCode, error: codeError } = await supabaseClient
      .from('referrals')
      .select('code')
      .eq('referrer_id', userId)
      .is('referred_id', null)
      .single();

    // If there's an error other than "not found", throw it
    if (codeError && codeError.code !== 'PGRST116') {
      throw codeError;
    }

    // If a code exists, return it
    if (existingCode) {
      return {
        data: { code: existingCode.code },
        error: null
      };
    }

    // Otherwise, generate a new code
    const { data: newReferral, error: createError } = await supabaseClient
      .rpc('generate_referral_code')
      .then(async (code) => {
        if (!code) throw new Error('Unable to generate referral code');

        return await supabaseClient
          .from('referrals')
          .insert([
            {
              referrer_id: userId,
              code: code
            },
          ])
          .select()
          .single();
      });

    if (createError) {
      throw createError;
    }

    return {
      data: { code: newReferral.code },
      error: null
    };
  } catch (error) {
    console.error('Error creating referral:', error);
    return {
      data: null,
      error: handleSupabaseError(error)
    };
  }
} 