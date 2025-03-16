import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ConversionEvent } from '../../db';

export default function RecentConversions() {
  const [conversions, setConversions] = useState<ConversionEvent.ConversionEventWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecentConversions();
  }, []);

  const loadRecentConversions = async () => {
    try {
      const { data, error } = await ConversionEvent.getRecentConversions(10);

      if (error) throw error;
      
      setConversions(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des conversions récentes:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeLabel = (eventType: string): string => {
    switch (eventType) {
      case 'page_view':
        return 'Vue de page';
      case 'signup':
        return 'Inscription';
      case 'subscription':
        return 'Abonnement';
      case 'referral':
        return 'Parrainage';
      case 'feature_usage':
        return 'Utilisation fonctionnalité';
      default:
        return eventType;
    }
  };

  const getEventTypeColor = (eventType: string): string => {
    switch (eventType) {
      case 'page_view':
        return 'bg-gray-100 text-gray-800';
      case 'signup':
        return 'bg-green-100 text-green-800';
      case 'subscription':
        return 'bg-purple-100 text-purple-800';
      case 'referral':
        return 'bg-yellow-100 text-yellow-800';
      case 'feature_usage':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (conversions.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Aucune conversion récente à afficher
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Utilisateur
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Événement
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Source
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {conversions.map((conversion) => (
            <tr key={conversion.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {conversion.user?.full_name?.charAt(0) || conversion.user?.email?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {conversion.user?.full_name || 'Utilisateur inconnu'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {conversion.user?.email || conversion.user_id}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEventTypeColor(conversion.event_type)}`}>
                  {getEventTypeLabel(conversion.event_type)}
                </span>
                {conversion.metadata && Object.keys(conversion.metadata).length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {Object.entries(conversion.metadata).map(([key, value]) => (
                      <div key={key}>{key}: {typeof value === 'object' ? JSON.stringify(value) : value}</div>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {conversion.source || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDistanceToNow(new Date(conversion.created_at), { addSuffix: true, locale: fr })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
