
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import TutorProfile from "./pages/TutorProfile";
import LoginPage from "./pages/LoginPage";
import TeacherDashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import MyRequest from "./pages/MyRequest";
import Settings from "./pages/Settings";
import ProfilePage from "./pages/ProfilePage";
import MessagePage from "./pages/MessagePage";
import TuitionRequestDetails from "./pages/TuitionRequestDetails";
import GuardianDashboard from "./pages/Guardian/Dashboard";
import Unauthorized from "./pages/Unauthorized";
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from "./components/AuthGuard";
import FindTutorsList from "./components/FindTutors/FindTutors";
import NotificationPage from "./pages/Notification";
import RegistrationPage from "./pages/RegistrationPage";
import GuardianProfile from "./pages/Guardian/Profile";
import FAQPage from "./pages/FAQPage";
import TermsPage from "./pages/TermsPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import JobPreparationPage from "./pages/JobPreparationPage";

const queryClient = new QueryClient();

// Main Layout Component
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    {children}
  </div>
);

// Component to redirect users to role-specific routes
const RoleRedirect = ({ 
  pathSuffix = "", 
  preserveParams = false 
}: { 
  pathSuffix?: string,
  preserveParams?: boolean 
}) => {
  const { userProfile } = useAuth();
  const location = window.location;
  
  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }
  
  // Extract URL parameters if needed
  let params = "";
  if (preserveParams) {
    params = location.pathname.split('/').pop() || "";
    if (params) params = `/${params}`;
  }
  
  // Redirect based on user role
  if (userProfile?.user_type === 'TEACHER') {
    return <Navigate to={`/teacher${pathSuffix}${params}`} replace />;
  } else if (userProfile?.user_type === 'GUARDIAN') {
    return <Navigate to={`/guardian${pathSuffix}${params}`} replace />;
  }
  
  // Fallback for unknown user types
  return <Navigate to="/unauthorized" replace />;
};

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/registration" element={<RegistrationPage />} />
            <Route path="/tutor/:id" element={<TutorProfile />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/job-preparation" element={<JobPreparationPage />} />
            <Route path="/find-tutors" element={
              <AuthGuard>
                <MainLayout><FindTutorsList /></MainLayout>
              </AuthGuard>
            } />
            
            {/* Protected routes for all authenticated users */}
            <Route path="/notifications" element={
              <AuthGuard>
                <MainLayout><NotificationPage /></MainLayout>
              </AuthGuard>
            } />

            <Route path="profile/teacher" element={
              <AuthGuard allowedRoles={['TEACHER']}>
                <MainLayout><ProfilePage /></MainLayout>
              </AuthGuard>
            } />
            <Route path="profile/guardian" element={
              <AuthGuard allowedRoles={['GUARDIAN']}>
                <MainLayout><GuardianProfile /></MainLayout>
              </AuthGuard>
            } />
            <Route path="/settings" element={
              <AuthGuard>
                <MainLayout><Settings /></MainLayout>
              </AuthGuard>
            } />
            <Route path="/message" element={
              <AuthGuard>
                <MessagePage />
              </AuthGuard>
            } />
            
            {/* Teacher-only routes */}
            <Route path="/teacher/dashboard" element={
              <AuthGuard allowedRoles={['TEACHER']}>
                <MainLayout><TeacherDashboard /></MainLayout>
              </AuthGuard>
            } />
            <Route path="/teacher/requests" element={
              <AuthGuard allowedRoles={['TEACHER']}>
                <MainLayout><MyRequest /></MainLayout>
              </AuthGuard>
            } />
            <Route path="/teacher/request-details/:id" element={
              <AuthGuard allowedRoles={['TEACHER']}>
                <MainLayout><TuitionRequestDetails /></MainLayout>
              </AuthGuard>
            } />
            
            {/* Guardian-only routes */}
            <Route path="/guardian/dashboard" element={
              <AuthGuard allowedRoles={['GUARDIAN']}>
                <MainLayout><GuardianDashboard /></MainLayout>
              </AuthGuard>
            } />
            <Route path="/guardian/requests" element={
              <AuthGuard allowedRoles={['GUARDIAN']}>
                <MainLayout><MyRequest /></MainLayout>
              </AuthGuard>
            } />
            <Route path="/guardian/request-details/:id" element={
              <AuthGuard allowedRoles={['GUARDIAN']}>
                <MainLayout><TuitionRequestDetails /></MainLayout>
              </AuthGuard>
            } />
            
            {/* Redirect legacy routes to role-specific routes */}
            <Route path="/dashboard" element={<RoleRedirect />} />
            <Route path="/all-requests" element={<RoleRedirect pathSuffix="/requests" />} />
            <Route path="/request-details/:id" element={<RoleRedirect pathSuffix="/request-details" preserveParams={true} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;
