import React from 'react';
import { LineChart, BarChart3, Activity, Target, Brain, Zap } from 'lucide-react';

function CRM() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto pt-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Pilotez votre prospection avec précision
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Centralisez et analysez toutes vos données de prospection en un seul endroit.
          </p>
          <button className="bg-[#4361EE] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#3651DE] transition-colors">
            Accédez à votre tableau de bord
          </button>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-blue-600">Taux de conversion</div>
                <LineChart className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-700">24.8%</div>
              <div className="text-sm text-blue-600 mt-1">+2.4% ce mois</div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-green-600">Prospects actifs</div>
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-700">1,247</div>
              <div className="text-sm text-green-600 mt-1">+127 cette semaine</div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-purple-600">Messages envoyés</div>
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-700">3,892</div>
              <div className="text-sm text-purple-600 mt-1">89% taux d'ouverture</div>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-orange-600">RDV confirmés</div>
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-700">89</div>
              <div className="text-sm text-orange-600 mt-1">Objectif : 100</div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-[#4361EE] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
              <Activity className="w-6 h-6 text-[#4361EE]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Vue d'ensemble complète 📊
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Métriques clés en temps réel</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Graphiques personnalisables</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>KPIs configurables</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-[#4361EE] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
              <Brain className="w-6 h-6 text-[#4361EE]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Prédictions et tendances 🎯
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>IA prédictive</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Suggestions d'amélioration</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Alertes intelligentes</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-[#4361EE] bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
              <Zap className="w-6 h-6 text-[#4361EE]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Entonnoir de conversion ⚡️
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Visualisation des étapes</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Analyse des points bloquants</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#4361EE] mr-2">•</span>
                <span>Optimisation du parcours</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Data-Driven Advantage */}
        <div className="mt-24 bg-[#4361EE] rounded-2xl p-12 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
            L'avantage data-driven
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">Smart</div>
              <div className="text-blue-100">Décisions éclairées</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">+100%</div>
              <div className="text-blue-100">Optimisation continue</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">ROI</div>
              <div className="text-blue-100">Mesurable et prouvé</div>
            </div>
          </div>
        </div>

        {/* Success Story */}
        <div className="mt-24 text-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-12">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Comment nos utilisateurs ont doublé leur taux de conversion
            </h3>
            <p className="text-xl text-gray-700">
              "Grâce aux insights fournis par le tableau de bord, nous avons pu identifier les moments clés du parcours client et optimiser chaque étape. Résultat : notre taux de conversion a doublé en 3 mois."
            </p>
            <div className="mt-6 text-gray-600">
              Thomas M. - Responsable Commercial
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-24 text-center pb-20">
          <button className="bg-[#4361EE] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#3651DE] transition-colors">
            Accédez à votre tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
}

export default CRM;