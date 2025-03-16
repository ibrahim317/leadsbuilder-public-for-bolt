import React from 'react';
import { Search, Filter, Download, Users } from 'lucide-react';

export default function SearchProspects() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Trouvez vos prospects idéaux en quelques clics
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Identifiez et ciblez précisément votre audience avec notre moteur de recherche intelligent.
          </p>
          <button className="bg-[#4361EE] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#3651DE] transition-colors">
            Commencez votre première recherche
          </button>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-[#4361EE] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
              <Search className="w-6 h-6 text-[#4361EE]" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Recherche ultra-ciblée 🎯</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                Interface intuitive pour définir vos critères
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                Filtres par bio, nom, et nombre de followers
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                Suggestions intelligentes basées sur vos recherches
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-[#4361EE] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
              <Filter className="w-6 h-6 text-[#4361EE]" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Personnalisez vos critères ⚡️</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                Combinez plusieurs mots-clés
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                Définissez des fourchettes de followers
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                Sauvegardez vos filtres favoris
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-[#4361EE] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
              <Download className="w-6 h-6 text-[#4361EE]" />
            </div>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Téléchargez vos résultats 📥</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                Export en un clic
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                Formats compatibles avec tous les outils
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                Organisation automatique des données
              </li>
            </ul>
          </div>
        </div>

        {/* Why Use Our Search Engine */}
        <div className="mt-24 bg-[#4361EE] rounded-2xl p-12 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
            Pourquoi utiliser notre moteur de recherche ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10x</div>
              <div className="text-blue-100">Plus rapide pour trouver vos prospects</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Profils pertinents uniquement</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Simple</div>
              <div className="text-blue-100">Gestion de vos listes de prospects</div>
            </div>
          </div>
        </div>

        {/* Testimonial Banner */}
        <div className="mt-24 text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-12">
          <div className="flex items-center justify-center mb-6">
            <Users className="w-8 h-8 text-[#4361EE] mr-3" />
            <span className="text-2xl font-bold text-gray-900">
              Plus de 100 000 prospects qualifiés
            </span>
          </div>
          <p className="text-xl text-gray-600">
            trouvés chaque jour par nos utilisateurs
          </p>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center pb-20">
          <button className="bg-[#4361EE] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#3651DE] transition-colors">
            Commencez votre première recherche
          </button>
        </div>
      </div>
    </div>
  );
}