import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Tracks a new conversion event
 * 
 * @param userId - ID of the user associated with the event
 * @param eventType - Type of conversion event
 * @param source - Source of the conversion (optional)
 * @param metadata - Additional data about the event (optional)
 * @returns Promise with success status or error
 */
async function trackEvent(
  userId: string,
  eventType: string,
  source?: string,
  metadata: Record<string, any> = {}
): Promise<DbResponse<{ id: string }>> {
  try {
    const { data, error } = await supabaseClient
      .from('conversion_events')
      .insert([{
        user_id: userId,
        event_type: eventType,
        source,
        metadata
      }])
      .select('id')
      .single();
    
    if (error) {
      console.error('Error tracking conversion event:', error);
      return { data: null, error: handleSupabaseError(error) };
    }
    
    return { data: { id: data.id }, error: null };
  } catch (error) {
    console.error('Error in trackEvent:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Tracks a page view event
 * 
 * @param userId - ID of the user viewing the page
 * @param page - Page being viewed
 * @param metadata - Additional data about the page view (optional)
 * @returns Promise with success status or error
 */
async function trackPageView(
  userId: string,
  page: string,
  metadata: Record<string, any> = {}
): Promise<DbResponse<{ id: string }>> {
  return trackEvent(userId, 'page_view', page, metadata);
}

/**
 * Tracks a signup event
 * 
 * @param userId - ID of the user who signed up
 * @param source - Source of the signup (optional)
 * @param metadata - Additional data about the signup (optional)
 * @returns Promise with success status or error
 */
async function trackSignup(
  userId: string,
  source?: string,
  metadata: Record<string, any> = {}
): Promise<DbResponse<{ id: string }>> {
  return trackEvent(userId, 'signup', source, metadata);
}

/**
 * Tracks a subscription event
 * 
 * @param userId - ID of the user who subscribed
 * @param plan - Subscription plan
 * @param amount - Subscription amount
 * @param metadata - Additional data about the subscription (optional)
 * @returns Promise with success status or error
 */
async function trackSubscription(
  userId: string,
  plan: string,
  amount: number,
  metadata: Record<string, any> = {}
): Promise<DbResponse<{ id: string }>> {
  return trackEvent(
    userId, 
    'subscription', 
    'stripe', 
    { ...metadata, plan, amount }
  );
}

/**
 * Tracks a feature usage event
 * 
 * @param userId - ID of the user using the feature
 * @param feature - Feature being used
 * @param metadata - Additional data about the feature usage (optional)
 * @returns Promise with success status or error
 */
async function trackFeatureUsage(
  userId: string,
  feature: string,
  metadata: Record<string, any> = {}
): Promise<DbResponse<{ id: string }>> {
  return trackEvent(userId, 'feature_usage', feature, metadata);
} 