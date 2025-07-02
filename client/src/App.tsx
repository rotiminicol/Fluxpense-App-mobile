import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./hooks/use-auth";
import Onboarding from "./pages/onboarding";

// Pages
import Dashboard from "./pages/dashboard";
import Expenses from "./pages/expenses";
import Reports from "./pages/reports";
import Profile from "./pages/profile";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import ForgotPassword from "./pages/auth/forgot-password";
import Splash from "./pages/splash";
import Welcome from "./pages/welcome";
import NotFound from "./pages/not-found";
import Settings from "./pages/settings";
import ProfilePersonalInfo from "./pages/profile-personal-info";
import ProfileBudgetSettings from "./pages/profile-budget-settings";
import ProfileOCRSettings from "./pages/profile-ocr-settings";
import ProfileNotifications from "./pages/profile-notifications";
import ProfileHelp from "./pages/profile-help";

// Loading component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-app-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <i className="fas fa-receipt text-white text-2xl"></i>
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}

// Public route wrapper (redirect to dashboard if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Splash} />
      
      <Route path="/welcome">
        <PublicRoute>
          <Welcome />
        </PublicRoute>
      </Route>
      
      <Route path="/login">
        <PublicRoute>
          <Login />
        </PublicRoute>
      </Route>
      
      <Route path="/signup">
        <PublicRoute>
          <Signup />
        </PublicRoute>
      </Route>

      <Route path="/forgot-password">
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      </Route>

      {/* Protected routes */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>

      <Route path="/expenses">
        <ProtectedRoute>
          <Expenses />
        </ProtectedRoute>
      </Route>

      <Route path="/reports">
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      </Route>

      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>

      <Route path="/settings">
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Route>

      <Route path="/profile/personal-info">
        <ProtectedRoute>
          <ProfilePersonalInfo />
        </ProtectedRoute>
      </Route>

      <Route path="/profile/budget-settings">
        <ProtectedRoute>
          <ProfileBudgetSettings />
        </ProtectedRoute>
      </Route>

      <Route path="/profile/ocr-settings">
        <ProtectedRoute>
          <ProfileOCRSettings />
        </ProtectedRoute>
      </Route>

      <Route path="/profile/notifications">
        <ProtectedRoute>
          <ProfileNotifications />
        </ProtectedRoute>
      </Route>

      <Route path="/profile/help">
        <ProtectedRoute>
          <ProfileHelp />
        </ProtectedRoute>
      </Route>

      <Route path="/onboarding">
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="font-sans text-foreground min-h-screen" style={{ backgroundColor: 'var(--app-background)' }}>
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
