import { useState, useEffect } from 'react';
import { supabaseClient } from '../lib/supabaseClient';
import { handleSupabaseError } from '../lib/error-handlers';

interface UsageLimits {
  monthlySearches: number;
  maxListProfiles: number;
  maxCrmProfiles: number;
}

interface CurrentUsage {
  searchesUsed: number;
  listProfilesCount: number;
  crmProfilesCount: number;
  lastResetDate: Date;
}

export function useUsageLimits() {
  const [limits, setLimits] = useState<UsageLimits | null>(null);
  const [usage, setUsage] = useState<CurrentUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLimits();
  }, []);

  const fetchLimits = async () => {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        setLimits(null);
        setUsage(null);
        setLoading(false);
        return;
      }

      // Récupérer les limites basées sur le tier d'abonnement
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .select('subscription_tier')
        .eq('id', session.user.id)
        .single();

      if (userError) throw userError;

      const { data: limitsData, error: limitsError } = await supabaseClient
        .from('usage_limits')
        .select('*')
        .eq('tier', userData.subscription_tier)
        .single();

      if (limitsError) throw limitsError;

      // Récupérer l'utilisation actuelle
      const { data: usageData, error: usageError } = await supabaseClient
        .from('user_usage')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (usageError && usageError.code !== 'PGRST116') throw usageError;

      setLimits({
        monthlySearches: limitsData.monthly_searches,
        maxListProfiles: limitsData.max_list_profiles,
        maxCrmProfiles: limitsData.max_crm_profiles
      });

      if (usageData) {
        setUsage({
          searchesUsed: usageData.monthly_searches_used,
          listProfilesCount: usageData.list_profiles_count,
          crmProfilesCount: usageData.crm_profiles_count,
          lastResetDate: new Date(usageData.last_reset_date)
        });
      } else {
        setUsage({
          searchesUsed: 0,
          listProfilesCount: 0,
          crmProfilesCount: 0,
          lastResetDate: new Date()
        });
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des limites:', err);
      setError(handleSupabaseError(err).message);
    } finally {
      setLoading(false);
    }
  };

  const checkSearchLimit = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabaseClient
        .rpc('check_search_limit', {
          user_id: (await supabaseClient.auth.getSession()).data.session?.user.id
        });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Erreur lors de la vérification de la limite de recherche:', err);
      return false;
    }
  };

  const incrementSearchCount = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabaseClient
        .rpc('increment_search_count', {
          user_id: (await supabaseClient.auth.getSession()).data.session?.user.id
        });

      if (error) throw error;
      
      // Mettre à jour l'état local après l'incrémentation
      if (data && usage) {
        setUsage({
          ...usage,
          searchesUsed: usage.searchesUsed + 1
        });
      }

      return data;
    } catch (err) {
      console.error('Erreur lors de l\'incrémentation du compteur de recherche:', err);
      return false;
    }
  };

  const checkListProfileLimit = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabaseClient
        .rpc('check_list_profile_limit', {
          user_id: (await supabaseClient.auth.getSession()).data.session?.user.id
        });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Erreur lors de la vérification de la limite de profils dans la liste:', err);
      return false;
    }
  };

  const checkCrmProfileLimit = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabaseClient
        .rpc('check_crm_profile_limit', {
          user_id: (await supabaseClient.auth.getSession()).data.session?.user.id
        });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Erreur lors de la vérification de la limite de profils dans le CRM:', err);
      return false;
    }
  };

  return {
    limits,
    usage,
    loading,
    error,
    checkSearchLimit,
    incrementSearchCount,
    checkListProfileLimit,
    checkCrmProfileLimit,
    refresh: fetchLimits
  };
}