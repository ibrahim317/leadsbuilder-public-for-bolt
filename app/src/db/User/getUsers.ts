import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { User, DbListResponse } from '../types';

/**
 * Options for filtering and paginating users
 */
export interface GetUsersOptions {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  sortBy?: keyof User;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Gets a list of users with filtering and pagination
 * @param options Options for filtering and pagination
 * @returns A promise that resolves to a DbListResponse with an array of User objects
 */
export async function getUsers(options: GetUsersOptions = {}): Promise<DbListResponse<User>> {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options;

    // Calculate offset based on page and limit
    const offset = (page - 1) * limit;
    
    // Start building the query
    let query = supabaseClient
      .from('users')
      .select('*, user_roles!inner(*)', { count: 'exact' });
    
    // Apply role filter if provided
    if (role) {
      query = query.eq('user_roles.role', role);
    }
    
    // Apply search filter if provided
    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }
    
    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    const { data, error, count } = await query;
    
    return { 
      data: data as User[] || [], 
      count: count || 0,
      error: error ? handleSupabaseError(error) : null 
    };
  } catch (error) {
    console.error('Get users error:', error);
    return { data: [], count: 0, error: handleSupabaseError(error) };
  }
} 