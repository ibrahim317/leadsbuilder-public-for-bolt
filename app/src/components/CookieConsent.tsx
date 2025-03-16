import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface CookieSettings {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    necessary: true, // Toujours true car nécessaire
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsOpen(true);
    }
  }, []);

  const handleAcceptAll = () => {
    setSettings({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    setIsOpen(false);
  };

  const handleSavePreferences = () => {
    saveConsent(settings);
    setIsOpen(false);
  };

  const saveConsent = (settings: CookieSettings) => {
    localStorage.setItem('cookieConsent', JSON.stringify({
      ...settings,
      timestamp: new Date().toISOString(),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto p-6">
        {!showPreferences ? (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Nous respectons votre vie privée</h3>
              <p className="text-gray-600">
                Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser le contenu.
                Vous pouvez gérer vos préférences à tout moment.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowPreferences(true)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Gérer les préférences
              </button>
              <button
                onClick={handleAcceptAll}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Accepter tout
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowPreferences(false)}
              className="absolute right-0 top-0 p-2"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h3 className="text-lg font-semibold mb-4">Préférences des cookies</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={settings.necessary}
                    disabled
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-medium">Cookies nécessaires</label>
                  <p className="text-sm text-gray-500">
                    Ces cookies sont indispensables au fonctionnement du site.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={settings.analytics}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      analytics: e.target.checked
                    }))}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-medium">Cookies analytiques</label>
                  <p className="text-sm text-gray-500">
                    Nous aident à comprendre comment vous utilisez le site.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={settings.marketing}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      marketing: e.target.checked
                    }))}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
                <div>
                  <label className="font-medium">Cookies marketing</label>
                  <p className="text-sm text-gray-500">
                    Permettent de vous proposer du contenu personnalisé.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Enregistrer les préférences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieConsent;
