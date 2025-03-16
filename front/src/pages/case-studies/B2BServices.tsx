import React from 'react';
import { Zap, Target, Users, BarChart3 } from 'lucide-react';

export default function B2BServices() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Identifiez les entreprises en {' '}
            <span className="text-[#4361EE] underline decoration-[#4361EE]">
              transformation digitale
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Les leaders des services B2B utilisent LeadBuilder pour détecter leurs futurs clients avant la concurrence.
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
                <div className="font-semibold">TechConsult</div>
                <div className="text-sm text-gray-500">+127 clients en 6 mois</div>
              </div>
            </div>
            <p className="text-gray-600">
              "LeadBuilder nous a permis d'identifier les entreprises en pleine transformation digitale."
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#4361EE] bg-opacity-10 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <div className="font-semibold">DigitalPro Services</div>
                <div className="text-sm text-gray-500">+89 leads qualifiés/mois</div>
              </div>
            </div>
            <p className="text-gray-600">
              "Notre pipeline a doublé en 3 mois grâce à la détection intelligente des opportunités."
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#4361EE] bg-opacity-10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <div className="font-semibold">WebDev Solutions</div>
                <div className="text-sm text-gray-500">243 projets signés</div>
              </div>
            </div>
            <p className="text-gray-600">
              "La prospection n'a jamais été aussi ciblée et efficace."
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-16">
            Comment {' '}
            <span className="text-[#4361EE]">détecter les opportunités</span> ?
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Target className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Détection des signaux d'achat</h3>
                <p className="text-gray-600">
                  Notre IA analyse les signaux de transformation digitale : changements d'outils, recrutements IT, levées de fonds...
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Identification des décideurs</h3>
                <p className="text-gray-600">
                  Contactez directement les bonnes personnes : DSI, CDO, Directeurs de Transformation Digitale.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Zap className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Séquences personnalisées</h3>
                <p className="text-gray-600">
                  Des messages adaptés à chaque secteur et taille d'entreprise, avec suivi automatique des réponses.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <BarChart3 className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Pipeline prédictif</h3>
                <p className="text-gray-600">
                  Anticipez vos ventes grâce à notre scoring prédictif basé sur des milliers de signaux B2B.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="mt-24 bg-[#4361EE] rounded-2xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Résultats prouvés</h2>
            <p className="text-blue-100">Des résultats concrets pour votre entreprise</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">3x</div>
              <div className="text-blue-100">Plus de deals qualifiés</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">-45j</div>
              <div className="text-blue-100">Cycle de vente réduit</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-blue-100">Taux de détection</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center pb-20">
          <button className="bg-[#4361EE] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#3651DE] transition-colors">
            Détecter mes prospects
          </button>
          <div className="mt-4 text-sm text-gray-500">
            14 jours d'essai gratuit • Sans carte bancaire
          </div>
        </div>
      </div>
    </div>
  );
}