// app/src/db/Pricing/getPlans.ts
import { supabaseClient } from '../../lib/supabaseClient';
import { DbResponse } from '../types';

export interface Plan {
  id: string;
  name: string;
  price: number;
  price_display: string;
  period: string;
  priceid: string;
  features: string[];
  popular: boolean;
  description?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch all available plans from the database
 * @returns Promise with plans data or error
 */
export async function getPlans(): Promise<DbResponse<Plan[]>> {
  try {
    const { data, error } = await supabaseClient
      .from('plans')
      .select('*')
      .order('price', { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching plans:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('An error occurred while fetching plans')
    };
  }
}

/**
 * Fetch plans by period
 * @param period The billing period (par mois, par trimestre, par an)
 * @returns Promise with filtered plans data or error
 */
async function getPlansByPeriod(period: string): Promise<DbResponse<Plan[]>> {
  try {
    const { data, error } = await supabaseClient
      .from('plans')
      .select('*')
      .eq('period', period)
      .order('price', { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching plans by period:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('An error occurred while fetching plans')
    };
  }
}

/**
 * Get a specific plan by ID
 * @param planId The plan ID
 * @returns Promise with plan data or error
 */
async function getPlanById(planId: string): Promise<DbResponse<Plan>> {
  try {
    const { data, error } = await supabaseClient
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching plan by ID:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('An error occurred while fetching the plan')
    };
  }
}

/**
 * Get a specific plan by Stripe price ID
 * @param priceId The Stripe price ID
 * @returns Promise with plan data or error
 */
async function getPlanByPriceId(priceId: string): Promise<DbResponse<Plan>> {
  try {
    const { data, error } = await supabaseClient
      .from('plans')
      .select('*')
      .eq('priceid', priceId)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error('Error fetching plan by price ID:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('An error occurred while fetching the plan')
    };
  }
}