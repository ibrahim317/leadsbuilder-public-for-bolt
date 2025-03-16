import React from 'react';

function Home() {
  return (
    <div className="font-poppins">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Trouvez des milliers de leads qualifiés en un clic et assurez votre suivi de prospection grâce à LeadBuilder
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Le seul outil Instagram qui vous permet de trouver des milliers de leads en un clic, les collecter, obtenir des réponses et assurer le follow-up 🤩
            </p>
            <button className="bg-[#4361EE] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#3651DE] transition-colors mb-8">
              Trouvez des leads gratuitement
            </button>
            
            <div className="flex items-center justify-center gap-2 mb-8">
              <img 
                src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/64b52db3d97c954b4a00e35e_rating-stars%20(3).png"
                alt="Rating stars"
                className="h-6"
              />
              <a href="https://www.google.com/search?q=submagic" className="text-gray-700 font-medium">
                4,9 sur 5 - Plus de 100 utilisateurs nous font confiance
              </a>
            </div>

            {/* Placeholder pour la vidéo VSL */}
            <div className="bg-gray-200 rounded-xl aspect-video max-w-3xl mx-auto mb-12">
              {/* La vidéo VSL sera intégrée ici */}
            </div>

            <p className="text-lg font-medium text-gray-700 mb-6">
              Aimé par les meilleures entrepreneurs de toute la France
            </p>
            <div className="flex justify-center items-center gap-8">
              <img src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/676594277e7dc1e771e3f482_Google.svg" alt="Google" className="h-8" />
              <img src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/676594279ccd5ff252059554_Trustpilot.svg" alt="Trustpilot" className="h-8" />
              <img src="https://cdn.prod.website-files.com/6469e2294ac68c3d5caea327/676594278f1e896c7bca120e_Gsquare.svg" alt="Gsquare" className="h-8" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Tout ce dont vous avez besoin pour obtenir des rdvs qualifiés en masse.
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Votre plateforme tout-en-un pour trouver des leads, créer votre liste de contacts avec des profils IG vérifiés, envoyer des DM qui génèrent des RDVs, et construire un follow-up solide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Recherchez vos cibles sur Instagram 🎯
              </h3>
              <p className="text-gray-600">
                En France, plus de 100 000 comptes entreprise Instagram sont référencés, et plus de 14 millions dans le monde.
              </p>
              <img src="/screenshots/search.png" alt="Recherche de leads" className="mt-4 rounded-lg w-full" />
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Importez vos résultats dans vos listes 📋
              </h3>
              <p className="text-gray-600">
                Segmentez vos différentes cibles et construisez vos listes de prospects.
              </p>
              <img src="/screenshots/lists.png" alt="Gestion des listes" className="mt-4 rounded-lg w-full" />
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Suivez en temps réel votre prospection 📊
              </h3>
              <p className="text-gray-600">
                Suivez en temps réel où vous en êtes pour chaque profil. Dois-je envoyer une relance ? Le prospect a-t-il pris un RDV ?
              </p>
              <img src="/screenshots/followup.png" alt="Suivi en temps réel" className="mt-4 rounded-lg w-full" />
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Prenez les bonnes décisions avec le CRM 📈
              </h3>
              <p className="text-gray-600">
                Quelle niche a le meilleur taux d'ouverture ? Quelle niche a le meilleur taux de conversion ?
              </p>
              <img src="/screenshots/crm.png" alt="Dashboard CRM" className="mt-4 rounded-lg w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Prospectez plus efficacement, avec de meilleurs résultats.
            </h3>
            <p className="text-xl text-gray-600">
              Gagnez du temps et transformez votre prospection Instagram en machine à conversions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#4361EE] mb-2">+15 heures</div>
              <div className="text-lg font-medium text-gray-900 mb-2">Heures économisées par semaine</div>
              <p className="text-gray-600">
                Automatisez vos recherches et suivez vos prospects sans effort.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#4361EE] mb-2">+70%</div>
              <div className="text-lg font-medium text-gray-900 mb-2">Taux de conversion optimisé</div>
              <p className="text-gray-600">
                Augmentez vos prises de contact et améliorez vos résultats.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#4361EE] mb-2">99%</div>
              <div className="text-lg font-medium text-gray-900 mb-2">Précision des données</div>
              <p className="text-gray-600">
                Des données toujours précises et mises à jour.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-16">
            Si vous aimez souffrir, n'utilisez pas LeadBuilder
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Sans LeadBuilder 😕
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  <span>Vous passez des heures à essayer de scraper des leads</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  <span>Vous ne savez plus qui démarcher</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  <span>Votre stratégie de prospection n'est pas efficace</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  <span>Vous n'avez pas un système de follow-up efficace</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  <span>Vous ne tracker pas vos performances</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">❌</span>
                  <span>Le choix d'une vie compliqué (vous aimez souffrir ?)</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Avec LeadBuilder 😎
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span>Testez gratuitement aujourd'hui 😊</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span>Scrapez l'intégralité des profils de votre audience</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span>Exportez tous vos résultats en un clic</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span>Mettez en place une trame de prospection à hyper conversion</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span>Système de follow-up efficace</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span>CRM pour analyser l'ensemble de vos performances</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span>Le choix d'une vie facile</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Rejoignez les +100 utilisateurs qui ont transformé leur prospection.
          </h2>
          <button className="bg-[#4361EE] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#3651DE] transition-colors">
            Trouvez des leads gratuitement
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;