import React, { useState, useEffect } from 'react';
import { supabaseClient } from '../../lib/supabaseClient';
import { Bell, Send, Users, Trash2, CheckCircle, AlertTriangle, Check } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useNotifications } from '../../hooks/useNotifications';
import { Notification } from '../../db';

interface User {
  id: string;
  email: string;
  full_name: string;
}

export default function NotificationsPage() {
  const { notifications, loading, error: notificationsError, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(notificationsError);
  
  // État pour le formulaire de nouvelle notification
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    target: 'all', // 'all', 'role', 'user'
    targetRole: 'user',
    targetUserId: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error: fetchError } = await supabaseClient
        .from('users')
        .select('id, email, full_name')
        .order('full_name', { ascending: true });
      
      if (fetchError) throw fetchError;
      
      setUsers(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewNotification(prev => ({ ...prev, [name]: value }));
  };

  const createNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let targetUserId = null;
      let targetRole = null;
      
      if (newNotification.target === 'user') {
        targetUserId = newNotification.targetUserId;
      } else if (newNotification.target === 'role') {
        targetRole = newNotification.targetRole;
      }
      
      const notification = {
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type,
        target_user_id: targetUserId,
        target_role: targetRole,
        sent: false,
        read_count: 0
      };
      
      const { data, error: insertError } = await supabaseClient
        .from('notifications')
        .insert([notification])
        .select();
      
      if (insertError) throw insertError;
      
      // Réinitialiser le formulaire
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        target: 'all',
        targetRole: 'user',
        targetUserId: ''
      });
      
      // Mettre à jour la liste des notifications
      fetchNotifications();
      toast.success('Notification créée avec succès');
    } catch (err) {
      console.error('Erreur lors de la création de la notification:', err);
      toast.error('Erreur lors de la création de la notification');
    }
  };

  const sendNotification = async (id: string) => {
    try {
      // Dans un cas réel, cela déclencherait l'envoi de la notification aux utilisateurs ciblés
      const { error: updateError } = await supabaseClient
        .from('notifications')
        .update({ sent: true })
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // Mettre à jour l'état local
      fetchNotifications();
      
      toast.success('Notification envoyée avec succès');
    } catch (err) {
      console.error('Erreur lors de l\'envoi de la notification:', err);
      toast.error('Erreur lors de l\'envoi de la notification');
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      // Get current user
      const { data } = await supabaseClient.auth.getUser();
      
      if (!data.user) {
        toast.error('Vous devez être connecté pour effectuer cette action');
        return;
      }
      
      // Delete notification using the Notification module
      const { error } = await Notification.deleteNotification({
        notificationId: id,
        userId: data.user.id
      });
      
      if (error) throw error;
      
      // Update notifications list
      fetchNotifications();
      
      toast.success('Notification supprimée');
    } catch (err) {
      console.error('Erreur lors de la suppression de la notification:', err);
      toast.error('Erreur lors de la suppression de la notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    toast.success('Toutes les notifications ont été marquées comme lues');
  };

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const getNotificationIcon = (type: 'info' | 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'info':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTargetLabel = (notification: any) => {
    if (notification.target_user_id) {
      const user = users.find(u => u.id === notification.target_user_id);
      return user ? `Utilisateur: ${user.email}` : `Utilisateur: ${notification.target_user_id}`;
    } else if (notification.target_role) {
      return `Rôle: ${notification.target_role}`;
    } else {
      return 'Tous les utilisateurs';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des notifications</h1>
        
        {notifications.some(n => !n.isRead) && (
          <button
            onClick={handleMarkAllAsRead}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Check className="h-4 w-4 mr-2" />
            Marquer tout comme lu
          </button>
        )}
      </div>
      
      {/* Formulaire de création de notification */}
      <div className="bg-white shadow-sm rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Créer une nouvelle notification</h2>
          
          <form onSubmit={createNotification} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Titre
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={newNotification.title}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows={3}
                value={newNotification.message}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  id="type"
                  value={newNotification.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="info">Information</option>
                  <option value="success">Succès</option>
                  <option value="warning">Avertissement</option>
                  <option value="error">Erreur</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="target" className="block text-sm font-medium text-gray-700">
                  Destinataires
                </label>
                <select
                  name="target"
                  id="target"
                  value={newNotification.target}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="all">Tous les utilisateurs</option>
                  <option value="role">Par rôle</option>
                  <option value="user">Utilisateur spécifique</option>
                </select>
              </div>
            </div>
            
            {newNotification.target === 'role' && (
              <div>
                <label htmlFor="targetRole" className="block text-sm font-medium text-gray-700">
                  Rôle cible
                </label>
                <select
                  name="targetRole"
                  id="targetRole"
                  value={newNotification.targetRole}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
            )}
            
            {newNotification.target === 'user' && (
              <div>
                <label htmlFor="targetUserId" className="block text-sm font-medium text-gray-700">
                  Utilisateur cible
                </label>
                <select
                  name="targetUserId"
                  id="targetUserId"
                  value={newNotification.targetUserId}
                  onChange={handleInputChange}
                  required={newNotification.target === 'user'}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Sélectionner un utilisateur</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name || user.email}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Bell className="h-4 w-4 mr-2" />
                Créer la notification
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Liste des notifications */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications ({notifications.length})</h2>
          
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Aucune notification à afficher</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Titre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destinataires
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de création
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <tr 
                      key={notification.id} 
                      className={`hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50' : ''}`}
                      onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getNotificationIcon(notification.type)}
                          <span className="ml-2 text-sm text-gray-900">
                            {notification.type === 'info' && 'Information'}
                            {notification.type === 'success' && 'Succès'}
                            {notification.type === 'warning' && 'Avertissement'}
                            {notification.type === 'error' && 'Erreur'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {notification.title}
                          {!notification.isRead && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Nouveau
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">{notification.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-gray-400" />
                          {getTargetLabel(notification)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(notification.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            notification.sent
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {notification.sent ? 'Envoyée' : 'Non envoyée'}
                        </span>
                        {notification.sent && notification.read_count > 0 && (
                          <span className="ml-2 text-xs text-gray-500">
                            {notification.read_count} lecture(s)
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {!notification.sent && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sendNotification(notification.id);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="Envoyer"
                            >
                              <Send className="h-5 w-5" />
                            </button>
                          )}
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="text-green-600 hover:text-green-900"
                              title="Marquer comme lu"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
