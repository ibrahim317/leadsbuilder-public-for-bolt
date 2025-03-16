import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';
import { Plan } from './getPlans';
import { Billing } from '../index';

/**
 * Fetches the current plan for a user based on their subscription
 * @param userId The ID of the user
 * @returns A promise with the current plan or an error
 */
async function getCurrentPlan(userId: string): Promise<DbResponse<Plan | null>> {
  try {
    // First, get the user's subscription
    const subscriptionResponse = await Billing.getSubscription(userId);
    
    if (subscriptionResponse.error) {
      throw subscriptionResponse.error;
    }
    
    const subscription = subscriptionResponse.data;
    
    // If no subscription or it's not active, return null
    if (!subscription || subscription.status !== 'active') {
      return {
        data: null,
        error: null
      };
    }
    
    // Get the plan based on the plan_id from the subscription
    const { data, error } = await supabaseClient
      .from('plans')
      .select('*')
      .eq('id', subscription.plan_id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      data: data as Plan,
      error: null
    };
  } catch (error) {
    console.error('Error fetching current plan:', error);
    return {
      data: null,
      error: handleSupabaseError(error)
    };
  }
} 