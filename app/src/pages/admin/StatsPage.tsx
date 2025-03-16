import  { useState, useEffect } from 'react';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { supabaseClient } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { format, subDays, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Stats } from '../../db';

// Types
interface StatsData {
  signups: DataPoint[];
  pageViews: DataPoint[];
  conversions: DataPoint[];
  revenue: DataPoint[];
  conversionsBySource: { name: string; value: number }[];
  userRetention: DataPoint[];
}

interface DataPoint {
  date: string;
  value: number;
}

// Couleurs pour les graphiques
const COLORS = ['#4361EE', '#3F37C9', '#4895EF', '#4CC9F0', '#560BAD', '#7209B7', '#B5179E', '#F72585'];

export default function StatsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statsData, setStatsData] = useState<StatsData>({
    signups: [],
    pageViews: [],
    conversions: [],
    revenue: [],
    conversionsBySource: [],
    userRetention: []
  });
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    checkAuth();
    loadStatsData();
  }, [timeframe]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        navigate('/auth/login');
        return;
      }

      // Vérifier si l'utilisateur est admin
      // Commented out for now, but kept for future use
      // const { data: roles } = await supabaseClient
      //   .from('user_roles')
      //   .select('role')
      //   .eq('user_id', session.user.id)
      //   .single();

      // if (roles?.role !== 'admin') {
      //   navigate('/');
      //   return;
      // }
    } catch (err) {
      console.error('Erreur d\'authentification:', err);
      setError('Erreur lors de la vérification des permissions');
    }
  };

  const loadStatsData = async () => {
    setLoading(true);
    try {
      // Déterminer la date de début en fonction du timeframe
      const startDate = getStartDate();
      
      // Charger les données en parallèle
      const [
        signupsData,
        pageViewsData,
        conversionsData,
        revenueData,
        conversionsBySourceData,
        userRetentionData
      ] = await Promise.all([
        loadSignups(startDate),
        loadPageViews(startDate),
        loadConversions(startDate),
        loadRevenue(startDate),
        loadConversionsBySource(startDate),
        loadUserRetention(startDate)
      ]);
      
      setStatsData({
        signups: signupsData,
        pageViews: pageViewsData,
        conversions: conversionsData,
        revenue: revenueData,
        conversionsBySource: conversionsBySourceData,
        userRetention: userRetentionData
      });
      
      setError(null);
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError('Erreur lors du chargement des données statistiques');
    } finally {
      setLoading(false);
    }
  };

  // Fonctions pour charger les différentes statistiques
  const loadSignups = async (startDate: Date): Promise<DataPoint[]> => {
    const { data, error } = await supabaseClient
      .from('users')
      .select('created_at')
      .gte('created_at', startDate.toISOString());
      
    if (error) throw error;
    
    return aggregateDataByDate(data || [], 'created_at');
  };

  const loadPageViews = async (startDate: Date): Promise<DataPoint[]> => {
    const { data, error } = await supabaseClient
      .from('conversion_events')
      .select('created_at')
      .eq('event_type', 'page_view')
      .gte('created_at', startDate.toISOString());
      
    if (error) throw error;
    
    return aggregateDataByDate(data || [], 'created_at');
  };

  const loadConversions = async (startDate: Date): Promise<DataPoint[]> => {
    // Use the Stats module to get conversion statistics
    const { data: conversionStats, error } = await Stats.getConversionStats({
      startDate: startDate.toISOString(),
      eventType: undefined // Get all event types except page_view (handled in the module)
    });
    
    if (error) throw error;
    
    if (!conversionStats) return [];
    
    // Convert the conversions_by_date to our DataPoint format
    return conversionStats.conversions_by_date.map(item => ({
      date: item.date,
      value: item.count
    }));
  };

  const loadRevenue = async (startDate: Date): Promise<DataPoint[]> => {
    const { data, error } = await supabaseClient
      .from('subscriptions')
      .select('created_at, amount')
      .gte('created_at', startDate.toISOString());
      
    if (error) throw error;
    
    return aggregateDataByDate(data || [], 'created_at', 'amount');
  };

  const loadConversionsBySource = async (startDate: Date): Promise<{ name: string; value: number }[]> => {
    // Use the Stats module to get conversion statistics
    const { data: conversionStats, error } = await Stats.getConversionStats({
      startDate: startDate.toISOString()
    });
    
    if (error) throw error;
    
    if (!conversionStats) return [];
    
    // Get the conversions by type and map them to the format needed for the chart
    return conversionStats.conversions_by_type.map(item => ({
      name: item.type,
      value: item.count
    }));
  };

  const loadUserRetention = async (_startDate: Date): Promise<DataPoint[]> => {
    // Simuler des données de rétention pour l'exemple
    // Dans un cas réel, il faudrait analyser les connexions des utilisateurs depuis startDate
    // startDate est passé pour maintenir une signature cohérente avec les autres fonctions de chargement
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const retentionData: DataPoint[] = [];
    
    // Générer des données pour les 7 derniers jours/semaines/mois selon le timeframe
    const intervals = timeframe === 'week' ? 7 : timeframe === 'month' ? 30 : timeframe === 'quarter' ? 12 : 12;
    
    for (let i = 0; i < intervals; i++) {
      let date;
      if (timeframe === 'week') {
        date = format(subDays(new Date(), i), 'dd/MM', { locale: fr });
      } else if (timeframe === 'month') {
        date = format(subDays(new Date(), i * 3), 'dd/MM', { locale: fr });
      } else if (timeframe === 'quarter') {
        date = format(subMonths(new Date(), i), 'MM/yyyy', { locale: fr });
      } else {
        date = format(subMonths(new Date(), i), 'MM/yyyy', { locale: fr });
      }
      
      // Simuler un taux de rétention qui diminue avec le temps
      const value = Math.round(85 - (i * 5) + (Math.random() * 10));
      
      retentionData.push({ date, value: Math.max(0, Math.min(100, value)) });
    }
    
    return retentionData.reverse();
  };

  // Fonction utilitaire pour agréger les données par date
  const aggregateDataByDate = (
    data: Array<{ [key: string]: string | number | Date }>, 
    dateField: string, 
    valueField?: string
  ): DataPoint[] => {
    const aggregated: Record<string, number> = {};
    
    data.forEach(item => {
      let dateKey;
      const date = new Date(item[dateField]);
      
      // Formater la date en fonction du timeframe
      if (timeframe === 'week') {
        dateKey = format(date, 'dd/MM', { locale: fr });
      } else if (timeframe === 'month') {
        dateKey = format(date, 'dd/MM', { locale: fr });
      } else if (timeframe === 'quarter') {
        dateKey = format(date, 'MM/yyyy', { locale: fr });
      } else {
        dateKey = format(date, 'MM/yyyy', { locale: fr });
      }
      
      const value = valueField ? Number(item[valueField]) : 1;
      aggregated[dateKey] = (aggregated[dateKey] || 0) + value;
    });
    
    return Object.entries(aggregated)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => {
        // Trier par date
        const partsA = a.date.split('/');
        const partsB = b.date.split('/');
        
        if (partsA.length !== partsB.length) {
          return partsA.length - partsB.length;
        }
        
        if (partsA.length === 2) {
          // Format dd/MM
          const monthA = parseInt(partsA[1]);
          const monthB = parseInt(partsB[1]);
          if (monthA !== monthB) return monthA - monthB;
          
          return parseInt(partsA[0]) - parseInt(partsB[0]);
        } else {
          // Format MM/yyyy
          const yearA = parseInt(partsA[1]);
          const yearB = parseInt(partsB[1]);
          if (yearA !== yearB) return yearA - yearB;
          
          return parseInt(partsA[0]) - parseInt(partsB[0]);
        }
      });
  };

  // Obtenir la date de début en fonction du timeframe
  const getStartDate = (): Date => {
    const now = new Date();
    
    switch (timeframe) {
      case 'week':
        return subDays(now, 7);
      case 'month':
        return subDays(now, 30);
      case 'quarter':
        return subMonths(now, 3);
      case 'year':
        return subMonths(now, 12);
      default:
        return subDays(now, 30);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
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
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Statistiques détaillées</h1>
        
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                timeframe === period
                  ? 'bg-white shadow text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {period === 'week' ? '7 jours' : 
               period === 'month' ? '30 jours' : 
               period === 'quarter' ? '3 mois' : '12 mois'}
            </button>
          ))}
        </div>
      </div>

      {/* Croissance des utilisateurs et vues de pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Nouveaux utilisateurs</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statsData.signups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Inscriptions']} />
                <Legend />
                <Area type="monotone" dataKey="value" name="Inscriptions" stroke="#4361EE" fill="#4361EE" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Vues de pages</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statsData.pageViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Vues']} />
                <Legend />
                <Line type="monotone" dataKey="value" name="Vues" stroke="#4CC9F0" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Conversions et revenus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Conversions</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData.conversions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [value, 'Conversions']} />
                <Legend />
                <Bar dataKey="value" name="Conversions" fill="#7209B7" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Revenus</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={statsData.revenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} €`, 'Revenu']} />
                <Legend />
                <Area type="monotone" dataKey="value" name="Revenu" stroke="#F72585" fill="#F72585" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sources de conversion et rétention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Sources de conversion</h2>
          <div className="h-80">
            {statsData.conversionsBySource.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statsData.conversionsBySource}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statsData.conversionsBySource.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Aucune donnée disponible pour cette période</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Rétention des utilisateurs (%)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statsData.userRetention}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Rétention']} />
                <Legend />
                <Line type="monotone" dataKey="value" name="Rétention" stroke="#560BAD" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
