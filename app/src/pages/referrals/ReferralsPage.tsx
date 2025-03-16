import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Copy, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import UserLayout from "../../layouts/UserLayout";
import { Referral, ReferralStats, createReferral, getReferrals, getReferralStats } from "../../db/Referral";

export default function ReferralsPage() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [referralCode, setReferralCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReferralStats>({
    total: 0,
    converted: 0,
    pending: 0,
  });

  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);

  const fetchReferralData = async () => {
    try {
      if (!user?.id) return;

      // Get or create referral code
      const { data: codeData, error: codeError } = await createReferral(user.id);
      
      if (codeError) {
        console.error("Error retrieving referral code:", codeError);
        toast.error("Unable to load referral code");
        return;
      }
      
      if (codeData) {
        setReferralCode(codeData.code);
      }

      // Get referrals
      const { data: referralsData, error: referralsError } = await getReferrals(user.id);
      
      if (referralsError) {
        console.error("Error loading referrals:", referralsError);
        toast.error("Unable to load referrals");
        return;
      }
      
      setReferrals(referralsData || []);

      // Get referral stats
      const { data: statsData, error: statsError } = await getReferralStats(user.id);
      
      if (statsError) {
        console.error("Error loading referral statistics:", statsError);
        toast.error("Unable to load referral statistics");
        return;
      }
      
      if (statsData) {
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error loading referral data:", error);
      toast.error("Unable to load referral data");
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = async () => {
    const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("Referral link copied!");
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Unable to copy link");
    }
  };

  const shareReferralLink = async () => {
    const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join me on LeadBuilder",
          text: "Use my referral link to sign up for LeadBuilder!",
          url: referralLink,
        });
      } else {
        throw new Error("Sharing not supported");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Unable to share link");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
      <UserLayout>
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Referral Program</h1>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Total Referrals</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Converted</h3>
              <p className="text-3xl font-bold text-green-600">
                {stats.converted}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Your Referral Link
            </h2>
            <div className="flex gap-2 mb-4">
              <Input
                value={`${window.location.origin}/signup?ref=${referralCode}`}
                readOnly
                className="flex-1"
              />
              <Button onClick={copyReferralLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button onClick={shareReferralLink}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Share this link with your friends and earn rewards when they sign up!
            </p>
          </div>

          <div className="bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold p-6 border-b">
              Referral History
            </h2>
            <div className="divide-y">
              {referrals.length === 0 ? (
                <p className="p-6 text-center text-gray-500">
                  You don't have any referrals yet
                </p>
              ) : (
                referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="p-6 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{referral.referred?.email}</p>
                      <p className="text-sm text-gray-500">
                        Signed up on{" "}
                        {new Date(referral.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          referral.status === "converted"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {referral.status === "converted"
                          ? "Converted"
                          : "Pending"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          referral.reward_status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {referral.reward_status === "paid"
                          ? "Reward paid"
                          : "Payment pending"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </UserLayout>
  );
}
