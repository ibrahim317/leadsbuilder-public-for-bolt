import ConversionTrackingPage from "./pages/admin/ConversionTrackingPage";
import SubscriptionsPage from "./pages/admin/SubscriptionsPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import ReferralsPage from "./pages/referrals/ReferralsPage";
import MonitoringPage from "./pages/admin/MonitoringPage";
import EmailTemplates from "./pages/admin/EmailTemplates";
import DashboardPage from "./pages/admin/DashboardPage";
import PaymentSuccess from "./pages/payment/success";
import ThankYouPage from "./pages/auth/ThankYouPage";
import CookieConsent from "./components/CookieConsent";
import TicketsPage from "./pages/support/TicketsPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2, AlertCircle } from "lucide-react";
import { ResetPassword } from "./pages/auth/ResetPasswordPage";
import { VerifyEmail } from "./pages/auth/VerifyEmailPage";
import { LiveChat } from "./components/chat/LiveChat";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import SearchResults from "./pages/main/SearchResults";
import FollowUpPage from "./pages/main/FollowUpPage";
import SettingsPage from "./pages/main/SettingsPage";
import CRMDashboard from "./pages/main/CRMDashboard";
import EmailsPage from "./pages/admin/EmailsPage";
import UsersPage from "./pages/admin/UsersPage";
import LoginPage from "./pages/auth/LoginPage";
import SearchPage from "./pages/main/SearchPage";
import ListPage from "./pages/main/ListPage";
import AdminLayout from "./layouts/AdminLayout";
import StatsPage from "./pages/admin/StatsPage";
import Register from './pages/auth/RegisterPage';
import RegisterSuccess from './pages/auth/RegisterSuccessPage';
import Pricing from './pages/pricing/PricingPage';
import { useAuth } from "./contexts/AuthContext";
import BillingPage from "./pages/settings/BillingPage";

function App() {
  const { loading, error } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2 text-red-600">
          <AlertCircle className="w-6 h-6" />
          {/* an error has occured */}
          <span>Une erreur est survenue</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/auth/login" element={ <LoginPage /> } />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/register-success" element={<RegisterSuccess />} />
        <Route path="/auth/thank-you" element={<ThankYouPage />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/settings/billing" element={<BillingPage />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />
        <Route path="/results" element={
          <ProtectedRoute>
            <SearchResults />
          </ProtectedRoute>
        } />
        <Route path="/lists" element={
          <ProtectedRoute>
            <ListPage />
          </ProtectedRoute>
        } />
        <Route path='/crm' element={
          <ProtectedRoute>
            <CRMDashboard />
          </ProtectedRoute>
        } />
        <Route path="/followup" element={
          <ProtectedRoute>
            <FollowUpPage />
          </ProtectedRoute>
        } />
        <Route path="/settings/*" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path="/support" element={
          <ProtectedRoute>
            <TicketsPage />
          </ProtectedRoute>
        } />
        <Route path="/referrals" element={
          <ProtectedRoute>
            <ReferralsPage />
          </ProtectedRoute>
        } />

        {/* Admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
          <Route path="emails" element={<EmailsPage />} />
          <Route path="email-templates" element={<EmailTemplates />} />
          <Route path="conversion-tracking" element={<ConversionTrackingPage />} />
          <Route path="monitoring" element={<MonitoringPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="billing" element={<SubscriptionsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* Default redirection */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <CookieConsent />
      <LiveChat />
      <Toaster position="top-right" />
    </>
  );
}

export default App;