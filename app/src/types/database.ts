import { Database, Json, Tables, TablesInsert, TablesUpdate, Enums } from '../../../supabase/database.types';

// Re-export the types
export type {   Tables,    };

// Define shorthand types for commonly used tables
type Profile = Tables<'profiles'>;
type List = Tables<'lists'>;
type ListProfile = Tables<'list_profiles'>;
type Message = Tables<'messages'>;
type CampaignProfile = Tables<'campaign_profiles'>;
type User = Tables<'users'>;
type UserUsage = Tables<'user_usage'>;
type Subscription = Tables<'subscriptions'>;
type SubscriptionPayment = Tables<'subscription_payments'>;
type UsageLimit = Tables<'usage_limits'>;
type ChatRoom = Tables<'chat_rooms'>;
type ChatMessage = Tables<'chat_messages'>;
type Ticket = Tables<'tickets'>;
type TicketMessage = Tables<'ticket_messages'>;
type Referral = Tables<'referrals'>;
type ConversionEvent = Tables<'conversion_events'>;
type EmailTemplate = Tables<'email_templates'>;
type TrackingConfig = Tables<'tracking_config'>;
type CheckoutSession = Tables<'checkout_sessions'>;
type Plan = Tables<'plans'>;

// Define insert types
type ProfileInsert = TablesInsert<'profiles'>;
type ListInsert = TablesInsert<'lists'>;
type ListProfileInsert = TablesInsert<'list_profiles'>;
type MessageInsert = TablesInsert<'messages'>;
type CampaignProfileInsert = TablesInsert<'campaign_profiles'>;

// Define update types
type ProfileUpdate = TablesUpdate<'profiles'>;
type ListUpdate = TablesUpdate<'lists'>;
type MessageUpdate = TablesUpdate<'messages'>;
type CampaignProfileUpdate = TablesUpdate<'campaign_profiles'>;

// Define enum types
type SubscriptionStatus = Enums<'subscription_status'>;
type SubscriptionTier = Enums<'subscription_tier'>;
type UserRoleType = Enums<'user_role'>;
type MessageType = Enums<'message_type'>;