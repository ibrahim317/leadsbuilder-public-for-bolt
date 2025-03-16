import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbResponse, DashboardStats } from '../types';

/**
 * Fetches dashboard statistics from the database
 * 
 * @returns Promise with dashboard statistics or error
 */
async function getDashboardStats(): Promise<DbResponse<DashboardStats>> {
  try {
    // Get total users count
    const { count: totalUsers, error: usersError } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (usersError) {
      return { data: null, error: handleSupabaseError(usersError) };
    }

    // Get active users (users who logged in within the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { count: activeUsers, error: activeUsersError } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('last_sign_in', thirtyDaysAgo.toISOString());
    
    if (activeUsersError) {
      return { data: null, error: handleSupabaseError(activeUsersError) };
    }

    // Get new users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count: newUsersToday, error: newUsersError } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());
    
    if (newUsersError) {
      return { data: null, error: handleSupabaseError(newUsersError) };
    }

    // Get total revenue
    const { data: payments, error: paymentsError } = await supabaseClient
      .from('subscription_payments')
      .select('amount');
    
    if (paymentsError) {
      return { data: null, error: handleSupabaseError(paymentsError) };
    }

    const totalRevenue = payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

    // Calculate conversion rate (users who have made a payment / total users)
    const { count: payingUsers, error: payingUsersError } = await supabaseClient
      .from('subscription_payments')
      .select('user_id', { count: 'exact', head: true })
      .is('status', 'paid');
    
    if (payingUsersError) {
      return { data: null, error: handleSupabaseError(payingUsersError) };
    }

    const conversionRate = totalUsers ? (payingUsers || 0) / totalUsers : 0;

    const dashboardStats: DashboardStats = {
      total_users: totalUsers || 0,
      active_users: activeUsers || 0,
      new_users_today: newUsersToday || 0,
      total_revenue: totalRevenue,
      conversion_rate: conversionRate
    };

    return { data: dashboardStats, error: null };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { data: null, error: handleSupabaseError(error) };
  }
} 