import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar, { AdminMobileMenu } from '../components/admin/AdminSidebar';
import NotificationsBadge from '../components/admin/NotificationsBadge';
import { Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { checkPermissions } from '../db/Admin';

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdminAuth();
    } else {
      navigate('/auth/login');
    }
  }, [user]);

  const checkAdminAuth = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        navigate('/auth/login');
        return;
      }

      // Check if user has admin permissions
      const { data: permissions, error } = await checkPermissions(user.id);
      
      if (error) {
        console.error('Error checking permissions:', error);
        navigate('/');
        return;
      }
      
      if (!permissions?.isAdmin) {
        console.log('User does not have admin permissions');
        navigate('/');
        return;
      }
    } catch (err) {
      console.error('Authentication error:', err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar */}
      <AdminMobileMenu isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Desktop sidebar */}
      <AdminSidebar />
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow md:hidden">
          <button
            type="button"
            className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="flex items-center">
                <span className="text-xl font-bold text-blue-600">LeadBuilder</span>
                <span className="ml-2 px-2 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-800">Admin</span>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <NotificationsBadge />
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
