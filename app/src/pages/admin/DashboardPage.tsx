import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, TrendingUp, CreditCard } from "lucide-react";
import RecentConversions from "../../components/admin/RecentConversions";
import { Dashboard } from "../../db";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState<"day" | "week" | "month" | "year">(
    "week"
  );
  const [conversionData, setConversionData] = useState<Dashboard.ConversionData[]>([]);
  const [revenueData, setRevenueData] = useState<Dashboard.RevenueData[]>([]);
  const [userData, setUserData] = useState<Dashboard.DashboardUserStats>({
    total: 0,
    new_last_week: 0,
    active: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, [timeframe]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data, error } = await Dashboard.getStats(timeframe);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setUserData(data.userData);
        setConversionData(data.conversionData);
        setRevenueData(data.revenueData);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
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
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
          Tableau de bord administrateur
        </h1>

        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          {(["day", "week", "month", "year"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`px-3 py-1.5 text-sm font-medium rounded ${
                timeframe === period
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {period === "day"
                ? "Jour"
                : period === "week"
                ? "Semaine"
                : period === "month"
                ? "Mois"
                : "Année"}
            </button>
          ))}
        </div>
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Utilisateurs totaux
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {userData.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <TrendingUp size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Nouveaux utilisateurs (7j)
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {userData.new_last_week}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Users size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Utilisateurs actifs (30j)
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {userData.active}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <CreditCard size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Revenu total</p>
              <p className="text-2xl font-semibold text-gray-900">
                {revenueData
                  .reduce((sum, item) => sum + item.amount, 0)
                  .toFixed(2)}{" "}
                €
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conversions récentes */}
      <div className="bg-white rounded-lg shadow p-6 mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Conversions récentes
        </h2>
        <RecentConversions />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique des conversions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Événements de conversion
          </h2>
          <div className="h-80">
            {conversionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conversionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="event_type"
                  >
                    {conversionData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  Aucune donnée disponible pour cette période
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Graphique des revenus */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Revenus</h2>
          <div className="h-80">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} €`, "Revenu"]} />
                  <Legend />
                  <Bar dataKey="amount" name="Revenu" fill="#4361EE" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  Aucune donnée disponible pour cette période
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
