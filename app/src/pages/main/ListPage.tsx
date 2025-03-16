import {useState, useEffect} from "react";
import { Search, Plus, Pencil, Trash2, Instagram, Loader2, X } from 'lucide-react';
import { supabaseClient } from '../../lib/supabaseClient';
import type { List, Profile } from '../../types/profile';
import UserLayout from "../../layouts/UserLayout";
import { 
  getUserLists, 
  getListById, 
  createList, 
  updateList, 
  deleteList, 
  getProfilesInList 
} from '../../db/List';

interface ListWithProfiles {
  id: number | string;
  name: string;
  user_id: string;
  created_at: string | null;
  updated_at: string | null;
  profiles: Profile[];
  profileCount: number;
}

interface EditListDialogProps {
  list: ListWithProfiles;
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
}

interface DeleteListDialogProps {
  list: ListWithProfiles;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function EditListDialog({ list, isOpen, onClose, onSave }: EditListDialogProps) {
  const [name, setName] = useState(list.name);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || saving) return;

    setSaving(true);
    await onSave(name.trim());
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Modifier la liste
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="listName" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la liste
            </label>
            <input
              type="text"
              id="listName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Nom de la liste"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Enregistrer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteListDialog({ list, isOpen, onClose, onConfirm }: DeleteListDialogProps) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setDeleting(true);
    await onConfirm();
    setDeleting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Supprimer la liste
          </h2>
        </div>

        <div className="p-4">
          <p className="text-gray-600 mb-4">
            Êtes-vous sûr de vouloir supprimer la liste "{list.name}" ? Cette action est irréversible.
          </p>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Supprimer'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function AuthDialog({ isOpen, onClose, onSuccess }: AuthDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);

    try {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      onSuccess();
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setError(null);

    try {
      const { error } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      onSuccess();
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {showRegisterForm ? 'Créer un compte' : 'Connexion requise'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={showRegisterForm ? handleRegister : handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={6}
            />
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={isLoggingIn || isRegistering}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              {(isLoggingIn || isRegistering) ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {showRegisterForm ? 'Création du compte...' : 'Connexion...'}
                </>
              ) : (
                showRegisterForm ? 'Créer mon compte' : 'Se connecter'
              )}
            </button>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowRegisterForm(!showRegisterForm);
                  setError(null);
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                {showRegisterForm ? 'Déjà un compte ? Se connecter' : 'Créer un compte'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function ListPage() {
  const [lists, setLists] = useState<ListWithProfiles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingList, setEditingList] = useState<ListWithProfiles | null>(null);
  const [deletingList, setDeletingList] = useState<ListWithProfiles | null>(null);
  const [newListName, setNewListName] = useState('');
  const [creating, setCreating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [addingToCampaign, setAddingToCampaign] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated && userId) {
      fetchLists();
    }
  }, [isAuthenticated, userId]);

  const checkAuth = async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    setIsAuthenticated(!!session);
    if (session?.user) {
      setUserId(session.user.id);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthDialog(false);
    checkAuth(); // Update userId
  };

  const fetchLists = async () => {
    if (!isAuthenticated || !userId) {
      setShowAuthDialog(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await getUserLists(userId);
      
      if (response.error) throw response.error;

      // Create a properly typed array for the lists with profiles
      const listsWithProfiles: ListWithProfiles[] = [];
      
      // Process each list
      for (const list of response.data || []) {
        // Convert list.id to string if it's a number
        const listId = typeof list.id === 'number' ? list.id.toString() : list.id;
        
        // Get profiles for this list with pagination
        const profilesResponse = await getProfilesInList(listId, 1, 6);
        
        // Create a properly typed list with profiles
        const listWithProfiles: ListWithProfiles = {
          ...list,
          // Use type assertion to handle potential type mismatches
          profiles: (profilesResponse.data || []) as unknown as Profile[],
          profileCount: profilesResponse.count || 0
        };
        
        listsWithProfiles.push(listWithProfiles);
      }

      setLists(listsWithProfiles);
    } catch (err) {
      console.error('Error:', err);
      setError('An error occurred while loading lists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim() || creating || !isAuthenticated || !userId) return;

    setCreating(true);
    setError(null);

    try {
      const response = await createList({ 
        name: newListName.trim(),
        user_id: userId
      });
      
      if (response.error) throw response.error;

      await fetchLists();
      setNewListName('');
      setShowCreateDialog(false);
    } catch (err) {
      setError('Error creating list');
      console.error('Error:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleEditList = async (name: string) => {
    if (!editingList || !isAuthenticated || !userId) return;

    try {
      // Convert id to string if it's a number
      const listId = typeof editingList.id === 'number' ? editingList.id.toString() : editingList.id;
      
      const response = await updateList(listId, { name });
      
      if (response.error) throw response.error;

      await fetchLists();
      setEditingList(null);
    } catch (err) {
      console.error('Error:', err);
      setError('Error updating list');
    }
  };

  const handleDeleteList = async () => {
    if (!deletingList || !isAuthenticated || !userId) return;

    try {
      // Convert id to string if it's a number
      const listId = typeof deletingList.id === 'number' ? deletingList.id.toString() : deletingList.id;
      
      const response = await deleteList(listId);
      
      if (response.error) throw response.error;

      await fetchLists();
      setDeletingList(null);
    } catch (err) {
      console.error('Error:', err);
      setError('Error deleting list');
    }
  };

  const handleAddToCampaign = async (listId: string | number) => {
    if (!isAuthenticated || !userId) {
      setShowAuthDialog(true);
      return;
    }

    setAddingToCampaign(true);
    setError(null);

    try {
      // Convert listId to number if it's a string
      const numericListId = typeof listId === 'string' ? parseInt(listId, 10) : listId;
      
      const { error } = await supabaseClient.rpc('add_list_to_campaign', {
        p_list_id: numericListId,
        p_user_id: userId
      });

      if (error) throw error;

      // Show success message or redirect to follow-up page
      window.location.href = '/followup';
    } catch (err) {
      console.error('Error:', err);
      setError('Error adding to campaign');
    } finally {
      setAddingToCampaign(false);
    }
  };

  const filteredLists = lists.filter(list =>
    list.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClick = () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
    } else {
      setShowCreateDialog(true);
    }
  };

  return (
      <UserLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher une liste..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleCreateClick}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Créer une nouvelle liste
        </button>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : filteredLists.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {searchTerm ? 'Aucune liste ne correspond à votre recherche' : 'Aucune liste créée'}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredLists.map((list) => (
            <div
              key={list.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Instagram className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-medium text-gray-900">{list.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingList(list)}
                      className="p-1 text-gray-400 hover:text-gray-500"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingList(list)}
                      className="p-1 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-3 grid-rows-2 gap-1 mb-4">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square bg-gray-100 rounded-sm flex items-center justify-center overflow-hidden"
                    >
                      {list.profiles && list.profiles[i] ? (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                          @{list.profiles[i].username}
                        </div>
                      ) : i === 5 && list.profileCount > 6 ? (
                        <span className="text-sm text-gray-500">+{list.profileCount - 6}</span>
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{list.profileCount} profils</span>
                  <button
                    onClick={() => handleAddToCampaign(list.id)}
                    disabled={addingToCampaign}
                    className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                  >
                    {addingToCampaign ? 'Ajout en cours...' : 'Ajouter à la campagne'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialogue de création de liste */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Créer une nouvelle liste
              </h2>
              <button
                onClick={() => setShowCreateDialog(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateList} className="p-4">
              <div className="mb-4">
                <label htmlFor="newListName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la liste
                </label>
                <input
                  type="text"
                  id="newListName"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Nom de la nouvelle liste"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creating || !newListName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Créer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialogue de modification */}
      {editingList && (
        <EditListDialog
          list={editingList}
          isOpen={true}
          onClose={() => setEditingList(null)}
          onSave={handleEditList}
        />
      )}

      {/* Dialogue de suppression */}
      {deletingList && (
        <DeleteListDialog
          list={deletingList}
          isOpen={true}
          onClose={() => setDeletingList(null)}
          onConfirm={handleDeleteList}
        />
      )}

      {/* Dialogue d'authentification */}
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
    </UserLayout>
  );
}

export default ListPage;