import React from "react";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import ScrollToTop from "./components/ScrollToTop";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Explore from "./pages/Explore";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import EmailVerification from "./pages/EmailVerification";
import EmailVerifyCallback from "./pages/EmailVerifyCallback";
import SuccessStories from "./pages/SuccessStories";
import ProjectDetail from "./pages/ProjectDetail";
import ForgotPassword from "./pages/ForgotPassword";
import PaymentPage from "./pages/PaymentPage";
import AdminDashboard from "./pages/AdminDashboard";
import CreatorDashboard from "./pages/CreatorDashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import CreateCampaign from "./pages/CreateCampaign";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Wallet from "./pages/Wallet";
import Support from "./pages/Support";
import Blog from "./pages/Blog";
import FundraisingGuides from "./pages/FundraisingGuides";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { ResetPassword, ResetPasswordSuccess } from "./pages/ResetPassword";
import ChallengeDetail from "./pages/ChallengeDetail";

// Routes
import PrivateRoute from "./routes/PrivateRoute";
import { useAuthStore } from "./hooks/useAuthStore";

// Public-only route
const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuthStore();
  return isLoggedIn ? <Navigate to="/" /> : <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/emailverifycallback" element={<EmailVerifyCallback />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password/success" element={<ResetPasswordSuccess />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/challenge/:id" element={<ChallengeDetail />} />
            <Route path="/support" element={<Support />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/guides" element={<FundraisingGuides />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />

            {/* Protected routes */}
            <Route path="/payment/:id" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
            <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
            <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
            <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
            <Route path="/creator-dashboard/*" element={<PrivateRoute ><CreatorDashboard /></PrivateRoute>} />
            <Route path="/moderator-dashboard/*" element={<ModeratorDashboard />} />
            <Route path="/create-campaign" element={<PrivateRoute ><CreateCampaign /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
