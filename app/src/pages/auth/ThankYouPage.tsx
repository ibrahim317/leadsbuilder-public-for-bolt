import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const success = new URLSearchParams(location.search).get('success') === 'true';

  useEffect(() => {
    if (!success) {
      navigate('/pricing');
    }

    // Redirect to the home page after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [success, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Merci pour votre souscription !
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Votre compte a été activé avec succès. Vous allez être redirigé vers l'application dans quelques secondes...
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={() => navigate('/')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Accéder à l'application maintenant
          </button>
        </div>
      </div>
    </div>
  );
}