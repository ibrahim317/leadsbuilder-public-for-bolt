import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CreditCard, AlertTriangle, Check } from 'lucide-react';
import { supabaseClient } from '../../lib/supabaseClient';
import { Billing } from '../../db';
import { Subscription } from '../../db/Billing/getSubscription';
import { redirectToCheckout } from '../../lib/stripe/redirectToCheckout';

const MONTHLY_PLANS = [
  {
    name: 'Starter',
    price: '99€',
    period: 'par mois',
    priceId: 'price_1QQ3BsDWcrI6M6PNdkDSxpZU',
    features: [
      'Jusqu\'à 1000 profils',
      '10 listes actives',
      'Recherche avancée',
      'Support email'
    ]
  },
  {
    name: 'Pro',
    price: '169€',
    period: 'par mois',
    priceId: 'price_1QQ3E6DWcrI6M6PNkHobBmF7',
    features: [
      'Profils illimités',
      'Listes illimitées',
      'Export des données',
      'Support prioritaire',
      'API access'
    ],
    popular: true
  },
  {
    name: 'Business',
    price: '349€',
    period: 'par mois',
    priceId: 'price_1QQ3GNDWcrI6M6PNmUODRfMo',
    features: [
      'Tout le plan Pro',
      'Multi-utilisateurs',
      'Account manager dédié',
      'SLA garanti',
      'Formations personnalisées'
    ]
  }
];

const QUARTERLY_PLANS = [
  {
    name: 'Starter',
    price: '316€',
    period: 'par trimestre',
    priceId: 'price_1QXXT0DWcrI6M6PNcTDXkkOv',
    features: [
      'Jusqu\'à 1000 profils',
      '10 listes actives',
      'Recherche avancée',
      'Support email'
    ]
  },
  {
    name: 'Pro',
    price: '516€',
    period: 'par trimestre',
    priceId: 'price_1QXXTzDWcrI6M6PNpzs9Ifuz',
    features: [
      'Profils illimités',
      'Listes illimitées',
      'Export des données',
      'Support prioritaire',
      'API access'
    ],
    popular: true
  },
  {
    name: 'Business',
    price: '1228,48€',
    period: 'par trimestre',
    priceId: 'price_1QXYCyDWcrI6M6PN9P3ggB8X',
    features: [
      'Tout le plan Pro',
      'Multi-utilisateurs',
      'Account manager dédié',
      'SLA garanti',
      'Formations personnalisées'
    ]
  }
];

const YEARLY_PLANS = [
  {
    name: 'Starter',
    price: '948€',
    period: 'par an',
    priceId: 'price_1QXYI1DWcrI6M6PNNWsj8UkC',
    features: [
      'Jusqu\'à 1000 profils',
      '10 listes actives',
      'Recherche avancée',
      'Support email'
    ]
  },
  {
    name: 'Pro',
    price: '1548€',
    period: 'par an',
    priceId: 'price_1QXYL4DWcrI6M6PNkZozkbn4',
    features: [
      'Profils illimités',
      'Listes illimitées',
      'Export des données',
      'Support prioritaire',
      'API access'
    ],
    popular: true
  },
  {
    name: 'Business',
    price: '3685,44€',
    period: 'par an',
    priceId: 'price_1QXYLUDWcrI6M6PNLBAiaT9K',
    features: [
      'Tout le plan Pro',
      'Multi-utilisateurs',
      'Account manager dédié',
      'SLA garanti',
      'Formations personnalisées'
    ]
  }
];

export default function BillingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (!session) {
        navigate('/auth/login');
        return;
      }

      const { data: subscriptionData, error: subscriptionError } = await Billing.getSubscription(session.user.id);
      
      if (subscriptionError) {
        throw subscriptionError;
      }
      
      setSubscription(subscriptionData);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement de l\'abonnement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    setSubscribing(true);
    setError(null);

    try {
      await redirectToCheckout(priceId);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors de la redirection vers la page de paiement');
    } finally {
      setSubscribing(false);
    }
  };

  const plans = {
    monthly: MONTHLY_PLANS,
    quarterly: QUARTERLY_PLANS,
    yearly: YEARLY_PLANS
  }[billingPeriod];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Gérer votre abonnement
        </h1>
        
        {loading ? (
          <div className="mt-8 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : error ? (
          <div className="mt-8 p-4 bg-red-50 rounded-md">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Une erreur est survenue
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        ) : subscription ? (
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Abonnement actuel
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Plan {subscription.plan_name}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
              
              <div className="mt-6 border-t border-gray-200 pt-6">
                <dl className="divide-y divide-gray-200">
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Statut
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {subscription.status === 'active' ? 'Actif' : 'Inactif'}
                    </dd>
                  </div>
                  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500">
                      Prochain paiement
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(subscription.current_period_end).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="mt-8 flex justify-center">
              <div className="relative self-center bg-gray-100 rounded-lg p-0.5 flex sm:mt-8">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`${
                    billingPeriod === 'monthly'
                      ? 'relative w-1/3 bg-white border-gray-200 rounded-md shadow-sm py-2 text-sm font-medium text-gray-900 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto sm:px-8'
                      : 'ml-0.5 relative w-1/3 bg-transparent py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto sm:px-8'
                  }`}
                >
                  Mensuel
                </button>
                <button
                  onClick={() => setBillingPeriod('quarterly')}
                  className={`${
                    billingPeriod === 'quarterly'
                      ? 'relative w-1/3 bg-white border-gray-200 rounded-md shadow-sm py-2 text-sm font-medium text-gray-900 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto sm:px-8'
                      : 'ml-0.5 relative w-1/3 bg-transparent py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto sm:px-8'
                  }`}
                >
                  Trimestriel
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`${
                    billingPeriod === 'yearly'
                      ? 'relative w-1/3 bg-white border-gray-200 rounded-md shadow-sm py-2 text-sm font-medium text-gray-900 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto sm:px-8'
                      : 'ml-0.5 relative w-1/3 bg-transparent py-2 text-sm font-medium text-gray-700 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto sm:px-8'
                  }`}
                >
                  Annuel
                </button>
              </div>
            </div>

            <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-lg shadow-sm divide-y divide-gray-200 ${
                    plan.popular
                      ? 'border-2 border-blue-500'
                      : 'border border-gray-200'
                  }`}
                >
                  <div className="p-6">
                    <h2 className="text-lg leading-6 font-medium text-gray-900">
                      {plan.name}
                    </h2>
                    <p className="mt-4">
                      <span className="text-4xl font-extrabold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-base font-medium text-gray-500">
                        {plan.period}
                      </span>
                    </p>
                    <p className="mt-4 text-sm text-gray-500">
                      {plan.popular && (
                        <span className="block font-medium text-gray-900">
                          Le plus populaire
                        </span>
                      )}
                    </p>
                    <button
                      onClick={() => handleSubscribe(plan.priceId)}
                      disabled={subscribing}
                      className={`mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium ${
                        plan.popular
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      {subscribing ? 'Chargement...' : 'Souscrire'}
                    </button>
                  </div>
                  <div className="pt-6 pb-8 px-6">
                    <h3 className="text-xs font-medium text-gray-900 tracking-wide uppercase">
                      Ce qui est inclus
                    </h3>
                    <ul className="mt-6 space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex space-x-3">
                          <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                          <span className="text-sm text-gray-500">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}