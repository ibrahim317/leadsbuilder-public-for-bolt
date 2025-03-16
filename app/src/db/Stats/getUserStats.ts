import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

type UserStats = {
  total_searches: number;
  total_lists: number;
  total_profiles_saved: number;
  last_active: string | null;
  account_created: string;
  subscription_status: string | null;
  subscription_tier: string | null;
  usage_percentage: number;
};

/**
 * Fetches statistics for a specific user
 * 
 * @param userId - The ID of the user to get statistics for
 * @returns Promise with user statistics or error
 */
async function getUserStats(userId: string): Promise<DbResponse<UserStats>> {
  try {
    // Get user profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      return { data: null, error: handleSupabaseError(profileError) };
    }

    // Get user's lists count
    const { count: totalLists, error: listsError } = await supabaseClient
      .from('lists')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);
    
    if (listsError) {
      return { data: null, error: handleSupabaseError(listsError) };
    }

    // Get total profiles saved (across all lists)
    const { data: listIds, error: listIdsError } = await supabaseClient
      .from('lists')
      .select('id')
      .eq('user_id', userId);
    
    if (listIdsError) {
      return { data: null, error: handleSupabaseError(listIdsError) };
    }

    let totalProfilesSaved = 0;
    
    if (listIds && listIds.length > 0) {
      const ids = listIds.map(list => list.id);
      const { count, error: profilesError } = await supabaseClient
        .from('list_profiles')
        .select('*', { count: 'exact', head: true })
        .in('list_id', ids);
      
      if (profilesError) {
        return { data: null, error: handleSupabaseError(profilesError) };
      }
      
      totalProfilesSaved = count || 0;
    }

    // Get user's search count
    const { data: usage, error: usageError } = await supabaseClient
      .from('user_usage')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (usageError && usageError.code !== 'PGRST116') { // Not found error is ok
      return { data: null, error: handleSupabaseError(usageError) };
    }

    // Get user's subscription
    const { data: subscription, error: subscriptionError } = await supabaseClient
      .from('subscriptions')
      .select('*, subscription_tier:tier_id(name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (subscriptionError && subscriptionError.code !== 'PGRST116') { // Not found error is ok
      return { data: null, error: handleSupabaseError(subscriptionError) };
    }

    // Get usage limits
    const { data: limits, error: limitsError } = await supabaseClient
      .from('usage_limits')
      .select('*')
      .eq('tier_id', subscription?.tier_id || 'free')
      .single();
    
    if (limitsError && limitsError.code !== 'PGRST116') { // Not found error is ok
      return { data: null, error: handleSupabaseError(limitsError) };
    }

    // Calculate usage percentage
    const searchLimit = limits?.search_limit || 100;
    const searchCount = usage?.search_count || 0;
    const usagePercentage = Math.min((searchCount / searchLimit) * 100, 100);

    const userStats: UserStats = {
      total_searches: searchCount,
      total_lists: totalLists || 0,
      total_profiles_saved: totalProfilesSaved,
      last_active: profile?.last_sign_in || null,
      account_created: profile?.created_at || new Date().toISOString(),
      subscription_status: subscription?.status || null,
      subscription_tier: subscription?.subscription_tier?.name || 'Free',
      usage_percentage: usagePercentage
    };

    return { data: userStats, error: null };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 