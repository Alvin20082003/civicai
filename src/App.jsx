import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
// Add page imports here
import Landing from '@/pages/Landing';
import AppLayout from '@/components/AppLayout';
import Dashboard from '@/pages/Dashboard';
import AIChat from '@/pages/AIChat';
import Schemes from '@/pages/Schemes';
import Family from '@/pages/Family';
import LifeEvents from '@/pages/LifeEvents';
import RuleEngine from '@/pages/RuleEngine';
import Governance from '@/pages/Governance';
import DecisionLog from '@/pages/DecisionLog';
import Consent from '@/pages/Consent';
import ExplainableAI from '@/pages/ExplainableAI';
import Risk from '@/pages/Risk';
import PolicyIntelligence from '@/pages/PolicyIntelligence';
import Predictive from '@/pages/Predictive';
import Architecture from '@/pages/Architecture';
import Documents from '@/pages/Documents';
import MapServices from '@/pages/MapServices';
import Proactive from '@/pages/Proactive';

const AuthenticatedApp = () => {
  const location = useLocation();
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Public routes are accessible without authentication
  if (location.pathname === '/') {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    );
  }

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      {/* Authenticated app with sidebar layout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<AIChat />} />
        <Route path="/schemes" element={<Schemes />} />
        <Route path="/family" element={<Family />} />
        <Route path="/life-events" element={<LifeEvents />} />
        <Route path="/rule-engine" element={<RuleEngine />} />
        <Route path="/governance" element={<Governance />} />
        <Route path="/decision-log" element={<DecisionLog />} />
        <Route path="/consent" element={<Consent />} />
        <Route path="/explainable-ai" element={<ExplainableAI />} />
        <Route path="/risk" element={<Risk />} />
        <Route path="/policy-intelligence" element={<PolicyIntelligence />} />
        <Route path="/predictive" element={<Predictive />} />
        <Route path="/architecture" element={<Architecture />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/map-services" element={<MapServices />} />
        <Route path="/proactive" element={<Proactive />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App