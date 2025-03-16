import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { supabaseClient } from '../lib/supabaseClient';
import { List } from '../db/types';
import { getUserLists, createList } from '../db/List';

interface AddToListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToList: (listId: string | number) => Promise<void>;
  selectedCount: number;
}

export default function AddToListDialog({ isOpen, onClose, onAddToList, selectedCount }: AddToListDialogProps) {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newListName, setNewListName] = useState('');
  const [creatingList, setCreatingList] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isOpen && isAuthenticated && userId) {
      fetchLists();
    }
  }, [isOpen, isAuthenticated, userId]);

  const checkAuth = async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    setIsAuthenticated(!!session);
    if (session?.user) {
      setUserId(session.user.id);
    }
  };

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

      setIsAuthenticated(true);
      setEmail('');
      setPassword('');
      checkAuth(); // Update userId
    } catch (err: any) {
      setError(err.message || 'Login error');
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

      setIsAuthenticated(true);
      setEmail('');
      setPassword('');
      setShowRegisterForm(false);
      checkAuth(); // Update userId
    } catch (err: any) {
      setError(err.message || 'Registration error');
    } finally {
      setIsRegistering(false);
    }
  };

  const fetchLists = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await getUserLists(userId);

      if (response.error) throw response.error;
      setLists(response.data || []);
    } catch (err) {
      setError('Error loading lists');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim() || !isAuthenticated || !userId) return;

    setCreatingList(true);
    setError(null);

    try {
      const response = await createList({
        name: newListName.trim(),
        user_id: userId
      });

      if (response.error) throw response.error;

      if (response.data) {
        setLists(prev => [response.data as List, ...prev]);
        setNewListName('');
        setShowCreateForm(false);
        
        await onAddToList(response.data.id);
      }
    } catch (err) {
      setError('Error creating list');
      console.error('Error:', err);
    } finally {
      setCreatingList(false);
    }
  };

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {showRegisterForm ? 'Create an account' : 'Login required'}
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
                Password
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
                    {showRegisterForm ? 'Creating account...' : 'Logging in...'}
                  </>
                ) : (
                  showRegisterForm ? 'Create my account' : 'Login'
                )}
              </button>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowRegisterForm(!showRegisterForm);
                    setError(null);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {showRegisterForm ? 'Already have an account? Login' : 'Create an account'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Add {selectedCount} profile{selectedCount > 1 ? 's' : ''} to a list
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {!showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full mb-4 p-3 flex items-center justify-center gap-2 text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50"
            >
              <Plus className="w-4 h-4" />
              Create a new list
            </button>
          )}

          {showCreateForm && (
            <form onSubmit={handleCreateList} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Name of the new list"
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  disabled={creatingList}
                />
                <button
                  type="submit"
                  disabled={creatingList || !newListName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {creatingList ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Create'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : lists.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No existing lists
            </div>
          ) : (
            <div className="grid gap-2">
              {lists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => onAddToList(list.id)}
                  className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {list.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}