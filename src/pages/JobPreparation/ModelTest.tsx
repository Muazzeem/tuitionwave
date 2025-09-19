import { useState, useEffect, useMemo } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, PlayCircle, CheckCircle, Eye, Timer, BookOpen, Trophy, AlertCircle } from "lucide-react";
import { getAccessToken } from "@/utils/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import TutorPagination from "@/components/FindTutors/TutorPagination";
import { useAuth } from "@/contexts/AuthContext";
import ModelTestCard from "@/components/JobPreparation/ModelTestCard";


// Custom hook for countdown timer
const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return {
          days,
          hours,
          minutes,
          seconds,
          total: difference,
          expired: false
        };
      } else {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
          expired: true
        };
      }
    };

    // Calculate initial time
    setTimeLeft(calculateTimeLeft());

    // Set up interval to update every second
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Clear interval if expired
      if (newTimeLeft.expired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

// Countdown Display Component
const CountdownDisplay = ({ targetDate, className = "", hideForExpired = false, examStatus = "running" }) => {
  const timeLeft = useCountdown(targetDate);

  if (!timeLeft || !targetDate) {
    return null;
  }

  // Hide countdown for expired tests if hideForExpired is true
  if (hideForExpired && (timeLeft.expired || examStatus === "expired")) {
    return null;
  }

  const formatTimeUnit = (value, unit) => {
    return `${value}${unit.charAt(0)}`;
  };

  const getUrgencyStyle = () => {
    if (timeLeft.expired) {
      return "text-red-600 bg-red-50 bg-red-900/20 border-red-200 border-red-800";
    } else if (timeLeft.total < 2 * 60 * 60 * 1000) { // Less than 2 hours
      return "text-orange-600 bg-orange-50 bg-orange-900/20 border-orange-200 border-orange-800";
    } else if (timeLeft.total < 24 * 60 * 60 * 1000) { // Less than 24 hours
      return "text-green-600 bg-green-50 bg-green-900/20 border-green-200 border-green-800";
    } else {
      return "text-green-600 bg-green-50 bg-green-900/20 border-green-200 border-green-800";
    }
  };

  const getIcon = () => {
    if (timeLeft.expired) {
      return <AlertCircle className="w-3 h-3 mr-1" />;
    } else if (timeLeft.total < 24 * 60 * 60 * 1000) {
      return <Clock className="w-3 h-3 mr-1" />;
    } else {
      return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  if (timeLeft.expired) {
    return (
      <Badge className={`${getUrgencyStyle()} border text-xs font-medium ${className}`}>
        {getIcon()}
        Expired
      </Badge>
    );
  }

  return (
    <Badge className={`${getUrgencyStyle()} border text-xs font-medium ${className}`}>
      {getIcon()}
      {timeLeft.days > 0 && formatTimeUnit(timeLeft.days, "day")}
      {(timeLeft.days > 0 || timeLeft.hours > 0) && formatTimeUnit(timeLeft.hours, "hour")}
      {formatTimeUnit(timeLeft.minutes, "min")}
      {timeLeft.days === 0 && timeLeft.hours === 0 && formatTimeUnit(timeLeft.seconds, "sec")}
    </Badge>
  );
};

export default function CreateModelTest() {
  const { userProfile } = useAuth();
  const [examData, setExamData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "running";
  const [selectedTab, setSelectedTab] = useState(tabFromUrl);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingExams, setProcessingExams] = useState<Set<string>>(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    document.title = "Tuition Wave | Model Tests";
  }, []);

  const tabs = [
    {
      id: "running",
      label: "Live Now",
      param: "today=true",
      icon: PlayCircle,
      color: "text-green-500",
      bgColor: "bg-green-50 bg-green-900/20",
      borderColor: "border-green-200 border-green-800"
    },
    {
      id: "upcoming",
      label: "Upcoming",
      param: "upcoming=true",
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-50 bg-blue-900/20",
      borderColor: "border-blue-200 border-blue-800"
    },
    {
      id: "expired",
      label: "Past Exams",
      param: "past=true",
      icon: CheckCircle,
      color: "text-red-500",
      bgColor: "bg-red-50 bg-red-900/20",
      borderColor: "border-red-200 border-red-800"
    }
  ];

  useEffect(() => {
    setSearchParams({ tab: selectedTab });
  }, [selectedTab]);

  useEffect(() => {
    const currentTab = searchParams.get("tab") || "running";
    if (currentTab !== selectedTab) {
      setSelectedTab(currentTab);
    }
  }, [searchParams]);


  const fetchModelTests = async () => {
    const accessToken = getAccessToken();
    try {
      setLoading(true);

      const currentTab = tabs.find(tab => tab.id === selectedTab);
      const apiParam = currentTab?.param || "today=true";

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/model-tests?${apiParam}&page=${currentPage}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Set total pages if your backend returns pagination metadata
      setTotalPages(data.total_pages || 1);

      const transformedData = data.results.map((test) => ({
        uid: test.uid,
        title: test.name,
        description: test.description || "No description available",
        duration: `${test.duration_minutes} min`,
        participants: "0 participants",
        category: test.category.category_name,
        status: selectedTab,
        totalQuestions: test.total_questions,
        configurations: test.configurations,
        user_exam: test.user_exam || null,
        is_active: test.is_active !== false,
        passing_marks: test.passing_mark,
        scheduled_date: test.scheduled_date
          ? new Date(test.scheduled_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
          })
          : null,
        expired_date: test.expired_date || null,
        expired_date_formatted: test.expired_date
          ? new Date(test.expired_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
          })
          : null
      }));

      setExamData(transformedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching model tests:', err);
      setError('Failed to load model tests. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModelTests();
  }, [selectedTab, currentPage]);

  const hasStudentExamAccess = useMemo(() => {
    const pkgs = userProfile?.packages;
    if (!Array.isArray(pkgs) || pkgs.length === 0) return false;

    return pkgs.some((p) => {
      const status = p?.status?.toUpperCase?.();
      const role = p?.role_applied?.toUpperCase?.();
      const target = p?.package?.target?.toUpperCase?.();
      const isActive = status === 'ACTIVE';
      const matchesRole = role === 'STUDENT' || role === 'BOTH';
      const matchesTarget = target === 'STUDENT' || target === 'BOTH';
      return isActive && (matchesRole || matchesTarget);
    });
  }, [userProfile?.packages]);

  const filteredExams = examData;

  if (error) {
    return (
      <div className="flex-1 overflow-auto bg-gray-900">
        <DashboardHeader userName="John" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center p-8 bg-red-50 bg-red-900/20 rounded-lg border border-red-200 border-red-800 max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 text-red-300 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 text-red-400 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleStartExam = async (modelTest) => {
    const accessToken = getAccessToken();
    const examId = modelTest.uid;

    // Prevent multiple clicks
    if (processingExams.has(examId)) {
      return;
    }

    setProcessingExams(prev => new Set(prev).add(examId));

    try {
      // Case 2: User has an exam in progress
      if (modelTest.user_exam && modelTest.user_exam.status === 'in_progress') {
        navigate(`/job-preparation/model-test/exam/${modelTest.user_exam.uid}`);
        return;
      }

      // Case 3: User has completed the exam
      if (modelTest.user_exam && modelTest.user_exam.status === 'completed') {
        navigate(`/job-preparation/exam/${modelTest.user_exam.uid}/results`);
        return;
      }

      // Case 4: No user exam exists, need to generate one
      if (!modelTest.user_exam) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/model-tests/${modelTest.uid}/create-exam/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to generate exam: ${response.status}`);
        }

        const data = await response.json();

        toast({
          title: "Exam Generated!",
          description: "Your exam has been created. Starting now...",
          duration: 2000,
        });

        navigate(`/job-preparation/model-test/exam/${data.uid}`);

        setExamData(prevData =>
          prevData.map(exam =>
            exam.uid === modelTest.uid
              ? {
                ...exam,
                user_exam: {
                  uid: data.uid,
                  status: 'not_started',
                  percentage: 0,
                  status_display: 'Not Started'
                }
              }
              : exam
          )
        );
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to process exam. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingExams(prev => {
        const newSet = new Set(prev);
        newSet.delete(examId);
        return newSet;
      });
    }
  };

  const getStatusInfo = (exam) => {
    const isProcessing = processingExams.has(exam.uid);

    if (isProcessing) {
      return {
        icon: Clock,
        label: 'Processing...',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 bg-orange-900/20',
        borderColor: 'border-orange-200 border-orange-800',
        action: 'Processing...',
        disabled: true,
        buttonClass: 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
      };
    }

    // Check if exam is upcoming (disable button)
    if (exam.status === 'upcoming') {
      return {
        icon: Clock,
        label: 'Coming Soon',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 bg-blue-900/20',
        borderColor: 'border-blue-200 border-blue-800',
        action: 'Coming Soon',
        disabled: true,
        buttonClass: 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed text-gray-600'
      };
    }

    // Check if exam is expired (change button color)

    if (exam.status === 'expired') {
      if (exam.user_exam) {
        return {
          icon: CheckCircle,
          label: 'Expired',
          color: 'text-gray-white',
          bgColor: 'bg-red-50',
          borderColor: 'border-gray-200 border-gray-800',
          action: 'View Result',
          disabled: false,
          buttonClass: 'bg-red-800/80 text-white'
        };
      }

      return {
        icon: CheckCircle,
        label: 'Expired',
        color: 'text-gray-white',
        bgColor: 'bg-red-50',
        borderColor: 'border-gray-200 border-gray-800',
        action: 'Start Exam',
        disabled: false,
        buttonClass: 'bg-red-800/80 text-white'
      };
    }


    if (exam.user_exam) {
      const status = exam.user_exam.status;
      switch (status) {
        case 'completed':
          return {
            icon: CheckCircle,
            label: 'Completed',
            color: 'text-green-600',
            bgColor: 'bg-green-50 bg-green-900/20',
            borderColor: 'border-green-200 border-green-800',
            action: 'View Results',
            disabled: false,
            buttonClass: 'bg-gradient-to-r from-blue-500 to-primary-500 hover:from-blue-600 hover:to-primary-700 text-white'
          };
        case 'in_progress':
          return {
            icon: PlayCircle,
            label: 'In Progress',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 bg-blue-900/20',
            borderColor: 'border-blue-200 border-blue-800',
            action: 'Continue Exam',
            disabled: false,
            buttonClass: 'bg-gradient-to-r from-blue-500 to-primary-500 hover:from-blue-600 hover:to-primary-700 text-white'
          };
      }
    }

    // No user exam exists
    return {
      icon: PlayCircle,
      label: 'Available',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 bg-blue-900/20',
      borderColor: 'border-blue-200 border-blue-800',
      action: 'Continue Exam',
      disabled: false,
      buttonClass: 'bg-gradient-to-r from-blue-500 to-primary-500 hover:from-blue-600 hover:to-primary-700 text-white'
    };
  };

  const currentTabInfo = tabs.find(tab => tab.id === selectedTab);

  return (
    <div className="flex-1 overflow-auto bg-gray-900 min-h-screen">
      <DashboardHeader userName="John" />
      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-4 md:p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-2 hidden md:block">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-foreground text-white">Model Tests</h1>
                <p className="text-muted-foreground hidden md:block">Practice with real exam simulations and track your progress</p>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 p-1 bg-gray-100 bg-gray-800 rounded-xl w-fit">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = selectedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center md:mb-1 md:mt-1 p-1 md:p-3 gap-2 rounded-lg text-sm font-medium transition-all ${isActive
                      ? `${tab.bgColor} ${tab.color} shadow-sm border ${tab.borderColor}`
                      : "text-muted-foreground hover:text-foreground hover:bg-white/50 hover:bg-gray-700"
                      }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? tab.color : ''}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Exams Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredExams.map((exam) => (
                <ModelTestCard
                  key={exam.uid}
                  exam={exam}
                  onStartExam={handleStartExam}
                  getStatusInfo={getStatusInfo}
                  processingExams={processingExams}
                />
              ))}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <Card key={index} className="border-slate-800 bg-slate-900/50 backdrop-blur-sm animate-pulse">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-center">
                      <div className="rounded-xl bg-slate-700/60 px-4 py-3 text-center min-w-[120px] h-16"></div>
                    </div>
                    <div className="h-6 bg-slate-700/60 rounded mb-2"></div>
                    <div className="h-4 bg-slate-700/60 rounded mb-4"></div>
                    <div className="flex justify-center gap-2 mb-4">
                      <div className="h-6 w-16 bg-slate-700/60 rounded"></div>
                      <div className="h-6 w-12 bg-slate-700/60 rounded"></div>
                    </div>
                    <div className="flex justify-center gap-4 mb-6">
                      <div className="h-4 w-12 bg-slate-700/60 rounded"></div>
                      <div className="h-4 w-16 bg-slate-700/60 rounded"></div>
                      <div className="h-4 w-14 bg-slate-700/60 rounded"></div>
                    </div>
                    <div className="h-10 bg-slate-700/60 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <TutorPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </div>
        <div className="h-20 md:h-8"></div>
      </ScrollArea>
    </div>
  );
}