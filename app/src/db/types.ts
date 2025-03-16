import { supabaseClient } from '../lib/supabaseClient';
import { handleSupabaseError } from '../lib/error-handlers';
import { Tables } from '../types/database';

// Export types from database schema
export type Profile = Tables<'profiles'>;
export type List = Tables<'lists'>;
type ListProfile = Tables<'list_profiles'>;
type Message = Tables<'messages'>;
type CampaignProfile = Tables<'campaign_profiles'>;
export type User = Tables<'users'>;
type UserUsage = Tables<'user_usage'>;
type Subscription = Tables<'subscriptions'>;
type SubscriptionPayment = Tables<'subscription_payments'>;
type UsageLimit = Tables<'usage_limits'>;
export type ChatRoom = Tables<'chat_rooms'>;
export type ChatMessage = Tables<'chat_messages'>;
export type Ticket = Tables<'tickets'>;
export type TicketMessage = Tables<'ticket_messages'>;
type Referral = Tables<'referrals'>;
export type ConversionEvent = Tables<'conversion_events'>;
export type EmailTemplate = Tables<'email_templates'>;
type TrackingConfig = Tables<'tracking_config'>;

// Custom types
export type AdminAlert = {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  created_at: string;
  read: boolean;
  metadata?: Record<string, any>;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  type: 'info' | 'warning' | 'error' | 'success';
  link?: string;
  metadata?: Record<string, any>;
};

export type DashboardStats = {
  total_users: number;
  active_users: number;
  new_users_today: number;
  total_revenue: number;
  conversion_rate: number;
};

export type UserSettings = {
  id: string;
  user_id: string;
  email_notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  created_at: string;
  updated_at: string;
};

type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  features: string[];
  is_popular: boolean;
  created_at: string;
  updated_at: string;
};

export type Invoice = {
  id: string;
  user_id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  created_at: string;
  due_date: string;
  paid_at?: string;
  items: Array<{
    description: string;
    amount: number;
    quantity: number;
  }>;
};

export type MetricData = {
  id: string;
  name: string;
  value: number;
  timestamp: string;
  metadata?: Record<string, any>;
};

export type ErrorLog = {
  id: string;
  message: string;
  stack_trace: string;
  user_id?: string;
  browser: string;
  os: string;
  created_at: string;
  resolved: boolean;
  resolved_at?: string;
  metadata?: Record<string, any>;
};

// Common response types
export interface DbResponse<T> {
  data: T | null;
  error: Error | null;
}

export interface DbListResponse<T> {
  data: T[];
  count?: number;
  error: Error | null;
}

export interface DbSuccessResponse {
  success: boolean;
  error: Error | null;
}
