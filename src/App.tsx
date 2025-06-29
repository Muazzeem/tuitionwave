import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
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
import { UserProfileProvider } from '@/contexts/UserProfileContext';
import AuthGuard from "./components/AuthGuard";
import AuthService from "./services/AuthService";
import FindTutorsList from "./components/FindTutors/FindTutors";
import NotificationPage from "./pages/Notification";
import RegistrationPage from "./pages/RegistrationPage";
import GuardianProfile from "./pages/Guardian/Profile";
import FAQPage from "./pages/FAQPage";
import TermsPage from "./pages/TermsPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import JobPreparationPage from "./pages/JobPreparationPage";
import Contract from "./pages/Contract";

const queryClient = new QueryClient();


console.log('API URL:', import.meta.env.VITE_API_URL);

// Component to handle token validation and auto-redirect
const TokenValidationWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const { userProfile, fetchProfile } = useAuth();
  
  useEffect(() => {
    const validateToken = async () => {
      setIsValidating(true);
      const isValid = await AuthService.ensureValidToken();
      
      if (isValid) {
        // If token is valid but we don't have user profile, fetch it
        if (!userProfile) {
          await fetchProfile();
        }
        
        // If we're on login or home page and already logged in, redirect to appropriate dashboard
        // if (["/", "/login"].includes(location.pathname)) {
        //   if (userProfile?.user_type === 'TEACHER') {
        //     navigate('/teacher/dashboard');
        //   } else if (userProfile?.user_type === 'GUARDIAN') {
        //     navigate('/guardian/dashboard');
        //   }
        // }
      } else if (
        !location.pathname.startsWith("/auth") && 
        location.pathname !== "/" && 
        location.pathname !== "/login" &&
        location.pathname !== "/faq" &&
        location.pathname !== "/terms" &&
        location.pathname !== "/how-it-works" &&
        location.pathname !== "/job-preparation" &&
        !location.pathname.startsWith("/tutor/")
      ) {
        // If token is invalid and not on a public page, redirect to login
        navigate('/login');
      }
      
      setIsValidating(false);
    };
    
    validateToken();
  }, [location.pathname, navigate, userProfile, fetchProfile]);
  
  if (isValidating) {
    return <div className="flex justify-center items-center h-screen">Validating session...</div>;
  }
  
  return <>{children}</>;
};

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
  // if (userProfile?.user_type === 'TEACHER') {
  //   return <Navigate to={`/teacher${pathSuffix}${params}`} replace />;
  // } else if (userProfile?.user_type === 'GUARDIAN') {
  //   return <Navigate to={`/guardian${pathSuffix}${params}`} replace />;
  // }
  
  // Fallback for unknown user types
  return <Navigate to="/unauthorized" replace />;
};

const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <UserProfileProvider>
            <BrowserRouter>
              <TokenValidationWrapper>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/auth/registration" element={<RegistrationPage />} />
                  <Route path="/private-profile/tutor/:id" element={
                    <AuthGuard><TutorProfile /></AuthGuard>
                  } />
                  <Route path="/find-tutors/contract/:uid" element={
                    <AuthGuard>
                      <MainLayout><Contract /></MainLayout></AuthGuard>
                  } />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/job-preparation" element={<JobPreparationPage />} />
                  <Route path="/job-preparation/category/:categoryId" element={<JobPreparationPage />} />
                  <Route path="/job-preparation/category/:categoryId/subject/:subjectId" element={<JobPreparationPage />} />
                  <Route path="/job-preparation/category/:categoryId/subject/:subjectId/topic/:topicId" element={<JobPreparationPage />} />
                  
                  <Route path="/find-tutors" element={
                      <MainLayout><FindTutorsList /></MainLayout>
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
                  <Route path="/teacher/requests/:id" element={
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
                  <Route path="/guardian/requests/:id" element={
                    <AuthGuard allowedRoles={['GUARDIAN']}>
                      <MainLayout><TuitionRequestDetails /></MainLayout>
                    </AuthGuard>
                  } />
                  
                  {/* Redirect legacy routes to role-specific routes */}
                  <Route path="/dashboard" element={<RoleRedirect />} />
                  <Route path="/all-requests" element={<RoleRedirect pathSuffix="/requests" />} />
                  <Route path="/requests/:id" element={<RoleRedirect pathSuffix="/requests" preserveParams={true} />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TokenValidationWrapper>
            </BrowserRouter>
          </UserProfileProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
);

console.log('API_URL:', import.meta.env.VITE_API_URL);
export default App;
