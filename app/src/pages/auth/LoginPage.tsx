import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabaseClient } from '../../lib/supabaseClient';
import { handleSupabaseError } from '../../lib/error-handlers';
import { cleanupSession } from '../../lib/auth/cleanupSession';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError(null);

    try {
      // Validation des champs
      if (!email.trim() || !password.trim()) {
        throw new Error('Veuillez remplir tous les champs');
      }

      // 1. Nettoyer la session existante
      await cleanupSession();
      
      // 2. Attendre que la session soit nettoyée
      await new Promise(resolve => setTimeout(resolve, 500));

      // 3. Tentative de connexion avec retry
      let loginAttempts = 0;
      const maxAttempts = 3;
      let lastError;

      while (loginAttempts < maxAttempts) {
        try {
          const { data, error: signInError } = await supabaseClient.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim()
          });

          if (signInError) throw signInError;
          if (!data.session) throw new Error('Session non créée');

          // 4. Attendre que la session soit établie
          await new Promise(resolve => setTimeout(resolve, 500));

          // 5. Vérifier/créer l'utilisateur dans la table users
          const { error: userError } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          if (userError && userError.code === 'PGRST116') {
            // 6. Créer l'utilisateur s'il n'existe pas
            const { error: insertError } = await supabaseClient
              .from('users')
              .insert([{
                id: data.session.user.id,
                email: data.session.user.email,
                subscription_tier: 'starter',
                subscription_status: 'active'
              }]);

            if (insertError) throw insertError;
          }

          // 7. Redirection en cas de succès
          const from = location.state?.from?.pathname || '/';
          navigate(from, { replace: true });
          return;

        } catch (err:any) {
          lastError = err;
          loginAttempts++;
          
          // Si c'est une erreur de réseau ou une erreur 500, on réessaie
          if (err?.status === 500 || err?.message?.includes('Failed to fetch')) {
            await new Promise(resolve => setTimeout(resolve, 1000 * loginAttempts));
            continue;
          }
          
          // Pour les autres types d'erreurs, on arrête immédiatement
          throw err;
        }
      }

      // Si on arrive ici, c'est qu'on a épuisé toutes les tentatives
      throw lastError || new Error('Impossible de se connecter après plusieurs tentatives');

    } catch (err: any) {
      console.error('Erreur de connexion:', err);
      setError(handleSupabaseError(err).message);
      setPassword('');
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
            Connexion à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Ou{' '}
            <a
              href={import.meta.env.VITE_APP_URL + "/pricing"}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              créez un compte gratuitement
            </a>
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
                  Erreur de connexion
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                to="/auth/reset-password"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !email.trim() || !password.trim()}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Connexion en cours...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}