import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
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

const queryClient = new QueryClient();


// Base Protected Route Component
const ProtectedRoute = () => {
  const { userProfile, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // if (!userProfile) {
  //   return <Navigate to="/login" replace />;
  // }
  
  return <Outlet />;
};

// Role-based Protected Route Component
const RoleProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { userProfile, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // if (!userProfile) {
  //   return <Navigate to="/login" replace />;
  // }
  
  if (!allowedRoles.includes(userProfile?.user_type)) {
    console.log('userProfile', userProfile);
    // return <Navigate to="/unauthorized" replace />;
  }
  
  return <Outlet />;
};

// Main Layout Component
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen bg-gray-50">
    <Sidebar />
    {children}
  </div>
);

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
            <Route path="/tutor/:id" element={<TutorProfile />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes for all authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
              <Route path="/settings" element={<MainLayout><Settings /></MainLayout>} />
              <Route path="/message" element={<MainLayout><MessagePage /></MainLayout>} />
            </Route>
            
            {/* Teacher-only routes */}
            <Route element={<RoleProtectedRoute allowedRoles={['TEACHER']} />}>
              <Route path="/teacher/dashboard" element={<MainLayout><TeacherDashboard /></MainLayout>} />
              <Route path="/teacher/requests" element={<MainLayout><MyRequest /></MainLayout>} />
              <Route path="/teacher/request-details/:id" element={<MainLayout><TuitionRequestDetails /></MainLayout>} />
            </Route>
            
            {/* Guardian-only routes */}
            <Route element={<RoleProtectedRoute allowedRoles={['GUARDIAN']} />}>
              <Route path="/guardian/dashboard" element={<MainLayout><GuardianDashboard /></MainLayout>} />
              <Route path="/guardian/requests" element={<MainLayout><MyRequest /></MainLayout>} />
              <Route path="/guardian/request-details/:id" element={<MainLayout><TuitionRequestDetails /></MainLayout>} />
            </Route>
            
            {/* Redirect legacy routes to role-specific routes */}
            <Route path="/dashboard" element={<RoleRedirect />} />
            <Route path="/all-requests" element={<RoleRedirect pathSuffix="/requests" />} />
            <Route path="/request-details/:id" element={<RoleRedirect pathSuffix="/request-details" preserveParams={true} />} />
          
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </AuthProvider>
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
  
  // if (!userProfile) {
  //   return <Navigate to="/login" replace />;
  // }
  
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
  } else {
    console.log('userProfile', userProfile);
  }
};

export default App;