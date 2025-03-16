import { useState, useEffect, useCallback } from "react";
import { format, subDays, addDays } from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Loader2, RefreshCcw } from "lucide-react";
import { supabaseClient } from "../../lib/supabaseClient";
import { handleSupabaseError } from "../../lib/error-handlers";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import type {
  FollowUpProfile,
  Message,
  MessageType,
  Status,
} from "../../types/followup";
import DateColumn from "../../components/DateColumn";
import UserLayout from "../../layouts/UserLayout";

const STATUS_COLORS: Record<Status, string> = {
  non_contacté: "bg-gray-100 text-gray-600",
  message_envoye: "bg-blue-100 text-blue-600",
  en_discussion: "bg-orange-100 text-orange-600",
  rdv: "bg-green-100 text-green-600",
  pas_interesse: "bg-red-100 text-red-600",
};

const ITEMS_PER_PAGE = 100;

function FollowUpPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<FollowUpProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [dates, setDates] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState(addDays(new Date(), 30));

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth/login");
    }
  }, [user, authLoading, navigate]);

  const fetchProfiles = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const {
        data: campaignData,
        error: campaignError,
        count,
      } = await supabaseClient
        .from("campaign_profiles")
        .select(
          `
          id,
          profile_id,
          list_id,
          start_date,
          profiles (
            id,
            instagram_url,
            username,
            full_name
          ),
          lists (
            id,
            name
          )
        `,
          { count: "exact" }
        )
        .eq("user_id", user.id)
        .eq("archived", false)
        .order("created_at", { ascending: false })
        .range(
          (currentPage - 1) * ITEMS_PER_PAGE,
          currentPage * ITEMS_PER_PAGE - 1
        );

      if (campaignError) throw campaignError;

      setTotalCount(count || 0);

      if (!campaignData || campaignData.length === 0) {
        setProfiles([]);
        return;
      }

      const profileIds = campaignData.map((cp) => cp.profile_id);
      const { data: messagesData, error: messagesError } = await supabaseClient
        .from("messages")
        .select("*")
        .in("profile_id", profileIds)
        .order("sent_at", { ascending: false });

      if (messagesError) throw messagesError;

      const processedProfiles: FollowUpProfile[] = campaignData
        .filter((cp) => cp.profiles && cp.lists)
        .map((cp) => {
          const profileMessages =
            messagesData?.filter((m: any) => m.profile_id === cp.profile_id) ||
            [];
          const status = determineStatus(profileMessages);

          return {
            id: cp.profile_id,
            instagram_url: cp.profiles[0].instagram_url,
            username: cp.profiles[0].username,
            full_name: cp.profiles[0].full_name,
            list_id: cp.list_id,
            list_name: cp.lists[0].name,
            status,
            messages: profileMessages,
            start_date: cp.start_date,
          };
        });

      setProfiles(processedProfiles);

      if (processedProfiles.length > 0) {
        const firstStartDate = new Date(processedProfiles[0].start_date);
        setStartDate(firstStartDate);
        setEndDate(addDays(firstStartDate, 60));
      }
    } catch (err) {
      console.error("Erreur:", err);
      setError(handleSupabaseError(err).message);
    } finally {
      setLoading(false);
    }
  }, [currentPage, user]);

  useEffect(() => {
    if (user) {
      fetchProfiles();
    }
  }, [fetchProfiles, user]);

  useEffect(() => {
    const dateArray: Date[] = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate = addDays(currentDate, 1);
    }
    setDates(dateArray);
  }, [startDate, endDate]);

  const determineStatus = (messages: Message[]): Status => {
    if (messages.length === 0) return "non_contacté";

    const lastMessage = messages.sort(
      (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
    )[0];

    if (lastMessage.type === "rdv") return "rdv";
    if (lastMessage.type === "pas_interesse") return "pas_interesse";
    if (lastMessage.type === "1er_message") return "message_envoye";
    return "en_discussion";
  };

  const handleMessageAdd = async (
    profileId: number,
    type: MessageType,
    date: Date
  ) => {
    try {
      const { error } = await supabaseClient.from("messages").insert([
        {
          profile_id: profileId,
          type,
          sent_at: date.toISOString(),
        },
      ]);

      if (error) throw error;

      await fetchProfiles();
    } catch (err) {
      console.error("Erreur lors de l'ajout du message:", err);
      setError(handleSupabaseError(err).message);
    }
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    const pages = [];

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(
        <button
          key="1"
          onClick={() => setCurrentPage(1)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === 1
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>
        );
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === totalPages
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  const startResult = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endResult = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);
  const canGoNext = totalCount > currentPage * ITEMS_PER_PAGE;

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">
          Chargement de l'authentification...
        </span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Chargement des profils...</span>
      </div>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-[95%] mx-auto">
        <div className="mb-8 space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Suivi des prospects
              </h1>

              <button
                onClick={fetchProfiles}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <RefreshCcw className="w-4 h-4" />
                Actualiser
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Affichage {startResult} à {endResult} sur {totalCount} prospects
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}

          <div className="relative bg-white rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full align-middle">
                <div className="h-[calc(100vh-300px)] overflow-y-auto relative">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0 z-30">
                      <tr>
                        <th
                          scope="col"
                          className="sticky left-0 z-40 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px] border-r border-gray-200"
                        >
                          Compte Instagram
                        </th>
                        <th
                          scope="col"
                          className="sticky left-[200px] z-40 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px] border-r border-gray-200"
                        >
                          Liste
                        </th>
                        <th
                          scope="col"
                          className="sticky left-[350px] z-40 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] border-r border-gray-200"
                        >
                          Statut
                        </th>
                        {dates.map((date) => (
                          <th
                            key={date.toISOString()}
                            scope="col"
                            className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24 border-r border-gray-200 min-w-[96px]"
                          >
                            {format(date, "dd/MM", { locale: fr })}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {profiles.map((profile) => (
                        <tr key={profile.id} className="hover:bg-gray-50">
                          <td className="sticky left-0 z-20 bg-white px-6 py-4 whitespace-nowrap border-r border-gray-200">
                            <div className="flex flex-col">
                              <a
                                href={profile.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                              >
                                @{profile.username}
                              </a>
                              {profile.full_name && (
                                <span className="text-sm text-gray-500">
                                  {profile.full_name}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="sticky left-[200px] z-20 bg-white px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                            {profile.list_name}
                          </td>
                          <td className="sticky left-[350px] z-20 bg-white px-6 py-4 whitespace-nowrap border-r border-gray-200">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                STATUS_COLORS[profile.status]
                              }`}
                            >
                              {profile.status.replace(/_/g, " ")}
                            </span>
                          </td>
                          {dates.map((date) => (
                            <td
                              key={date.toISOString()}
                              className="px-0 py-4 text-sm text-center border-r border-gray-200"
                            >
                              <DateColumn
                                date={date}
                                profile={profile}
                                onMessageAdd={handleMessageAdd}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Précédent
              </div>
            </button>

            <div className="flex items-center space-x-1">
              {renderPagination()}
            </div>

            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={!canGoNext}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center">
                Suivant
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </button>
          </div>
        </div>
      </UserLayout>
  );
}

export default FollowUpPage;
