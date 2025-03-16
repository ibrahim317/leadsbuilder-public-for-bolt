import { Profile } from '../types';

/**
 * Filter options for searching profiles
 */
export interface ProfileFilter {
  keyword?: string;
  country?: string;
  lists?: string[];
  page?: number;
  perPage?: number;
} 