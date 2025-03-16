import { useNavigate } from 'react-router-dom';

export default function RegisterSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Inscription réussie !
          </h2>
          <p className="mt-2 text-gray-600">
            Votre compte a été créé avec succès. Un email de confirmation vous a été envoyé.
          </p>
          <p className="mt-4 text-gray-600">
            Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation pour activer votre compte.
          </p>
        </div>
        
        <div className="mt-6">
          <button
            onClick={() => navigate('/auth/login')}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Se connecter
          </button>
          <button
            onClick={() => navigate('/pricing')}
            className="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Voir les abonnements
          </button>
        </div>
      </div>
    </div>
  );
} 