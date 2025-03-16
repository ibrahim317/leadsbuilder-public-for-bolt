import  { useState } from 'react';

function Affiliate() {
  // State to track which FAQ item is open
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Toggle FAQ item
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // FAQ data with questions and answers
  const faqItems = [
    {
      question: "À quelle fréquence les paiements sont-ils effectués?",
      answer: "Les paiements sont effectués mensuellement, le 15 de chaque mois, pour tous les revenus générés le mois précédent. Un minimum de 50€ est requis pour recevoir un paiement. Si votre solde est inférieur, il sera reporté au mois suivant."
    },
    {
      question: "Comment suivre les inscriptions référées?",
      answer: "Vous pouvez suivre toutes vos inscriptions référées en temps réel via votre tableau de bord d'affilié. Vous y verrez les conversions, les revenus générés et les statistiques de performance de vos liens."
    },
    {
      question: "Où puis-je trouver les ressources de la marque LeadBuilder?",
      answer: "Toutes les ressources de la marque, y compris les logos, bannières, et textes promotionnels sont disponibles dans la section 'Ressources' de votre tableau de bord d'affilié. Vous pouvez les télécharger et les utiliser pour vos campagnes."
    },
    {
      question: "Puis-je faire de la publicité en utilisant mon lien d'affilié?",
      answer: "Oui, vous pouvez faire de la publicité avec votre lien d'affilié sur la plupart des plateformes. Cependant, nous interdisons le spam, l'achat de trafic de mauvaise qualité et l'utilisation de notre marque dans les campagnes Google Ads. Consultez nos conditions pour plus de détails."
    },
    {
      question: "Comment rejoindre la communauté d'affiliés?",
      answer: "Après votre inscription au programme d'affiliation, vous recevrez une invitation à notre communauté privée sur Discord. C'est un excellent endroit pour partager des stratégies, poser des questions et collaborer avec d'autres affiliés et notre équipe."
    },
    {
      question: "D'autres questions?",
      answer: "Si vous avez d'autres questions, n'hésitez pas à contacter notre équipe d'assistance aux affiliés à affilies@leadbuilder.co ou via le chat en direct sur votre tableau de bord. Nous sommes disponibles du lundi au vendredi, de 9h à 18h."
    }
  ];

  return (
    <div className="font-poppins">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Gagnez de l'argent à vie avec LeadBuilder 💸
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Recommandez LeadBuilder et gagnez 30% de revenus récurrents mensuels à vie.
              Il n'y a pas de limite à combien vous pouvez gagner.
            </p>
            <div className="flex justify-center gap-4 mb-12">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
                Devenir un affilié
              </button>
              <button className="bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors">
                Obtenir les ressources d'affiliation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Three Column Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Column 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">Votre lien de référence</p>
                <button className="text-xs bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors">
                  Copier le lien
                </button>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-gray-500 text-sm mb-6 truncate">
                https://app.leadbuilder.co/signup?ref=
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                Rejoindre le programme <span className="ml-1 text-yellow-500">✨</span>
              </h3>
              <p className="text-gray-600 text-sm">
                Créez votre compte d'affilié, accédez à votre plateforme, puis partagez votre lien et commencez à gagner.
              </p>
            </div>

            {/* Column 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                Partagez votre lien <span className="ml-1 text-yellow-500">👋</span>
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Partagez votre lien d'affilié ou code promotionnel avec vos amis, followers, ou n'importe où sur le web.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-2">
                      €0
                    </div>
                    <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
                      €129
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white text-xs px-3 py-1 rounded-md">
                    Payout
                  </button>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                Recevez des paiements à vie <span className="ml-1 text-yellow-500">💰</span>
              </h3>
              <p className="text-gray-600 text-sm">
                Vous gagnez 30% de commission récurrente pour chaque nouveau client que vous référez, à vie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Join and Earn Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Rejoignez et gagnez des revenus passifs facilement
            </h2>
            <p className="text-lg text-gray-600">
              Commencez à gagner de l'argent et créez une source de revenus mensuels passifs dès aujourd'hui.
            </p>
          </div>

          {/* Video Section */}
          <div className="max-w-4xl mx-auto bg-black rounded-xl overflow-hidden mb-8 relative aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                <div className="w-0 h-0 border-t-8 border-b-8 border-l-14 border-t-transparent border-b-transparent border-l-white ml-1"></div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center">
              <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
              <div>
                <p className="text-white text-sm font-medium">Bienvenue chez LeadBuilder Affiliés</p>
                <p className="text-white/70 text-xs">David</p>
              </div>
            </div>
            <div className="absolute bottom-4 right-4 text-white/70 text-xs">
              03:17
            </div>
          </div>

          <div className="flex justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
              Devenir un affilié
            </button>
          </div>
        </div>
      </section>

      {/* Share LeadBuilder Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Partagez LeadBuilder comme les meilleurs affiliés
            </h2>
            <p className="text-lg text-gray-600">
              Inspirez-vous de nos meilleurs affiliés et commencez à promouvoir sur YouTube, TikTok et Instagram.
            </p>
          </div>
        </div>
      </section>

      {/* Creators Love Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Les créateurs adorent promouvoir LeadBuilder
            </h2>
            <p className="text-lg text-gray-600">
              Notre taux de conversion est plus élevé que tous nos concurrents, ce qui rend le partage de LeadBuilder très rentable.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Des questions?
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <div key={index} className={`border-t ${index === faqItems.length - 1 ? 'border-b' : ''} border-gray-200 py-6`}>
                <div 
                  className="flex justify-between items-center cursor-pointer" 
                  onClick={() => toggleFaq(index)}
                >
                  <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                  <span className="text-blue-600 text-xl">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </div>
                {openFaq === index && (
                  <div className="mt-3 text-gray-600 leading-relaxed">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Affiliate; 