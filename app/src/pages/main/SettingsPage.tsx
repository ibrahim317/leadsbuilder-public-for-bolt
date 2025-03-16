import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Shield,
  LogOut,
  HelpCircle,
  UserCircle,
} from "lucide-react";
import { supabaseClient } from "../../lib/supabaseClient";
import type { User as AuthUser } from "../../types/auth";
import GDPRSettings from "../../components/GDPRSettings";
import UserLayout from "../../layouts/UserLayout";
import { Settings, Auth } from "../../db";

const tabs = [
  { id: "profile", label: "Profil", icon: UserCircle },
  { id: "billing", label: "Facturation", icon: CreditCard },
  { id: "security", label: "Sécurité", icon: Shield },
  { id: "privacy", label: "Confidentialité", icon: Shield },
  { id: "help", label: "Aide", icon: HelpCircle },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();
      if (!session) {
        navigate("/auth/login");
        return;
      }

      const { data: userData, error: userError } = await Settings.getUserProfile(session.user.id);

      if (userError) throw userError;
      setUser(userData);
    } catch (err) {
      console.error("Erreur:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Assuming Auth.signOut is implemented in the Auth module
      const { error } = await Auth.signOut();
      if (error) {
        setError("Erreur lors de la déconnexion");
        return;
      }
      navigate("/auth/login");
    } catch (err) {
      console.error("Erreur lors de la déconnexion:", err);
      setError("Erreur lors de la déconnexion");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
            <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Icon
                        className={`mr-3 h-5 w-5 ${
                          activeTab === tab.id
                            ? "text-blue-600"
                            : "text-gray-400 group-hover:text-gray-500"
                        }`}
                      />
                      {tab.label}
                    </button>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Déconnexion
                </button>
              </div>
            </aside>

            <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {activeTab === "profile" && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Informations du profil
                    </h3>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <div className="mt-1">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={user?.email}
                            disabled
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "billing" && (
                <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Abonnement actuel
                    </h3>
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Plan
                          </p>
                          <p className="text-lg font-semibold text-gray-900">
                            {user?.subscription_tier === "pro"
                              ? "Pro"
                              : user?.subscription_tier === "business"
                              ? "Business"
                              : "Gratuit"}
                          </p>
                        </div>
                        <button
                          onClick={() => navigate("/pricing")}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Changer de plan
                        </button>
                      </div>
                      {user?.subscription_end_date && (
                        <p className="mt-2 text-sm text-gray-500">
                          Prochain renouvellement le{" "}
                          {new Date(
                            user.subscription_end_date
                          ).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Historique des paiements
                    </h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">
                        Aucun paiement effectué pour le moment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="bg-white shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      Sécurité du compte
                    </h3>
                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Changer le mot de passe
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Confidentialité et RGPD
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Gérez vos préférences de confidentialité et vos données
                        personnelles
                      </p>
                    </div>

                    <GDPRSettings />
                  </div>
                </div>
              )}

              {activeTab === "help" && (
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <HelpCircle className="w-6 h-6 text-blue-600" />
                    <h2 className="text-2xl font-semibold">Centre d'aide</h2>
                  </div>

                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-lg mb-2">
                        Documentation
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Accédez à notre documentation complète pour apprendre à
                        utiliser toutes les fonctionnalités de LeadBuilder.
                      </p>
                      <a
                        href="/docs/utilisateur"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        Consulter la documentation
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </a>
                    </div>

                    <div className="border-b pb-4">
                      <h3 className="font-medium text-lg mb-2">
                        Support technique
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Besoin d'aide ? Notre équipe de support est là pour vous
                        aider.
                      </p>
                      <a
                        href="mailto:support@leadsbuilder.co"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        Contacter le support
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </a>
                    </div>

                    <div>
                      <h3 className="font-medium text-lg mb-2">FAQ</h3>
                      <p className="text-gray-600 mb-3">
                        Consultez notre FAQ pour trouver rapidement des réponses
                        aux questions les plus fréquentes.
                      </p>
                      <a
                        href="/docs/utilisateur#faq"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        Voir la FAQ
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </UserLayout>
  );
}
