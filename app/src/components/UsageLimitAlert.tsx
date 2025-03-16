import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useUsageLimits } from '../hooks/useUsageLimits';

interface UsageLimitAlertProps {
  type: 'search' | 'list' | 'crm';
}

export function UsageLimitAlert({ type }: UsageLimitAlertProps) {
  const { limits, usage, loading } = useUsageLimits();

  if (loading || !limits || !usage) return null;

  const getUsageInfo = () => {
    switch (type) {
      case 'search':
        return {
          current: usage.searchesUsed,
          max: limits.monthlySearches,
          label: 'recherches'
        };
      case 'list':
        return {
          current: usage.listProfilesCount,
          max: limits.maxListProfiles,
          label: 'profils dans les listes'
        };
      case 'crm':
        return {
          current: usage.crmProfilesCount,
          max: limits.maxCrmProfiles,
          label: 'profils dans le CRM'
        };
    }
  };

  const info = getUsageInfo();
  const isUnlimited = info.max === -1;
  const percentage = isUnlimited ? 0 : (info.current / info.max) * 100;
  const isNearLimit = percentage >= 80;

  if (isUnlimited) return null;

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg ${
      isNearLimit ? 'bg-yellow-50 text-yellow-800' : 'bg-blue-50 text-blue-800'
    }`}>
      <AlertCircle className="w-5 h-5" />
      <span>
        {isNearLimit ? 'Attention : ' : ''}
        Vous avez utilisé {info.current} sur {info.max} {info.label}
        {isNearLimit ? ' - Envisagez de passer à un forfait supérieur' : ''}
      </span>
    </div>
  );
}
