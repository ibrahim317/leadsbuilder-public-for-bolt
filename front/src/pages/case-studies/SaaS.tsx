import React from 'react';
import { Target, Zap, Users, BarChart3 } from 'lucide-react';

export default function SaaS() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Trouvez vos prochains clients {' '}
            <span className="text-[#4361EE] underline decoration-[#4361EE]">
              product-market fit
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Les SaaS B2B qui se développent le plus rapidement utilisent LeadBuilder pour identifier et contacter leurs clients idéaux.
          </p>
        </div>

        {/* Success Stories */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#4361EE] bg-opacity-10 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <div className="font-semibold">ProjectFlow</div>
                <div className="text-sm text-gray-500">+230K€ MRR en 6 mois</div>
              </div>
            </div>
            <p className="text-gray-600">
              "LeadBuilder nous a permis d'identifier nos clients idéaux dès le lancement."
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#4361EE] bg-opacity-10 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <div className="font-semibold">CloudSecure</div>
                <div className="text-sm text-gray-500">+450 clients entreprise</div>
              </div>
            </div>
            <p className="text-gray-600">
              "Notre MRR a été multiplié par 4 en moins de 8 mois."
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#4361EE] bg-opacity-10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <div className="font-semibold">TeamTools</div>
                <div className="text-sm text-gray-500">1.2M€ ARR</div>
              </div>
            </div>
            <p className="text-gray-600">
              "La prospection n'a jamais été aussi efficace et ciblée."
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-16">
            Comment {' '}
            <span className="text-[#4361EE]">accélérer votre croissance</span> ?
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Target className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">ICP Matching</h3>
                <p className="text-gray-600">
                  Notre IA analyse vos meilleurs clients actuels et identifie des profils similaires prêts à acheter.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Détection des champions</h3>
                <p className="text-gray-600">
                  Identifiez les décideurs et utilisateurs clés qui porteront votre solution en interne.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Zap className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Séquences Product-Led</h3>
                <p className="text-gray-600">
                  Des messages qui mettent en avant la valeur de votre produit et déclenchent des essais gratuits.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <BarChart3 className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Product-Market Fit Score</h3>
                <p className="text-gray-600">
                  Mesurez et optimisez votre adéquation produit-marché en temps réel.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="mt-24 bg-[#4361EE] rounded-2xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Résultats prouvés</h2>
            <p className="text-blue-100">Des résultats concrets pour votre SaaS</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">-58%</div>
              <div className="text-blue-100">Réduction du CAC</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2.4x</div>
              <div className="text-blue-100">Croissance du MRR</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">35j</div>
              <div className="text-blue-100">Délai de closing</div>
            </div>
          </div>
        </div>

        {/* Integration Section */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold mb-8">S'intègre avec vos outils</h3>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <img src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/676594277e7dc1e771e3f482_Google.svg" alt="Google" className="h-8" />
            <img src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/676594279ccd5ff252059554_Trustpilot.svg" alt="Trustpilot" className="h-8" />
            <img src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/676594278f1e896c7bca120e_Gsquare.svg" alt="Gsquare" className="h-8" />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center pb-20">
          <button className="bg-[#4361EE] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#3651DE] transition-colors">
            Accélérer ma croissance
          </button>
          <div className="mt-4 text-sm text-gray-500">
            Premier mois gratuit • Sans engagement
          </div>
        </div>
      </div>
    </div>
  );
}