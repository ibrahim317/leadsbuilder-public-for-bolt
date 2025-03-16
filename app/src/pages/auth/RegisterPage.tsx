import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { signUp, signOut } from "../../db/Auth";
import { createCheckoutSession } from "../../db/Payment/createCheckoutSession";
import { supabaseClient } from "../../lib/supabaseClient";
import { DbResponse } from "../../db/types";

const ACTIVITIES = [
  'Agence marketing',
  'Consultant marketing',
  'SaaS',
  'Prestataire de service',
  'Freelance',
  'Autre'
] as const;

type Activity = typeof ACTIVITIES[number] | string;

/**
 * Updates user metadata
 * @param data The metadata to update
 * @returns A promise with the result or an error
 */
async function updateUserMetadata(data: Record<string, any>): Promise<DbResponse<null>> {
  try {
    const { error } = await supabaseClient.auth.updateUser({
      data
    });
    
    if (error) {
      console.error('Update Error:', error);
      return { data: null, error: new Error(error.message) };
    }
    
    return { data: null, error: null };
  } catch (error) {
    console.error('Update Error:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Une erreur inconnue est survenue') 
    };
  }
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('plan');
  const planName = searchParams.get('planName');
  const planPrice = searchParams.get('price');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [activity, setActivity] = useState<Activity>('');
  const [otherActivity, setOtherActivity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirectingToPayment, setRedirectingToPayment] = useState(false);

  useEffect(() => {
    // If no plan is selected, redirect to pricing page
    if (!planId && !planName) {
      navigate('/pricing');
    }
  }, [planId, planName, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!email.trim() || !password.trim() || !firstName.trim() || !activity) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Validate password length
      if (password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      const finalActivity = activity === 'Autre' ? otherActivity : activity;

      // Indicate we're redirecting to payment
      setRedirectingToPayment(true);
      
      // Create a temporary user using the db/Auth signUp method
      const { data: authData, error: authError } = await signUp(
        email.trim(),
        password.trim(),
        {
          data: {
            first_name: firstName.trim(),
            last_name: '',
            phone: phone.trim() || '',
            activity: finalActivity.trim(),
            plan_id: planId || '',
            is_temp: true
          }
        }
      );
      
      if (authError) {
        console.error('Auth Error:', authError);
        throw new Error(authError.message || 'Erreur lors de la création du compte temporaire');
      }
      
      if (!authData?.user) {
        throw new Error('Erreur lors de la création du compte temporaire');
      }
      
      // Generate a token for this registration
      const token = crypto.randomUUID(); // Using browser's crypto API
      
      // Update user metadata to include the token using our wrapper function
      const { error: updateError } = await updateUserMetadata({
        token: token
      });
      
      if (updateError) {
        console.error('Update Error:', updateError);
        throw new Error('Erreur lors de la mise à jour des données utilisateur');
      }
      
      // Create checkout session using the db/Payment createCheckoutSession method
      const { data: checkoutData, error: checkoutError } = await createCheckoutSession({
        priceId: planId || '',
        planName: planName || '',
        userId: authData.user.id,
        customerEmail: email.trim(),
        token: token,
        returnUrl: `${window.location.origin}/payment/success`
      });
      
      if (checkoutError) {
        console.error('Checkout Error:', checkoutError);
        throw new Error('Erreur lors de la création de la session de paiement');
      }
      
      if (!checkoutData?.url) {
        throw new Error('URL de paiement non reçue');
      }
      
      // Store temporary user data in local storage for later use
      localStorage.setItem('tempUserData', JSON.stringify({
        email: email.trim(),
        userId: authData.user.id,
        token: token
      }));
      
      // Redirect to Stripe
      window.location.href = checkoutData.url;
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.message || 'Une erreur est survenue');
      setPassword('');
      setRedirectingToPayment(false);
      
      // If we created a user but failed later, sign out
      await signOut();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://d1yei2z3i6k35z.cloudfront.net/1484856/67a99308dd436_LBN4.png"
            alt="LeadBuilder"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          {planId && planName && planPrice && (
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-600">
                Vous allez souscrire au plan <span className="font-semibold">{planName}</span> à {planPrice}€/mois
              </p>
            </div>
          )}
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <Link
              to="/auth/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erreur d'inscription
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                Prénom *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Votre prénom"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Votre email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Téléphone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Votre numéro de téléphone"
              />
            </div>

            <div>
              <label htmlFor="activity" className="block text-sm font-medium text-gray-700">
                Activité *
              </label>
              <select
                id="activity"
                name="activity"
                required
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Sélectionnez votre activité</option>
                {ACTIVITIES.map((act) => (
                  <option key={act} value={act}>
                    {act}
                  </option>
                ))}
              </select>
            </div>

            {activity === 'Autre' && (
              <div>
                <label htmlFor="otherActivity" className="block text-sm font-medium text-gray-700">
                  Précisez votre activité *
                </label>
                <input
                  id="otherActivity"
                  name="otherActivity"
                  type="text"
                  required
                  value={otherActivity}
                  onChange={(e) => setOtherActivity(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Votre activité"
                />
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Votre mot de passe"
                minLength={6}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || redirectingToPayment}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading || redirectingToPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {redirectingToPayment ? 'Redirection vers le paiement...' : 'Création du compte...'}
                </>
              ) : (
                'Continuer vers le paiement'
              )}
            </button>
          </div>

          <div className="text-sm text-center text-gray-600">
            En créant un compte, vous acceptez nos{' '}
            <Link
              to="/terms"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              conditions d'utilisation
            </Link>{' '}
            et notre{' '}
            <Link
              to="/privacy"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              politique de confidentialité
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}