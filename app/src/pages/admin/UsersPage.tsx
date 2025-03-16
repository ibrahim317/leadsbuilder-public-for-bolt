import React, { useState } from 'react';
import { Loader2, Trash2, Shield, ShieldOff } from 'lucide-react';
import { useUsers } from '../../hooks/useUsers';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const UsersPage = () => {
  const { users, loading, error, updateUserRole, deleteUser } = useUsers();
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    await updateUserRole(userId, newRole);
  };

  const handleDeleteConfirm = async (userId: string) => {
    setUserToDelete(null);
    await deleteUser(userId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Une erreur est survenue lors du chargement des utilisateurs.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold">Gestion des utilisateurs</h2>
        <p className="mt-2 text-sm text-gray-700 sm:mt-0">
          {users.length} utilisateur{users.length > 1 ? 's' : ''}
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dernière connexion
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(user.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_sign_in_at
                        ? format(new Date(user.last_sign_in_at), 'dd/MM/yyyy HH:mm', { locale: fr })
                        : 'Jamais'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleRoleToggle(user.id, user.role)}
                          className="text-gray-400 hover:text-gray-500"
                          title={user.role === 'admin' ? 'Rétrograder en utilisateur' : 'Promouvoir en admin'}
                        >
                          {user.role === 'admin' ? (
                            <ShieldOff className="w-5 h-5" />
                          ) : (
                            <Shield className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => setUserToDelete(user.id)}
                          className="text-red-400 hover:text-red-500"
                          title="Supprimer l'utilisateur"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {userToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Confirmer la suppression</h3>
            <p className="text-sm text-gray-500 mb-4">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteConfirm(userToDelete)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-md"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
