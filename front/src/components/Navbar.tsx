import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo et liens de navigation */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="text-2xl font-bold text-[#4361EE]">
                  LeadBuilder
                </Link>
              </div>
              
              {/* Navigation desktop */}
              <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                {/* Fonctionnalités Dropdown */}
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => toggleDropdown('features')}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#4361EE]"
                  >
                    Fonctionnalités
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${openDropdown === 'features' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {openDropdown === 'features' && (
                    <div className="absolute left-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link 
                          to="/search-prospects" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setOpenDropdown(null)}
                        >
                          🔍 Recherche de Prospects
                        </Link>
                        <Link 
                          to="/lists" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setOpenDropdown(null)}
                        >
                          📋 Gestion des Listes
                        </Link>
                        <Link 
                          to="/followup" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setOpenDropdown(null)}
                        >
                          💬 Suivi des Interactions
                        </Link>
                        <Link 
                          to="/crm" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setOpenDropdown(null)}
                        >
                          📊 Tableau de Bord CRM
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Études de cas Dropdown */}
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => toggleDropdown('cases')}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#4361EE]"
                  >
                    Études de cas
                    <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${openDropdown === 'cases' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {openDropdown === 'cases' && (
                    <div className="absolute left-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link 
                          to="/case-studies/marketing" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setOpenDropdown(null)}
                        >
                          🎯 Agences & Consultants Marketing
                        </Link>
                        <Link 
                          to="/case-studies/b2b" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setOpenDropdown(null)}
                        >
                          💼 Entreprises de Services B2B
                        </Link>
                        <Link 
                          to="/case-studies/saas" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setOpenDropdown(null)}
                        >
                          💻 Entreprises SaaS
                        </Link>
                        <Link 
                          to="/case-studies/services" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setOpenDropdown(null)}
                        >
                          🛠️ Prestataires de Services
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <a href={import.meta.env.VITE_APP_URL + "/pricing"} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#4361EE]">
                  Prix
                </a>
                <Link to="/affiliate" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#4361EE]">
                  Affiliation
                </Link>
              </div>
            </div>

            {/* Boutons de connexion et inscription (desktop) */}
            <div className="hidden md:flex md:items-center">
              <a href={import.meta.env.VITE_APP_URL + "/login"} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#4361EE]">
                Connexion
              </a>
              <a href={import.meta.env.VITE_APP_URL + "/pricing"} className="ml-4 px-4 py-2 text-sm font-medium bg-[#4361EE] text-white hover:bg-[#3651DE] rounded-md">
                Essai Gratuit
              </a>
            </div>

            {/* Bouton menu mobile */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#4361EE] hover:bg-gray-100"
              >
                <span className="sr-only">Ouvrir le menu</span>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={() => toggleDropdown('features-mobile')}
                className="w-full text-left flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:text-[#4361EE] hover:bg-gray-100 rounded-md"
              >
                Fonctionnalités
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${openDropdown === 'features-mobile' ? 'rotate-180' : ''}`} />
              </button>
              
              {openDropdown === 'features-mobile' && (
                <div className="pl-4 space-y-1">
                  <Link 
                    to="/search-prospects"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#4361EE] hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    🔍 Recherche de Prospects
                  </Link>
                  <Link 
                    to="/lists"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#4361EE] hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    📋 Gestion des Listes
                  </Link>
                  <Link 
                    to="/followup"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#4361EE] hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    💬 Suivi des Interactions
                  </Link>
                  <Link 
                    to="/crm"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#4361EE] hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    📊 Tableau de Bord CRM
                  </Link>
                </div>
              )}
              
              <button
                onClick={() => toggleDropdown('cases-mobile')}
                className="w-full text-left flex items-center justify-between px-3 py-2 text-base font-medium text-gray-700 hover:text-[#4361EE] hover:bg-gray-100 rounded-md"
              >
                Études de cas
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${openDropdown === 'cases-mobile' ? 'rotate-180' : ''}`} />
              </button>
              
              {openDropdown === 'cases-mobile' && (
                <div className="pl-4 space-y-1">
                  <Link 
                    to="/case-studies/marketing"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#4361EE] hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    🎯 Agences & Consultants Marketing
                  </Link>
                  <Link 
                    to="/case-studies/b2b"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#4361EE] hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    💼 Entreprises de Services B2B
                  </Link>
                  <Link 
                    to="/case-studies/saas"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#4361EE] hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    💻 Entreprises SaaS
                  </Link>
                  <Link 
                    to="/case-studies/services"
                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#4361EE] hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setOpenDropdown(null);
                    }}
                  >
                    🛠️ Prestataires de Services
                  </Link>
                </div>
              )}

                <a href={import.meta.env.VITE_APP_URL + "pricing"} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-[#4361EE]">
                  Prix
                </a>
              <Link 
                to="/affiliate"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#4361EE] hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Affiliation
              </Link>
              <a 
                href={import.meta.env.VITE_APP_URL + "/login"}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#4361EE] hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </a>
              <a
                href={import.meta.env.VITE_APP_URL + "pricing"}
                className="block px-3 py-2 text-base font-medium bg-[#4361EE] text-white hover:bg-[#3651DE] rounded-md mx-3 mt-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Essai Gratuit
              </a>
            </div>
          </div>
        )}
      </nav>
      <div className="h-16"></div>
    </>
  );
}

export default Navbar;