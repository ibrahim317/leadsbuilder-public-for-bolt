import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, ChevronLeft, ChevronRight, X, CheckSquare, Square, ListPlus } from 'lucide-react';
import { supabaseClient } from '../../lib/supabaseClient';
import type { Profile } from '../../types/profile';
import AddToListDialog from '../../components/AddToListDialog';
import UserLayout from '../../layouts/UserLayout';
import { Profile as ProfileModule } from '../../db';

function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProfiles, setSelectedProfiles] = useState<Set<number>>(new Set());
  const [showAddToListDialog, setShowAddToListDialog] = useState(false);
  const [addingToList, setAddingToList] = useState(false);
  const [allProfileIds, setAllProfileIds] = useState<number[]>([]);
  const [loadingAllIds, setLoadingAllIds] = useState(false);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const bioKeywords = location.state?.bioKeywords || [];
  const nameKeywords = location.state?.nameKeywords || [];
  const minFollowers = location.state?.minFollowers || null;
  const maxFollowers = location.state?.maxFollowers || null;
  const PAGE_SIZE = 50;

  const fetchAllProfileIds = async () => {
    setLoadingAllIds(true);
    try {
      // Create a keyword from all bio and name keywords
      const keyword = [...bioKeywords, ...nameKeywords].join(' ');
      
      const filter = {
        keyword,
        page: 1,
        perPage: 1000 // Get a large number of profiles
      };
      
      const { data, error } = await ProfileModule.searchProfiles(filter);
      
      if (error) throw error;
      
      const ids = data.map(profile => profile.id);
      setAllProfileIds(ids);
      return ids;
    } catch (err) {
      console.error('Erreur lors de la récupération des IDs:', err);
      setError('Erreur lors de la récupération des IDs');
      return [];
    } finally {
      setLoadingAllIds(false);
    }
  };

  const toggleSelectionMode = async () => {
    const newMode = !selectionMode;
    setSelectionMode(newMode);
    if (newMode) {
      await fetchAllProfileIds();
    } else {
      setSelectedProfiles(new Set());
      setIsAllSelected(false);
    }
  };

  const handleSelectAll = async () => {
    if (isAllSelected) {
      setSelectedProfiles(new Set());
      setIsAllSelected(false);
    } else {
      const ids = allProfileIds.length > 0 ? allProfileIds : await fetchAllProfileIds();
      setSelectedProfiles(new Set(ids));
      setIsAllSelected(true);
    }
  };

  const toggleProfileSelection = (profileId: number) => {
    setSelectedProfiles(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(profileId)) {
        newSelection.delete(profileId);
        setIsAllSelected(false);
      } else {
        newSelection.add(profileId);
        if (newSelection.size === allProfileIds.length) {
          setIsAllSelected(true);
        }
      }
      return newSelection;
    });
  };

  const handleRemoveBioKeyword = (index: number) => {
    const newBioKeywords = bioKeywords.filter((_: string, i: number) => i !== index);
    if (newBioKeywords.length === 0 && nameKeywords.length === 0 && !minFollowers && !maxFollowers) {
      navigate('/');
    } else {
      navigate('/search', { 
        state: { 
          bioKeywords: newBioKeywords,
          nameKeywords,
          minFollowers,
          maxFollowers
        }
      });
    }
  };

  const handleRemoveNameKeyword = (index: number) => {
    const newNameKeywords = nameKeywords.filter((_: string, i: number) => i !== index);
    if (bioKeywords.length === 0 && newNameKeywords.length === 0 && !minFollowers && !maxFollowers) {
      navigate('/');
    } else {
      navigate('/search', { 
        state: { 
          bioKeywords,
          nameKeywords: newNameKeywords,
          minFollowers,
          maxFollowers
        }
      });
    }
  };

  const handleRemoveFollowersFilter = () => {
    if (bioKeywords.length === 0 && nameKeywords.length === 0) {
      navigate('/');
    } else {
      navigate('/search', { 
        state: { 
          bioKeywords,
          nameKeywords,
          minFollowers: null,
          maxFollowers: null
        }
      });
    }
  };

  const handleAddToList = async (listId: string | number) => {
    if (selectedProfiles.size === 0) return;
    
    setAddingToList(true);
    setError(null);

    try {
      // Convert listId to number if it's a string
      const numericListId = typeof listId === 'string' ? parseInt(listId, 10) : listId;
      
      // Récupérer les profils déjà dans la liste
      const { data: existingProfiles } = await supabaseClient
        .from('list_profiles')
        .select('profile_id')
        .eq('list_id', numericListId);

      // Créer un Set des IDs déjà présents
      const existingIds = new Set(existingProfiles?.map(p => p.profile_id) || []);

      // Filtrer pour n'ajouter que les nouveaux profils
      const profilesToAdd = Array.from(selectedProfiles)
        .filter(profileId => !existingIds.has(profileId))
        .map(profileId => ({
          list_id: numericListId,
          profile_id: profileId
        }));

      // Si aucun nouveau profil à ajouter, terminer
      if (profilesToAdd.length === 0) {
        setSelectedProfiles(new Set());
        setShowAddToListDialog(false);
        setSelectionMode(false);
        return;
      }

      // Ajouter les profils par lots de 100 pour éviter les timeouts
      const batchSize = 100;
      for (let i = 0; i < profilesToAdd.length; i += batchSize) {
        const batch = profilesToAdd.slice(i, i + batchSize);
        const { error } = await supabaseClient
          .from('list_profiles')
          .upsert(batch, { 
            onConflict: 'list_id,profile_id',
            ignoreDuplicates: true 
          });

        if (error) {
          console.error('Erreur lors de l\'ajout du lot:', error);
          throw error;
        }
      }

      setSelectedProfiles(new Set());
      setShowAddToListDialog(false);
      setSelectionMode(false);

    } catch (err) {
      setError('Erreur lors de l\'ajout à la liste');
      console.error('Erreur:', err);
    } finally {
      setAddingToList(false);
    }
  };

  useEffect(() => {
    const fetchProfiles = async () => {
      if (bioKeywords.length === 0 && nameKeywords.length === 0 && !minFollowers && !maxFollowers) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Create a keyword from all bio and name keywords
        const keyword = [...bioKeywords, ...nameKeywords].join(' ');
        
        const filter = {
          keyword,
          page: currentPage,
          perPage: PAGE_SIZE
        };
        
        const { data, error, count } = await ProfileModule.searchProfiles(filter);
        
        if (error) {
          console.error('Erreur de recherche:', error);
          setError(`Erreur: ${error.message}`);
          return;
        }

        // Need to cast the data to match the Profile type from types/profile
        setResults(data as unknown as Profile[]);
        setTotalCount(count || 0);
        setHasMore(count ? count > currentPage * PAGE_SIZE : false);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Une erreur est survenue lors de la recherche');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [bioKeywords, nameKeywords, minFollowers, maxFollowers, currentPage]);

  if (bioKeywords.length === 0 && nameKeywords.length === 0 && !minFollowers && !maxFollowers) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center text-gray-600">
          Aucun critère de recherche spécifié
        </div>
      </div>
    );
  }

  const startResult = (currentPage - 1) * PAGE_SIZE + 1;
  const endResult = Math.min(currentPage * PAGE_SIZE, totalCount);

  return (
      <UserLayout>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {totalCount} résultats trouvés
          </h1>

          <div className="flex items-center gap-4">
            {!selectionMode ? (
              <button
                onClick={toggleSelectionMode}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Sélectionner des profils
              </button>
            ) : (
              <>
                <button
                  onClick={handleSelectAll}
                  disabled={loadingAllIds}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center gap-2"
                >
                  {loadingAllIds ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isAllSelected ? (
                    <CheckSquare className="w-4 h-4" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                  {loadingAllIds ? 'Chargement...' : isAllSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
                </button>
                <button
                  onClick={() => setShowAddToListDialog(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  disabled={selectedProfiles.size === 0 || addingToList}
                >
                  <ListPlus className="w-4 h-4" />
                  Ajouter à une liste ({selectedProfiles.size})
                </button>
                <button
                  onClick={toggleSelectionMode}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                >
                  Terminer la sélection
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {bioKeywords.map((keyword: string, index: number) => (
            <span
              key={`bio-${index}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              Bio: {keyword}
              <button
                type="button"
                onClick={() => handleRemoveBioKeyword(index)}
                className="ml-2 inline-flex items-center p-0.5 hover:bg-blue-200 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {nameKeywords.map((keyword: string, index: number) => (
            <span
              key={`name-${index}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              Nom: {keyword}
              <button
                type="button"
                onClick={() => handleRemoveNameKeyword(index)}
                className="ml-2 inline-flex items-center p-0.5 hover:bg-blue-200 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {(minFollowers !== null || maxFollowers !== null) && (
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
            >
              Followers: {minFollowers !== null ? minFollowers.toLocaleString() : '0'} - {maxFollowers !== null ? maxFollowers.toLocaleString() : '∞'}
              <button
                type="button"
                onClick={handleRemoveFollowersFilter}
                className="ml-2 inline-flex items-center p-0.5 hover:bg-purple-200 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600">
          Affichage des résultats {startResult} à {endResult} sur {totalCount}
        </p>
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
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-8">
            {results.map((profile) => (
              <div
                key={profile.id}
                className={`bg-white p-4 rounded-lg shadow-sm border transition-all ${
                  selectionMode
                    ? 'cursor-pointer hover:shadow-md'
                    : 'hover:shadow-md border-gray-200'
                } ${
                  selectionMode && profile.id && selectedProfiles.has(profile.id)
                    ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                    : ''
                }`}
                onClick={() => {
                  if (selectionMode && profile.id) {
                    toggleProfileSelection(profile.id);
                  }
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">@{profile.username}</div>
                    {profile.full_name && (
                      <div className="text-sm text-gray-700">{profile.full_name}</div>
                    )}
                  </div>
                  {selectionMode && profile.id && (
                    <div className="text-blue-600">
                      {selectedProfiles.has(profile.id) ? (
                        <CheckSquare className="w-5 h-5" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </div>
                  )}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  {profile.followers.toLocaleString()} followers
                </div>
                {profile.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2">{profile.bio}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </div>
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage}
            </span>

            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={!hasMore}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                Suivant
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>
        </>
      )}

      <AddToListDialog
        isOpen={showAddToListDialog}
        onClose={() => setShowAddToListDialog(false)}
        onAddToList={handleAddToList}
        selectedCount={selectedProfiles.size}
      />
    </div>
    </UserLayout>
  );
}

export default SearchResults;