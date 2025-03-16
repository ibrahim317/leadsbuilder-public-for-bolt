import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

export interface Subscription {
  id: string;
  user_id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  plan_id: string;
  plan_name: string;
  price_id: string;
  price_amount: number;
  billing_interval: 'month' | 'quarter' | 'year';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches subscription details for a user
 * 
 * @param userId - The ID of the user to fetch subscription for
 * @returns Promise with subscription data or error
 */
export async function getSubscription(userId: string): Promise<DbResponse<Subscription>> {
  try {
    const { data, error } = await supabaseClient
      .from('stripe_subscriptions')
      .select(`
        *,
        stripe_prices (
          *,
          stripe_products (*)
        )
      `)
      .eq('user_id', userId)
      .single();
    
    if (error) {
      // If the error is 'not found', return null without an error
      if (error.code === 'PGRST116') {
        return { data: null, error: null };
      }
      
      console.error('Error fetching subscription:', error);
      return { data: null, error: handleSupabaseError(error) };
    }
    
    if (!data) {
      return { data: null, error: null };
    }
    
    // Transform the data to match the Subscription type
    const subscription: Subscription = {
      id: data.id,
      user_id: data.user_id,
      status: data.status,
      plan_id: data.stripe_prices?.stripe_products?.id || '',
      plan_name: data.stripe_prices?.stripe_products?.name || '',
      price_id: data.stripe_prices?.id || '',
      price_amount: (data.stripe_prices?.unit_amount || 0) / 100, // Convert from cents to dollars/euros
      billing_interval: getBillingInterval(data.stripe_prices?.interval),
      current_period_start: data.current_period_start,
      current_period_end: data.current_period_end,
      cancel_at_period_end: data.cancel_at_period_end,
      canceled_at: data.canceled_at,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    
    return { data: subscription, error: null };
  } catch (error) {
    console.error('Error in getSubscription:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Helper function to convert Stripe interval to billing interval
 */
function getBillingInterval(interval: string | null): 'month' | 'quarter' | 'year' {
  if (!interval) return 'month';
  
  switch (interval) {
    case 'month':
      return 'month';
    case 'quarter':
      return 'quarter';
    case 'year':
      return 'year';
    default:
      return 'month';
  }
} 