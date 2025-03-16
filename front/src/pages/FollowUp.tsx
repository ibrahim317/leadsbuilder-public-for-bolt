import React from 'react';
import { MessageCircle, Bell, Calendar, BarChart3, Clock, Filter, Activity } from 'lucide-react';

function FollowUp() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Suivez chaque interaction avec vos prospects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Ne manquez plus aucune opportunité grâce à notre système de suivi avancé.
          </p>
          <button className="bg-[#4361EE] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#3651DE] transition-colors">
            Optimisez vos interactions
          </button>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-[#4361EE] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-[#4361EE]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Timeline interactive ⏱️
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Visualisation chronologique</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Alertes personnalisables</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Rappels automatiques</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-[#4361EE] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
              <Filter className="w-6 h-6 text-[#4361EE]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Statuts personnalisables 🎨
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Étapes de conversion configurables</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Codes couleur intuitifs</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Filtres avancés</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-[#4361EE] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
              <Activity className="w-6 h-6 text-[#4361EE]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Rapports détaillés 📊
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Analyses de performance</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Taux de conversion</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Prédictions d'engagement</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Timeline Demo */}
        <div className="mt-24 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Visualisez vos interactions en temps réel
          </h3>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#4361EE] bg-opacity-10 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-[#4361EE]" />
              </div>
              <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-[#4361EE] mb-1">Premier contact</div>
                <div className="text-gray-700">Message envoyé à @prospect</div>
                <div className="text-sm text-gray-500 mt-1">Il y a 2 heures</div>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1 bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 mb-1">Réponse reçue</div>
                <div className="text-gray-700">Intéressé par une démonstration</div>
                <div className="text-sm text-gray-500 mt-1">Il y a 1 heure</div>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 mb-1">RDV programmé</div>
                <div className="text-gray-700">Démo prévue pour demain, 14h</div>
                <div className="text-sm text-gray-500 mt-1">Il y a 30 minutes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Use Our System */}
        <div className="mt-24 bg-[#4361EE] rounded-2xl p-12 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
            Pourquoi utiliser notre système de suivi ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">Vue 360°</div>
              <div className="text-blue-100">Vue d'ensemble claire</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Smart</div>
              <div className="text-blue-100">Priorisation facilitée</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Auto</div>
              <div className="text-blue-100">Automatisation des tâches</div>
            </div>
          </div>
        </div>

        {/* Metric Highlight */}
        <div className="mt-24 text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-4xl font-bold text-[#4361EE] mb-4">+45%</div>
            <p className="text-xl text-gray-700">
              Augmentation moyenne du taux de conversion grâce à notre système de suivi
            </p>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center pb-20">
          <button className="bg-[#4361EE] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#3651DE] transition-colors">
            Optimisez vos interactions
          </button>
        </div>
      </div>
    </div>
  );
}

export default FollowUp;