import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ListChecks, MessageSquare, BarChart3, Menu, X, Settings, HelpCircle, Users, LineChart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { checkPermissions } from '../db/Admin';
import logo from '/logo.png';

function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user?.id) return;
    
    try {
      const { data: permissions, error } = await checkPermissions(user.id);
      
      if (error) {
        console.error('Error checking admin permissions:', error);
        return;
      }
      
      setIsAdmin(permissions?.isAdmin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const navLinks = [
    { to: '/', icon: Search, label: 'Search' },
    { to: '/lists', icon: ListChecks, label: 'Lists' },
    { to: '/followup', icon: MessageSquare, label: 'Follow-up' },
    { to: '/support', icon: HelpCircle, label: 'Support' },
    { to: '/referrals', icon: Users, label: 'Referrals' },
    { to: '/crm', icon: BarChart3, label: 'CRM' },
    { to: '/settings', icon: Settings, label: 'Settings' }
  ];

  const adminLinks = [
    { to: '/admin/tracking', icon: LineChart, label: 'Tracking' }
  ];

  const allLinks = isAdmin ? [...navLinks, ...adminLinks] : navLinks;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-[9999]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="LeadBuilder Logo" className="h-8 w-auto" />
              </Link>
            </div>

            {/* Mobile menu */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden sm:flex sm:items-center sm:space-x-4">
              {user && allLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === link.to
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-1.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {user && allLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center px-3 py-2 text-base font-medium ${
                      location.pathname === link.to
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-1.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
      <div className="h-16"></div> {/* Space to compensate for fixed navbar */}
    </>
  );
}

export default Navbar;