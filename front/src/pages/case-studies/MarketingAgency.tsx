import React from 'react';
import { Star, Rocket, Zap, Users, BarChart, MessageSquare } from 'lucide-react';

export default function MarketingAgency() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Prospectez comme les {' '}
            <span className="text-[#4361EE] underline decoration-[#4361EE]">
              meilleures agences
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Les meilleures agences marketing et consultants digitaux utilisent LeadBuilder pour accélérer leur croissance.
          </p>
        </div>

        {/* Success Stories */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#4361EE] bg-opacity-10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <div className="font-semibold">Digital Growth</div>
                <div className="text-sm text-gray-500">Agence Marketing Digital</div>
              </div>
            </div>
            <p className="text-gray-600">
              "LeadBuilder nous a permis de doubler notre nombre de clients en 3 mois."
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#4361EE] bg-opacity-10 rounded-full flex items-center justify-center">
                <BarChart className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <div className="font-semibold">WebStrategy Pro</div>
                <div className="text-sm text-gray-500">Consultant SEO</div>
              </div>
            </div>
            <p className="text-gray-600">
              "Notre taux de conversion a augmenté de 45% depuis qu'on utilise LeadBuilder."
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#4361EE] bg-opacity-10 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <div className="font-semibold">Social Pulse</div>
                <div className="text-sm text-gray-500">Agence Social Media</div>
              </div>
            </div>
            <p className="text-gray-600">
              "La prospection n'a jamais été aussi efficace et automatisée."
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-16">
            Comment {' '}
            <span className="text-[#4361EE]">la magie fonctionne</span> ?
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Rocket className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Détection de prospects en quelques secondes</h3>
                <p className="text-gray-600">
                  L'IA de LeadBuilder analyse et qualifie les entreprises ayant un faible score digital. Ciblez les clients qui ont vraiment besoin de vous.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Star className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Messages personnalisés qui convertissent</h3>
                <p className="text-gray-600">
                  Des templates optimisés pour les agences marketing, personnalisables selon votre positionnement et votre cible.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Zap className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Automatisation intelligente</h3>
                <p className="text-gray-600">
                  Automatisez vos séquences de prospection tout en gardant une approche personnalisée pour chaque prospect.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Collaboration d'équipe simplifiée</h3>
                <p className="text-gray-600">
                  Gérez toute votre équipe commerciale depuis un seul outil et suivez les performances en temps réel.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="mt-24 bg-[#4361EE] rounded-2xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Résultats prouvés</h2>
            <p className="text-blue-100">Des résultats concrets pour votre agence</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2x</div>
              <div className="text-blue-100">Plus de clients signés</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4h+</div>
              <div className="text-blue-100">Économisées par jour</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50%</div>
              <div className="text-blue-100">Taux de réponse moyen</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center pb-20">
          <button className="bg-[#4361EE] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#3651DE] transition-colors">
            Commencer gratuitement
          </button>
          <div className="mt-4 text-sm text-gray-500">
            Déjà utilisé par plus de 2000 agences marketing
          </div>
        </div>
      </div>
    </div>
  );
}