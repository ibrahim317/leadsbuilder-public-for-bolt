import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, X, AlertCircle } from "lucide-react";
import { useUsageLimits } from "../../hooks/useUsageLimits";
import { UsageLimitAlert } from "../../components/UsageLimitAlert";
import UserLayout from "../../layouts/UserLayout";

function SearchPage() {
  const [bioKeyword, setBioKeyword] = useState("");
  const [bioKeywords, setBioKeywords] = useState<string[]>([]);
  const [nameKeyword, setNameKeyword] = useState("");
  const [nameKeywords, setNameKeywords] = useState<string[]>([]);
  const [minFollowers, setMinFollowers] = useState<string>("");
  const [maxFollowers, setMaxFollowers] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    limits,
    usage,
    loading: limitsLoading,
    checkSearchLimit,
    incrementSearchCount,
  } = useUsageLimits();

  const handleAddBioKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (bioKeyword.trim()) {
      setBioKeywords((prev) => [...prev, bioKeyword.trim()]);
      setBioKeyword("");
    }
  };

  const handleAddNameKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameKeyword.trim()) {
      setNameKeywords((prev) => [...prev, nameKeyword.trim()]);
      setNameKeyword("");
    }
  };

  const handleRemoveBioKeyword = (index: number) => {
    setBioKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNameKeyword = (index: number) => {
    setNameKeywords((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const bioTerms = bioKeyword.trim()
      ? [...bioKeywords, bioKeyword.trim()]
      : bioKeywords;
    const nameTerms = nameKeyword.trim()
      ? [...nameKeywords, nameKeyword.trim()]
      : nameKeywords;
    const minFollowersNum = minFollowers ? parseInt(minFollowers, 10) : null;
    const maxFollowersNum = maxFollowers ? parseInt(maxFollowers, 10) : null;

    if (
      bioTerms.length === 0 &&
      nameTerms.length === 0 &&
      !minFollowersNum &&
      !maxFollowersNum
    )
      return;

    setLoading(true);

    try {
      // Vérifier la limite de recherche
      const canSearch = await checkSearchLimit();
      if (!canSearch) {
        throw new Error(
          "Vous avez atteint votre limite de recherches mensuelles"
        );
      }

      // Incrémenter le compteur de recherche
      await incrementSearchCount();

      navigate("/search", {
        state: {
          bioKeywords: bioTerms,
          nameKeywords: nameTerms,
          minFollowers: minFollowersNum,
          maxFollowers: maxFollowersNum,
        },
      });
    } catch (err: any) {
      console.error("Erreur:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <UserLayout>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 ">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Recherche de profils
            </h1>

            {!limitsLoading && limits && usage && (
              <div className="text-sm text-gray-600">
                {limits.monthlySearches === -1 ? (
                  "Recherches illimitées"
                ) : (
                  <div className="flex items-center gap-2">
                    <span>
                      {usage.searchesUsed} / {limits.monthlySearches} recherches
                    </span>
                    {usage.searchesUsed >= limits.monthlySearches && (
                      <div className="flex items-center text-red-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Limite atteinte
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <UsageLimitAlert type="search" />

          <form onSubmit={handleSearch} className="space-y-6">
            {/* Recherche par nom */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Rechercher par nom
              </label>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={nameKeyword}
                    onChange={(e) => setNameKeyword(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    placeholder="Ajouter un mot-clé pour le nom..."
                  />
                  <button
                    type="button"
                    onClick={handleAddNameKeyword}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <div className="flex items-center justify-center">
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </div>
                  </button>
                </div>

                {/* Tags des mots-clés nom */}
                {nameKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {nameKeywords.map((kw, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => handleRemoveNameKeyword(index)}
                          className="ml-2 inline-flex items-center p-0.5 hover:bg-blue-200 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recherche par bio */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Rechercher dans la bio (recherche combinée)
              </label>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={bioKeyword}
                    onChange={(e) => setBioKeyword(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    placeholder="Ajouter un mot-clé pour la bio..."
                  />
                  <button
                    type="button"
                    onClick={handleAddBioKeyword}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <div className="flex items-center justify-center">
                      <Plus className="w-4 h-4 mr-1" />
                      Ajouter
                    </div>
                  </button>
                </div>

                {/* Tags des mots-clés bio */}
                {bioKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {bioKeywords.map((kw, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => handleRemoveBioKeyword(index)}
                          className="ml-2 inline-flex items-center p-0.5 hover:bg-blue-200 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Filtres de followers */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Filtres de followers
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Min. followers
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minFollowers}
                    onChange={(e) => setMinFollowers(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    Max. followers
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={maxFollowers}
                    onChange={(e) => setMaxFollowers(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                    placeholder="∞"
                  />
                </div>
              </div>
            </div>

            {/* Bouton de recherche */}
            <button
              type="submit"
              disabled={
                loading ||
                (bioKeywords.length === 0 &&
                  !bioKeyword.trim() &&
                  nameKeywords.length === 0 &&
                  !nameKeyword.trim() &&
                  !minFollowers &&
                  !maxFollowers)
              }
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Recherche...
                </div>
              ) : (
                "Lancer la recherche"
              )}
            </button>
          </form>
        </div>
      </UserLayout>
  );
}

export default SearchPage;
