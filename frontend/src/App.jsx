import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Explore from "./pages/Explore";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import EmailVerification from "./pages/EmailVerification";
import SuccessStories from "./pages/SuccessStories";
import ProjectDetail from "./pages/ProjectDetail";
import ForgotPassword from "./pages/ForgotPassword";
import PaymentPage from "./pages/PaymentPage";
import AdminDashboard from "./pages/AdminDashboard";
import CreatorDashboard from "./pages/CreatorDashboard";
import CreateCampaign from "./pages/CreateCampaign";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import Wallet from "./pages/Wallet";
import ScrollToTop from "./components/ScrollToTop";

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  useEffect(() => {
    // Check auth status (could be expanded to verify token validity)
    const authStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  if (isAuthenticated === null) {
    return <LoadingSpinner />; // Show loading state while checking auth
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?from=${encodeURIComponent(window.location.pathname)}`} replace />;
  }

  return children;
  
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
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/email-verification" element={<EmailVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            {/* Protected routes */}
            <Route path="/payment/:id" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
            <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
            <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
            <Route path="/admin-dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            <Route path="/creator-dashboard" element={<PrivateRoute><CreatorDashboard /></PrivateRoute>} />
            <Route path="/create-campaign" element={<PrivateRoute><CreateCampaign /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;