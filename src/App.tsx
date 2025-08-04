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
import TutorShareProfile from "./pages/TutorShareProfile";
import LoginPage from "./pages/LoginPage";
import TeacherDashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import MyRequest from "./pages/MyRequest";
import Contract from "./pages/Contract";
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
import CategoriesPage from "./pages/JobPreparation/CategoriesPage";
import SubjectsPage from "./pages/JobPreparation/SubjectsPage";
import TopicsPage from "./pages/JobPreparation/TopicsPage";
import SubtopicsPage from "./pages/JobPreparation/SubtopicsPage";
import QuestionsPage from "./pages/JobPreparation/QuestionsPage";
import ReadingModePage from "./pages/JobPreparation/ReadingModePage";
import ExamModePage from "./pages/JobPreparation/ExamModePage";
import PackageSettings from "./components/PackageSettings";
import HowItWorksPage from "./pages/HowItWorksPage";
import FAQPage from "./pages/FAQPage";
import TermsPage from "./pages/TermsPage";
import PublicDashboard from "./pages/PublicDashboard";
import JobPreparationDashboard from "./pages/JobPreparation/Dashboard";
import CreateModelTest from "./pages/JobCandidate/CreateModelTest";
import ExamPractice from "./pages/JobCandidate/ExamPractice";
import ExamPage from "./pages/ExamPage";
import ExamResultsPage from "./pages/ExamResultsPage";


import { Loader2 } from "lucide-react";


const queryClient = new QueryClient();


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
        if (!userProfile) {
          await fetchProfile();
        }
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
        navigate('/login');
      }
      
      setIsValidating(false);
    };
    
    validateToken();
  }, [location.pathname, navigate, userProfile, fetchProfile]);
  
  if (isValidating) {
    return <div className="flex justify-center items-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
    </div>
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
                  <Route path="/tutor/:uid" element={<TutorShareProfile />} />
                  <Route path="/private-profile/tutor/:id" element={
                    <AuthGuard><TutorProfile /></AuthGuard>
                  } />

                  <Route path="/how-it-works" element={<HowItWorksPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/terms" element={<TermsPage />} />

                  <Route path="/unauthorized" element={
                    <Unauthorized />
                  }/>
                  
                  
                  {/* Job Preparation routes */}
                  <Route path="/job-preparation/dashboard" element={
                    <AuthGuard>
                      <MainLayout>
                      <JobPreparationDashboard />
                      </MainLayout>
                    </AuthGuard>
                    } 
                  />
                  <Route path="/job-preparation/create-model-test" element={
                    <AuthGuard>
                      <MainLayout>
                        <CreateModelTest />
                      </MainLayout>
                    </AuthGuard>
                  } />
                  <Route path="/job-preparation/questions" element={
                    <MainLayout><CategoriesPage /></MainLayout>
                    } 
                  />
                  <Route path="/job-preparation/practice" element={
                    <MainLayout><ExamPractice /></MainLayout>
                    } 
                  />
                <Route path="/job-preparation" element={
                  <CategoriesPage />
                }
                />
                  
                  <Route path="/job-preparation/category/:categoryId" element={<SubjectsPage />} />
                  <Route path="/job-preparation/category/:categoryId/subject/:subjectId" element={<TopicsPage />} />
                  <Route path="/job-preparation/category/:categoryId/subject/:subjectId/topic/:topicId" element={<SubtopicsPage />} />
                  <Route path="/job-preparation/category/:categoryId/subject/:subjectId/topic/:topicId/subtopic/:subtopicId" element={<QuestionsPage />} />
                  <Route path="/job-preparation/category/:categoryId/subject/:subjectId/topic/:topicId/subtopic/:subtopicId/reading" element={<ReadingModePage />} />
                  <Route path="/job-preparation/category/:categoryId/subject/:subjectId/topic/:topicId/subtopic/:subtopicId/exam" element={<ExamModePage />} />


                <Route path="/job-preparation/exam/:examId" element={
                  <AuthGuard>
                    <MainLayout><ExamPage /></MainLayout>
                  </AuthGuard>
                } />

                <Route path="/job-preparation/exam/:examId/results" element={
                  <AuthGuard>
                    <MainLayout><ExamResultsPage /></MainLayout>
                  </AuthGuard>
                } />
                        
                  <Route path="/guardian/find-tutors" element={
                      <MainLayout><FindTutorsList /></MainLayout>
                  } />
                  
                  {/* Protected routes for all authenticated users */}
                  <Route path="/notifications" element={
                    <AuthGuard>
                      <MainLayout><NotificationPage /></MainLayout>
                    </AuthGuard>
                  } />

                  <Route path="teacher/profile" element={
                    <AuthGuard>
                      <MainLayout><ProfilePage /></MainLayout>
                    </AuthGuard>
                  } />
                <Route path="guardian/profile" element={
                    <AuthGuard>
                      <MainLayout><GuardianProfile /></MainLayout>
                    </AuthGuard>
                  } />
                  <Route path="/teacher/settings" element={
                    <AuthGuard>
                      <MainLayout><Settings /></MainLayout>
                    </AuthGuard>
                  } />
                  <Route path="/settings" element={
                    <AuthGuard>
                      <MainLayout><Settings /></MainLayout>
                    </AuthGuard>
                  } />
                  

                <Route path="teacher/message" element={
                  <AuthGuard>
                    <div className="flex h-screen bg-gray-50">
                      <Sidebar />
                      <MessagePage />
                    </div>
                  </AuthGuard>
                } />

                <Route path="guardian/message" element={
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
                  
                  <Route path="/dashboard/teacher" element={
                    <AuthGuard>
                      <MainLayout><TeacherDashboard /></MainLayout>
                    </AuthGuard>
                  } />
                  <Route path="/guardian/requests" element={
                    <AuthGuard>
                      <MainLayout><MyRequest /></MainLayout>
                    </AuthGuard>
                  } />
                  <Route path="/requests/:id" element={
                    <AuthGuard>
                      <MainLayout><TuitionRequestDetails /></MainLayout>
                    </AuthGuard>
                  } />

                  <Route path="/teacher/requests" element={
                    <AuthGuard>
                      <MainLayout><MyRequest /></MainLayout>
                    </AuthGuard>
                  } />
                  <Route path="teacher/requests/:id" element={
                    <AuthGuard>
                      <MainLayout><TuitionRequestDetails /></MainLayout>
                    </AuthGuard>
                  } />

                  <Route path="/package/teacher" element={
                    <AuthGuard>
                      <MainLayout><PackageSettings /></MainLayout>
                    </AuthGuard>
                  } />
                  
                  <Route path="/dashboard/guardian" element={
                    <AuthGuard>
                      <MainLayout><GuardianDashboard /></MainLayout>
                    </AuthGuard>
                  } />
                  <Route path="/find-tutors/contract/:uid" element={
                    <AuthGuard>
                      <MainLayout><Contract /></MainLayout>
                    </AuthGuard>
                  } />
                  <Route path="/dashboard" element={
                  <AuthGuard>
                    <PublicDashboard />
                    </AuthGuard>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TokenValidationWrapper>
            </BrowserRouter>
          </UserProfileProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;
