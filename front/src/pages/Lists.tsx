import React from 'react';
import { ListChecks, BarChart, Share2, Clock } from 'lucide-react';

function Lists() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Organisez vos prospects comme jamais auparavant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Créez, gérez et optimisez vos listes de prospects en toute simplicité.
          </p>
          <button className="bg-[#4361EE] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#3651DE] transition-colors">
            Créez votre première liste
          </button>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-[#4361EE] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
              <ListChecks className="w-6 h-6 text-[#4361EE]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Créez des listes intelligentes 🎯
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Catégorisation automatique</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Tags personnalisables</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Notes et commentaires</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-[#4361EE] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
              <BarChart className="w-6 h-6 text-[#4361EE]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Suivez vos progrès 📊
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Tableaux de bord intuitifs</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Statistiques en temps réel</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Indicateurs de performance</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-[#4361EE] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
              <Share2 className="w-6 h-6 text-[#4361EE]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Collaborez efficacement 🤝
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Partage d'accès</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Historique des modifications</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Commentaires d'équipe</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Time Saving Section */}
        <div className="mt-24 bg-[#4361EE] rounded-2xl p-12 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
            Gagnez du temps avec nos listes
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">Auto</div>
              <div className="text-blue-100">Organisation automatique</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Synchronisation en temps réel</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Backup permanent</div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-24 text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-xl text-gray-700 italic mb-6">
              "J'ai réduit de 75% mon temps de gestion des prospects grâce à LeadBuilder. L'organisation automatique et la synchronisation en temps réel ont révolutionné notre façon de travailler."
            </p>
            <div className="font-medium text-gray-900">Marie L.</div>
            <div className="text-sm text-gray-500">Responsable Marketing</div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center pb-20">
          <button className="bg-[#4361EE] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#3651DE] transition-colors">
            Créez votre première liste
          </button>
        </div>
      </div>
    </div>
  );
}

export default Lists;