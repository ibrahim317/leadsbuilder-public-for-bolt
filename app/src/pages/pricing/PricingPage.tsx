import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";
import { supabaseClient as supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import * as PricingModule from "../../db/Pricing";
import type { Plan } from "../../db/Pricing";

// Define billing period types
type BillingPeriod = "par mois" | "par trimestre" | "par an";

export default function PricingPage() {
  const [allPlans, setAllPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [selectedPeriod, setSelectedPeriod] =
    useState<BillingPeriod>("par mois");
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, tempUserData } = useAuth();

  // Check if a plan was selected from the registration page
  const selectedPlanFromRegistration = location.state?.selectedPlan;

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await PricingModule.getPlans();
        if (error) throw error;

        if (data) {
          setAllPlans(data);
          // Initially filter for monthly plans
          setFilteredPlans(data.filter((plan) => plan.period === "par mois"));
        }
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Erreur lors du chargement des plans");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Filter plans when period changes
  useEffect(() => {
    if (allPlans.length > 0) {
      setFilteredPlans(
        allPlans.filter((plan) => plan.period === selectedPeriod)
      );
    }
  }, [selectedPeriod, allPlans]);

  useEffect(() => {
    // If we have a selected plan from registration and temp user data,
    // automatically trigger the checkout process
    if (selectedPlanFromRegistration && tempUserData) {
      handleSelectPlan(selectedPlanFromRegistration);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempUserData, selectedPlanFromRegistration]);

  const handleSelectPlan = async (plan: Plan) => {
    setProcessingPlan(plan.id);
    setError(null);
    if (user) {
      navigate(
        `/settings/billing?plan=${plan.priceid}&planName=${
          plan.name
        }&price=${plan.price_display.replace("€", "")}`,
        {
          state: { selectedPlan: plan },
        }
      );
      return;
    }

    try {
      // Redirect to registration if no user or temp user data
      navigate(
        `/auth/register?plan=${plan.priceid}&planName=${
          plan.name
        }&price=${plan.price_display.replace("€", "")}`,
        {
          state: { selectedPlan: plan },
        }
      );
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setProcessingPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choisissez votre plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Sélectionnez l'offre qui correspond le mieux à vos besoins
          </p>
        </div>

        {/* Billing period selector */}
        <div className="mt-8 flex justify-center">
          <div className="bg-white p-1 rounded-lg shadow-sm inline-flex">
            <button
              onClick={() => setSelectedPeriod("par mois")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedPeriod === "par mois"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setSelectedPeriod("par trimestre")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedPeriod === "par trimestre"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Trimestriel
            </button>
            <button
              onClick={() => setSelectedPeriod("par an")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                selectedPeriod === "par an"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Annuel
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-8 max-w-md mx-auto bg-red-50 p-4 rounded-md border border-red-200">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="mt-12 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:max-w-5xl lg:mx-auto xl:max-w-none xl:mx-0">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-lg shadow-sm divide-y divide-gray-200 bg-white ${
                plan.popular
                  ? "border-blue-500 ring-2 ring-blue-500"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-xs font-semibold py-1 px-3 rounded-t-lg text-center">
                  Populaire
                </div>
              )}
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {plan.description || ""}
                </p>
                <p className="mt-4">
                  <span className="text-3xl font-extrabold text-gray-900">
                    {plan.price_display}
                  </span>
                  <span className="text-base font-medium text-gray-500">{` ${plan.period}`}</span>
                </p>
                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={!!processingPlan}
                  className={`mt-6 w-full bg-blue-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    processingPlan === plan.id
                      ? "opacity-75 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {processingPlan === plan.id ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    "Sélectionner"
                  )}
                </button>
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-gray-900">
                  Fonctionnalités incluses
                </h4>
                <ul className="mt-4 space-y-3">
                  {Array.isArray(plan.features) &&
                    plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-sm text-gray-700">{feature}</p>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Savings callout for annual plans */}
        {selectedPeriod === "par an" && (
          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-blue-600">
              Économisez jusqu'à 20% avec un abonnement annuel
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
