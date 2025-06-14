
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileCompletionProvider } from "@/components/ProfileCompletionContext";
import AuthGuard from "@/components/AuthGuard";
import Sidebar from "@/components/Sidebar";

// Pages
import Index from "@/pages/Index";
import LoginPage from "@/pages/LoginPage";
import RegistrationPage from "@/pages/RegistrationPage";
import Dashboard from "@/pages/Dashboard";
import ProfilePage from "@/pages/ProfilePage";
import Settings from "@/pages/Settings";
import MessagePage from "@/pages/MessagePage";
import MyRequest from "@/pages/MyRequest";
import TuitionRequestDetails from "@/pages/TuitionRequestDetails";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";
import Notification from "@/pages/Notification";
import TutorProfile from "@/pages/TutorProfile";
import GuardianDashboard from "@/pages/Guardian/Dashboard";
import GuardianProfile from "@/pages/Guardian/Profile";
import HomePage from "@/pages/HomePage";
import HowItWorksPage from "@/pages/HowItWorksPage";
import JobPreparationPage from "@/pages/JobPreparationPage";
import FAQPage from "@/pages/FAQPage";
import TermsPage from "@/pages/TermsPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Router>
          <AuthProvider>
            <ProfileCompletionProvider>
              <div className="min-h-screen bg-background">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/job-preparation" element={<JobPreparationPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegistrationPage />} />
                  <Route path="/tutor/:id" element={<TutorProfile />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  
                  {/* Protected routes */}
                  <Route path="/dashboard" element={
                    <AuthGuard>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <Dashboard />
                      </div>
                    </AuthGuard>
                  } />
                  
                  <Route path="/profile" element={
                    <AuthGuard>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <ProfilePage />
                      </div>
                    </AuthGuard>
                  } />
                  
                  <Route path="/settings" element={
                    <AuthGuard>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <Settings />
                      </div>
                    </AuthGuard>
                  } />
                  
                  {/* Updated message routes to support URL parameters */}
                  <Route path="/message" element={
                    <AuthGuard>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <MessagePage />
                      </div>
                    </AuthGuard>
                  } />
                  
                  <Route path="/message/:userId" element={
                    <AuthGuard>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <MessagePage />
                      </div>
                    </AuthGuard>
                  } />
                  
                  <Route path="/my-request" element={
                    <AuthGuard>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <MyRequest />
                      </div>
                    </AuthGuard>
                  } />
                  
                  <Route path="/my-request/:id" element={
                    <AuthGuard>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <TuitionRequestDetails />
                      </div>
                    </AuthGuard>
                  } />
                  
                  <Route path="/notification" element={
                    <AuthGuard>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <Notification />
                      </div>
                    </AuthGuard>
                  } />
                  
                  <Route path="/guardian/dashboard" element={
                    <AuthGuard>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <GuardianDashboard />
                      </div>
                    </AuthGuard>
                  } />
                  
                  <Route path="/guardian/profile" element={
                    <AuthGuard>
                      <div className="flex h-screen bg-gray-50">
                        <Sidebar />
                        <GuardianProfile />
                      </div>
                    </AuthGuard>
                  } />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Toaster />
            </ProfileCompletionProvider>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
