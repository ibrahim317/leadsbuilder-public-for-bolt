import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabaseClient as supabase } from '../../lib/supabaseClient';
import { Payment } from '../../db';
import { useAuth } from '../../contexts/AuthContext';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, setTempUserData } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accountCreated, setAccountCreated] = useState(false);
  const sessionId = searchParams.get('session_id');
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate('/');
      return;
    }

    const handleSuccess = async () => {
      if (!sessionId) {
        setError('Session ID manquant');
        setLoading(false);
        return;
      }

      try {
        // First, verify the subscription using the Payment module
        const { data: verifyData, error: verifyError } = await Payment.verifySubscription(
          sessionId,
          token,
          userId
        );

        if (verifyError || !verifyData?.success) {
          throw verifyError || new Error('Échec de la vérification de l\'abonnement');
        }

        // Get the one-time login token from the verify-payment-token endpoint
        const { data: tokenData, error: tokenError } = await supabase.functions.invoke('verify-payment-token', {
          body: { session_id: sessionId }
        });

        if (tokenError) {
          throw new Error('Erreur lors de la récupération du token de connexion');
        }

        if (!tokenData.loginToken) {
          throw new Error('Token de connexion non reçu');
        }

        // Wait a few seconds for the webhook to process the account update
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Try to sign in with the token
        const { data: authData, error: authError } = await supabase.functions.invoke('verify-payment-token', {
          body: { 
            session_id: sessionId,
            token: tokenData.loginToken
          }
        });

        if (authError) {
          throw new Error('Erreur lors de la connexion avec le token');
        }

        if (authData.session) {
          // Set the session
          await supabase.auth.setSession(authData.session);
          
          // Clear any temporary user data
          setTempUserData(null);
          
          setAccountCreated(true);
          
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          // Wait longer and retry
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          const { data: retryData, error: retryError } = await supabase.functions.invoke('verify-payment-token', {
            body: { 
              session_id: sessionId,
              token: tokenData.loginToken
            }
          });
          
          if (retryError) {
            throw new Error('Erreur lors de la nouvelle tentative de connexion');
          }
          
          if (retryData.session) {
            // Set the session
            await supabase.auth.setSession(retryData.session);
            
            // Clear any temporary user data
            setTempUserData(null);
            
            setAccountCreated(true);
            
            // Redirect to dashboard
            setTimeout(() => {
              navigate('/');
            }, 2000);
          } else {
            throw new Error('Votre compte est en cours d\'activation. Veuillez vous connecter dans quelques instants.');
          }
        }
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue lors de la finalisation de l\'abonnement');
      } finally {
        setLoading(false);
      }
    };

    handleSuccess();
  }, [sessionId, token, userId, navigate, user, setTempUserData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Finalisation de votre abonnement et activation de votre compte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/auth/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mr-2"
          >
            Se connecter
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Retour aux abonnements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Merci pour votre abonnement !</h2>
        <p className="text-gray-600 mb-4">Votre paiement a été traité avec succès.</p>
        {accountCreated ? (
          <p className="text-gray-600">Vous allez être redirigé vers votre tableau de bord...</p>
        ) : (
          <p className="text-gray-600">Votre compte est en cours d'activation. Vous pourrez vous connecter dans quelques instants.</p>
        )}
      </div>
    </div>
  );
}
