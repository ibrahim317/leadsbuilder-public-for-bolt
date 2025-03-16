import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { DbListResponse } from '../types';
import { FunnelStep, ListStats } from '../../types/crm';

export interface ListFunnel extends ListStats {
  funnel: FunnelStep[];
  totalMessages: number;
}

/**
 * Fetches leads data for CRM dashboard
 * 
 * @param userId - The ID of the user to fetch leads for
 * @returns Promise with leads data or error
 */
export async function getLeads(userId: string): Promise<DbListResponse<ListFunnel>> {
  try {
    // 1. Récupérer les listes
    const { data: listsData, error: listsError } = await supabaseClient
      .from('lists')
      .select(`
        id,
        name,
        list_profiles (count)
      `)
      .eq('user_id', userId);

    if (listsError) {
      console.error('Error fetching lists:', listsError);
      return { data: [], error: handleSupabaseError(listsError) };
    }

    // 2. Récupérer les profils en campagne
    const { data: campaignData, error: campaignError } = await supabaseClient
      .from('campaign_profiles')
      .select('profile_id, list_id')
      .eq('user_id', userId);

    if (campaignError) {
      console.error('Error fetching campaign profiles:', campaignError);
      return { data: [], error: handleSupabaseError(campaignError) };
    }

    // 3. Récupérer les messages
    const { data: messagesData, error: messagesError } = await supabaseClient
      .from('messages')
      .select('*');

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return { data: [], error: handleSupabaseError(messagesError) };
    }

    // Define funnel colors
    const FUNNEL_COLORS = {
      '1er_message': 'bg-blue-500',
      '1er_followup': 'bg-indigo-500',
      '2eme_followup': 'bg-purple-500',
      '3eme_followup': 'bg-pink-500',
      '4eme_followup': 'bg-rose-500',
      '5eme_followup': 'bg-orange-500',
      'rdv': 'bg-green-500',
      'pas_interesse': 'bg-red-500'
    };

    // Traitement des données par liste
    const funnels: ListFunnel[] = (listsData || []).map(list => {
      const totalCount = list.list_profiles?.reduce((acc, curr) => acc + curr.count, 0) || 0;
      const listProfiles = campaignData?.filter(cp => cp.list_id === list.id) || [];
      const contactedCount = new Set(
        listProfiles
          .filter(cp => messagesData?.some(m => m.profile_id === cp.profile_id))
          .map(cp => cp.profile_id)
      ).size;

      // Messages pour cette liste
      const listMessages = messagesData?.filter(message =>
        listProfiles.some(cp => cp.profile_id === message.profile_id)
      ) || [];

      // Calcul de l'entonnoir pour cette liste
      const messagesByType = new Map<string, number>();
      listMessages.forEach(message => {
        messagesByType.set(
          message.type,
          (messagesByType.get(message.type) || 0) + 1
        );
      });

      const totalMessages = listMessages.length;
      const funnel: FunnelStep[] = [
        {
          type: '1er_message',
          label: '1er message',
          count: messagesByType.get('1er_message') || 0,
          percentage: totalMessages > 0 ? (messagesByType.get('1er_message') || 0) / totalMessages * 100 : 0,
          color: FUNNEL_COLORS['1er_message']
        },
        {
          type: '1er_followup',
          label: '1er follow-up',
          count: messagesByType.get('1er_followup') || 0,
          percentage: totalMessages > 0 ? (messagesByType.get('1er_followup') || 0) / totalMessages * 100 : 0,
          color: FUNNEL_COLORS['1er_followup']
        },
        {
          type: '2eme_followup',
          label: '2ème follow-up',
          count: messagesByType.get('2eme_followup') || 0,
          percentage: totalMessages > 0 ? (messagesByType.get('2eme_followup') || 0) / totalMessages * 100 : 0,
          color: FUNNEL_COLORS['2eme_followup']
        },
        {
          type: '3eme_followup',
          label: '3ème follow-up',
          count: messagesByType.get('3eme_followup') || 0,
          percentage: totalMessages > 0 ? (messagesByType.get('3eme_followup') || 0) / totalMessages * 100 : 0,
          color: FUNNEL_COLORS['3eme_followup']
        },
        {
          type: '4eme_followup',
          label: '4ème follow-up',
          count: messagesByType.get('4eme_followup') || 0,
          percentage: totalMessages > 0 ? (messagesByType.get('4eme_followup') || 0) / totalMessages * 100 : 0,
          color: FUNNEL_COLORS['4eme_followup']
        },
        {
          type: '5eme_followup',
          label: '5ème follow-up',
          count: messagesByType.get('5eme_followup') || 0,
          percentage: totalMessages > 0 ? (messagesByType.get('5eme_followup') || 0) / totalMessages * 100 : 0,
          color: FUNNEL_COLORS['5eme_followup']
        },
        {
          type: 'rdv',
          label: 'RDV',
          count: messagesByType.get('rdv') || 0,
          percentage: totalMessages > 0 ? (messagesByType.get('rdv') || 0) / totalMessages * 100 : 0,
          color: FUNNEL_COLORS['rdv']
        },
        {
          type: 'pas_interesse',
          label: 'Pas intéressé',
          count: messagesByType.get('pas_interesse') || 0,
          percentage: totalMessages > 0 ? (messagesByType.get('pas_interesse') || 0) / totalMessages * 100 : 0,
          color: FUNNEL_COLORS['pas_interesse']
        }
      ];

      return {
        id: list.id,
        name: list.name,
        contactedCount,
        totalCount,
        funnel,
        totalMessages
      };
    });

    return { data: funnels, error: null };
  } catch (error) {
    console.error('Error in getLeads:', error);
    return { data: [], error: handleSupabaseError(error) };
  }
} 