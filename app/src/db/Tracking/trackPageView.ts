import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse } from '../types';

/**
 * Interface for page view data
 */
interface PageViewData {
  page: string;
  referrer?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

/**
 * Interface for tracked page view response
 */
interface TrackedPageView extends PageViewData {
  id: string;
  user_id: string | null;
  created_at: string;
}

/**
 * Tracks a page view in the database
 * 
 * @param userId - The ID of the user associated with the page view (optional)
 * @param pageView - The page view data to track
 * @returns Promise with the tracked page view or error
 */
async function trackPageView(
  userId: string | null,
  pageView: PageViewData
): Promise<DbResponse<TrackedPageView>> {
  try {
    const pageViewData = {
      user_id: userId,
      page: pageView.page,
      referrer: pageView.referrer || null,
      duration: pageView.duration || null,
      metadata: pageView.metadata || {}
    };

    const { data, error } = await supabaseClient
      .from('page_views')
      .insert([pageViewData])
      .select()
      .single();

    if (error) throw error;

    return {
      data: data as TrackedPageView,
      error: null
    };
  } catch (error) {
    console.error('Error tracking page view:', error);
    return {
      data: null,
      error: handleSupabaseError(error)
    };
  }
} 