import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';

/**
 * Interface for pricing plan feature
 */
interface PlanFeature {
  id: string;
  name: string;
  description?: string;
  included: boolean;
}

/**
 * Interface for pricing plan
 */
interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  stripe_price_id: string;
  tier: 'free' | 'starter' | 'pro' | 'enterprise';
  features: PlanFeature[];
  popular?: boolean;
  custom_price?: boolean;
}

/**
 * Retrieves available pricing plans
 * 
 * @param currency Optional currency code (default: EUR)
 * @returns Promise with pricing plans or error
 */
export async function getPricingPlans(
  currency: string = 'EUR'
): Promise<{ data: PricingPlan[] | null; error: Error | null }> {
  try {
    // Fetch pricing plans from the database
    const { data, error } = await supabaseClient
      .from('pricing_plans')
      .select(`
        id,
        name,
        description,
        price,
        currency,
        interval,
        stripe_price_id,
        tier,
        popular,
        custom_price,
        pricing_features (
          id,
          name,
          description,
          included
        )
      `)
      .eq('active', true)
      .eq('currency', currency)
      .order('price', { ascending: true });

    if (error) {
      throw error;
    }

    if (!data || !Array.isArray(data)) {
      return {
        data: [],
        error: null
      };
    }

    // Transform the data to match our interface
    const plans: PricingPlan[] = data.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      currency: plan.currency,
      interval: plan.interval,
      stripe_price_id: plan.stripe_price_id,
      tier: plan.tier,
      popular: plan.popular,
      custom_price: plan.custom_price,
      features: plan.pricing_features || []
    }));

    return {
      data: plans,
      error: null
    };
  } catch (error) {
    console.error('Error in getPricingPlans:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 