// src/App.tsx - Secure Authentication Flow
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AuthWrapper } from "./components/auth/AuthWrapper";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Shield, Database, Clock, CheckCircle } from "lucide-react";

const queryClient = new QueryClient();

// Enhanced Protected Route Component with Security
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Show professional loading screen during authentication check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}>
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 text-center max-w-md w-full mx-4">
          {/* Logo/Branding */}
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>

          {/* Loading Animation */}
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-purple-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-purple-600 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Loading Text */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            AgenticAccounting
          </h2>
          <p className="text-gray-600 mb-6 font-medium">
            Initializing secure financial platform...
          </p>

          {/* Security Features */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Database className="w-4 h-4" />
              <span>Verifying data integrity</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Shield className="w-4 h-4" />
              <span>Validating security credentials</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Loading your workspace</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mt-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Establishing secure connection...</p>
          </div>
        </div>
      </div>
    );
  }

  // If not authenticated after loading, show authentication
  if (!isAuthenticated) {
    return <AuthWrapper />;
  }

  // Additional security check - ensure user object exists
  if (!user) {
    console.error('[ProtectedRoute] Authentication state inconsistent - user missing');
    return <AuthWrapper />;
  }

  // Successfully authenticated - show app
  return <>{children}</>;
};

// App Content with Routing
const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

// Root App Component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;