import { useState, useEffect } from 'react';
import { Loader2, RefreshCcw } from 'lucide-react';
import { supabaseClient } from '../../lib/supabaseClient';
import type { FunnelStep, ListStats } from '../../types/crm';
import UserLayout from '../../layouts/UserLayout';
import { CRM } from '../../db';
import { ListFunnel } from '../../db/CRM/getLeads';

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

function ListCard({ list }: { list: ListFunnel }) {
  const maxCount = Math.max(...list.funnel.map(step => step.count));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{list.name}</h3>
        <div className="text-sm text-gray-500">
          {list.contactedCount} / {list.totalCount} contactés
        </div>
      </div>

      <div className="space-y-4">
        {list.funnel.map(step => (
          <div key={step.type} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">{step.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{step.count}</span>
                <span className="text-sm text-gray-500">({step.percentage.toFixed(1)}%)</span>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${step.color}`}
                style={{ width: `${(step.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {list.totalMessages > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Total des messages : {list.totalMessages}
          </div>
        </div>
      )}
    </div>
  );
}

function CRMDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listFunnels, setListFunnels] = useState<ListFunnel[]>([]);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) throw new Error('Session non trouvée');

      const { data: funnels, error: funnelsError } = await CRM.getLeads(session.user.id);
      
      if (funnelsError) {
        throw funnelsError;
      }

      setListFunnels(funnels);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Une erreur est survenue lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord CRM</h1>
          
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RefreshCcw className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : listFunnels.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {listFunnels.map(list => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Aucune liste trouvée
        </div>
      )}
      </div>
    </UserLayout>
  );
}

export default CRMDashboard;