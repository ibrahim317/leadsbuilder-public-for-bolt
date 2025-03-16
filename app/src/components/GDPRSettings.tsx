import React, { useState, useEffect } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { deleteUserData, getSettings } from '../db/GDPR';

const GDPRSettings: React.FC = () => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      
      if (!user?.id) {
        throw new Error('User not logged in');
      }

      // Get user data from various tables
      const { data: userData, error: userDataError } = await getSettings(user.id);
      
      if (userDataError) {
        throw userDataError;
      }

      // Create and download the file
      const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my-data-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Your data has been exported successfully');
    } catch (error: any) {
      toast.error('Error exporting data');
      console.error('Export error:', error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      
      if (!user?.id) {
        throw new Error('User not logged in');
      }

      // Delete user data and account
      const { data: deleteResult, error: deleteError } = await deleteUserData(user.id, true);
      
      if (deleteError) {
        throw deleteError;
      }

      toast.success('Your account has been deleted successfully');
      window.location.href = '/';
    } catch (error: any) {
      toast.error('Error deleting account');
      console.error('Delete error:', error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Your GDPR Rights</h3>
        <p className="text-gray-600 mb-4">
          In accordance with the General Data Protection Regulation (GDPR),
          you have the right to access, rectify, and delete your data.
        </p>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium mb-4">Export Your Data</h4>
        <p className="text-gray-600 mb-4">
          Download a copy of all your personal data in JSON format.
        </p>
        <button
          onClick={handleExportData}
          disabled={isExporting}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="h-5 w-5 mr-2" />
          {isExporting ? 'Exporting...' : 'Export my data'}
        </button>
      </div>

      <div className="border-t pt-6">
        <h4 className="font-medium mb-4">Delete Your Account</h4>
        <p className="text-gray-600 mb-4">
          This action will permanently delete your account and all associated data.
          This action is irreversible.
        </p>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
              handleDeleteAccount();
            }
          }}
          disabled={isDeleting}
          className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <Trash2 className="h-5 w-5 mr-2" />
          {isDeleting ? 'Deleting...' : 'Delete my account'}
        </button>
      </div>
    </div>
  );
};

export default GDPRSettings;
