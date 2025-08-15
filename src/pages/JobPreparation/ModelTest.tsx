import { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, PlayCircle, CheckCircle, Eye, Timer, BookOpen, Trophy, AlertCircle, AlertTriangle } from "lucide-react";
import { getAccessToken } from "@/utils/auth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

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
const CountdownDisplay = ({ targetDate, className = "" }) => {
  const timeLeft = useCountdown(targetDate);

  if (!timeLeft || !targetDate) {
    return null;
  }

  const formatTimeUnit = (value, unit) => {
    return `${value}${unit.charAt(0)}`;
  };

  const getUrgencyStyle = () => {
    if (timeLeft.expired) {
      return "text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
    } else if (timeLeft.total < 2 * 60 * 60 * 1000) { // Less than 2 hours
      return "text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800";
    } else if (timeLeft.total < 24 * 60 * 60 * 1000) { // Less than 24 hours
      return "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    } else {
      return "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
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
  const [examData, setExamData] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab") || "running";
  const [selectedTab, setSelectedTab] = useState(tabFromUrl);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingExams, setProcessingExams] = useState(new Set());
  const navigate = useNavigate();
  const { toast } = useToast();

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
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      id: "upcoming",
      label: "Coming Soon",
      param: "upcoming=true",
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      id: "expired",
      label: "Past Exams",
      param: "past=true",
      icon: CheckCircle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      borderColor: "border-red-200 dark:border-red-800"
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

  useEffect(() => {
    const accessToken = getAccessToken();

    const fetchModelTests = async () => {
      try {
        setLoading(true);

        const currentTab = tabs.find(tab => tab.id === selectedTab);
        const apiParam = currentTab?.param || "today=true";

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/model-tests?${apiParam}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const transformedData = data.results.map((test) => {
          return {
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
            expired_date: test.expired_date || null, // Keep as ISO string for countdown
            expired_date_formatted: test.expired_date
              ? new Date(test.expired_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric"
              })
              : null
          };
        });
        setExamData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching model tests:', err);
        setError('Failed to load model tests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchModelTests();
  }, [selectedTab]);

  const filteredExams = examData;

  if (error) {
    return (
      <div className="flex-1 overflow-auto dark:bg-gray-900">
        <DashboardHeader userName="John" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 max-w-md">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
              Oops! Something went wrong
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
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
          `${import.meta.env.VITE_API_URL}/api/v1/model-tests/${modelTest.uid}/create-exam/`,
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
      console.error("Error handling exam:", err);
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
        bgColor: 'bg-orange-50 dark:bg-orange-900/20',
        borderColor: 'border-orange-200 dark:border-orange-800',
        action: 'Processing...',
        disabled: true
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
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-200 dark:border-green-800',
            action: 'View Results',
            disabled: false
          };
        case 'in_progress':
          return {
            icon: PlayCircle,
            label: 'In Progress',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
            action: 'Continue Exam',
            disabled: false
          };
      }
    }

    // No user exam exists
    return {
      icon: PlayCircle,
      label: 'Available',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      action: 'Continue Exam',
      disabled: false
    };
  };

  const currentTabInfo = tabs.find(tab => tab.id === selectedTab);

  return (
    <div className="flex-1 overflow-auto dark:bg-gray-900">
      <DashboardHeader userName="John" />
      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-4 md:p-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Model Tests</h1>
                <p className="text-muted-foreground">Practice with real exam simulations and track your progress</p>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = selectedTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                      ? `${tab.bgColor} ${tab.color} shadow-sm border ${tab.borderColor}`
                      : "text-muted-foreground hover:text-foreground hover:bg-white/50 dark:hover:bg-gray-700"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredExams.map((exam) => {
                const statusInfo = getStatusInfo(exam);
                const StatusIcon = statusInfo.icon;

                return (
                  <Card
                    key={exam.uid}
                    className={`group transition-all duration-300 hover:shadow-lg ${exam.is_active
                      ? 'hover:scale-[1.02] hover:border-primary-300 dark:hover:border-primary-600'
                      : 'opacity-75 cursor-not-allowed'
                      } bg-white dark:bg-background border-gray-200 dark:border-gray-900 shadow-md`}
                  >
                    <CardContent className="p-3 sm:p-4 md:p-6">
                      <div className="space-y-3 sm:space-y-4">
                        {/* Header with Status */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 sm:line-clamp-1">
                                {exam.title}
                              </h3>
                              <Badge className={`${statusInfo.bgColor} ${statusInfo.color} border-0 text-xs self-start sm:self-center flex-shrink-0`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                <span className="truncate">{statusInfo.label}</span>
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 sm:line-clamp-2">
                              {exam.description}
                            </p>
                          </div>
                        </div>

                        {/* Category */}
                        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 self-start">
                            <span className="truncate">{exam.category}</span>
                          </Badge>
                        </div>

                        <div className="flex flex-row justify-between gap-2">
                          <div className="flex items-center gap-1 text-muted-foreground text-xs sm:text-sm">
                            <Timer className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>{exam.duration}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            {/* Countdown Timer */}
                            {exam.expired_date && (
                              <CountdownDisplay
                                targetDate={exam.expired_date}
                                className="self-end"
                              />
                            )}
                            {/* Formatted expiry date - fallback if no countdown */}
                            
                          </div>
                        </div>

                        {/* Exam Details */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">{exam.totalQuestions} questions</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">Passing Mark {exam.passing_marks}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground xs:col-span-2 lg:col-span-1">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">{exam.scheduled_date}</span>
                          </div>
                        </div>

                        {/* User Exam Status */}
                        {exam.user_exam && exam.is_active && (
                          <div className={`p-2 sm:p-3 rounded-lg border ${statusInfo.borderColor} ${statusInfo.bgColor}`}>
                            <div className="flex flex-col xs:flex-row xs:justify-between xs:items-center gap-1 xs:gap-0 text-xs sm:text-sm">
                              <span className="font-medium">Your Progress</span>
                              <div className="text-left xs:text-right">
                                <div className={`font-bold text-sm sm:text-base ${statusInfo.color}`}>
                                  {exam.user_exam.percentage}%
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {exam.user_exam.status_display}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Topics */}
                        {exam.configurations && exam.configurations.length > 0 && (
                          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">Topics: </span>
                              <span className="break-words">
                                {exam.configurations.slice(0, 2).map(config => config.topic_name).join(', ')}
                                {exam.configurations.length > 2 && ` +${exam.configurations.length - 2} more`}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        {exam.is_active && exam.totalQuestions > 0 && (
                          <Button
                            className="w-full mt-3 sm:mt-4 bg-gradient-to-r from-blue-500 to-primary-500 hover:from-blue-600 hover:to-primary-700 text-white group-hover:shadow-md transition-all text-xs sm:text-sm disabled:opacity-50"
                            size="sm"
                            onClick={() => handleStartExam(exam)}
                            disabled={statusInfo.disabled}
                          >
                            <StatusIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{statusInfo.action}</span>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Enhanced Empty State */}
          {filteredExams.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className={`${currentTabInfo?.bgColor} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6`}>
                <currentTabInfo.icon className={`h-10 w-10 ${currentTabInfo?.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                No {currentTabInfo?.label.toLowerCase()} available
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {selectedTab === 'running' && "There are no live exams at the moment. Check back soon or try upcoming exams."}
                {selectedTab === 'upcoming' && "No upcoming exams scheduled yet. Stay tuned for new opportunities!"}
                {selectedTab === 'expired' && "You haven't taken any exams yet. Start with a live exam to see your history here."}
              </p>

              <div className="bg-background border border-gray-200 dark:border-primary-700 rounded-lg p-6 max-w-md mx-auto">
                <Trophy className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                  Ready to test your skills?
                </h4>
                <p className="text-sm text-purple-600 dark:text-white mb-4">
                  Challenge yourself with model tests and track your improvement over time
                </p>
                {selectedTab !== 'running' && (
                  <Button
                    onClick={() => setSelectedTab('running')}
                    variant="outline"
                    className="border-primary-300 text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                  >
                    View Running Exams
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

