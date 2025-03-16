import React from 'react';
import { Target, Zap, Users, BarChart3 } from 'lucide-react';

export default function Services() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Détectez les entreprises en {' '}
            <span className="text-[#4361EE] underline decoration-[#4361EE]">
              phase de croissance
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Les cabinets de conseil les plus performants utilisent LeadBuilder pour identifier les entreprises ayant besoin de leur expertise.
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
                <div className="font-semibold">Expert Compta</div>
                <div className="text-sm text-gray-500">+85 nouveaux mandats</div>
              </div>
            </div>
            <p className="text-gray-600">
              "LeadBuilder nous a permis d'identifier les entreprises en croissance avant la concurrence."
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#4361EE] bg-opacity-10 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <div className="font-semibold">Finance Conseil</div>
                <div className="text-sm text-gray-500">1.5M€ CA additionnel</div>
              </div>
            </div>
            <p className="text-gray-600">
              "Notre cabinet a augmenté son CA de 37% en un an grâce à la prospection ciblée."
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-[#4361EE] bg-opacity-10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <div className="font-semibold">RH Solutions</div>
                <div className="text-sm text-gray-500">+120 missions/an</div>
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
            <span className="text-[#4361EE]">identifier les opportunités</span> ?
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Target className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Détection des signaux de croissance</h3>
                <p className="text-gray-600">
                  Identifiez les entreprises qui recrutent, lèvent des fonds, ou étendent leurs activités.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Users className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Contact direct décideurs</h3>
                <p className="text-gray-600">
                  Entrez en relation avec les DAF, DRH et dirigeants au bon moment.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <Zap className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Scoring des besoins</h3>
                <p className="text-gray-600">
                  Évaluez la maturité des entreprises et leurs besoins en expertise.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <BarChart3 className="w-8 h-8 text-[#4361EE]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Suivi du portefeuille</h3>
                <p className="text-gray-600">
                  Gérez vos prospects et clients dans une interface unifiée.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="mt-24 bg-[#4361EE] rounded-2xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Résultats prouvés</h2>
            <p className="text-blue-100">Des résultats concrets pour votre cabinet</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">76%</div>
              <div className="text-blue-100">Taux de conversion</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">+43</div>
              <div className="text-blue-100">Nouveaux clients/mois</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15j</div>
              <div className="text-blue-100">Pour signer un mandat</div>
            </div>
          </div>
        </div>

        {/* Partners Section */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold mb-8">Nos partenaires</h3>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <img src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/676594277e7dc1e771e3f482_Google.svg" alt="Google" className="h-8" />
            <img src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/676594279ccd5ff252059554_Trustpilot.svg" alt="Trustpilot" className="h-8" />
            <img src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/676594278f1e896c7bca120e_Gsquare.svg" alt="Gsquare" className="h-8" />
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center pb-20">
          <button className="bg-[#4361EE] text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-[#3651DE] transition-colors">
            Démarrer ma prospection
          </button>
          <div className="mt-4 text-sm text-gray-500">
            Essai gratuit de 30 jours • Sans engagement
          </div>
        </div>
      </div>
    </div>
  );
}