import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '../../db';
import { Loader2 } from 'lucide-react';

export function VerifyEmail() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkEmailVerification();
  }, []);

  const checkEmailVerification = async () => {
    try {
      const { data: user, error: userError } = await Auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        setError('Utilisateur non trouvé');
        return;
      }

      setEmail(user.email || '');

      if (user.email_confirmed_at) {
        // Email déjà vérifié, rediriger vers le tableau de bord
        setTimeout(() => navigate('/'), 2000);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await Auth.resendVerificationEmail(
        email,
        `${window.location.origin}/auth/verify`
      );

      if (error) throw error;

      alert('Email de vérification envoyé. Veuillez vérifier votre boîte de réception.');
    } catch (err) {
      console.error('Erreur:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Vérification de votre email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Vérification de l'email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nous avons envoyé un email de vérification à {email}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <button
            onClick={resendVerificationEmail}
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Renvoyer l\'email de vérification'
            )}
          </button>

          <button
            onClick={() => navigate('/auth/login')}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
}
