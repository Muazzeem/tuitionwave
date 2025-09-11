import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, Trophy, Target, BookOpen, ArrowLeft, HelpCircle, Award, TrendingUp, Eye, Calendar, Timer, Users, Star, AlertCircle } from 'lucide-react';
import { getAccessToken } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardHeader from '@/components/DashboardHeader';

interface ExamResults {
  result_status: string;
  uid: string;
  exam_type: string;
  status: string;
  question_limit: number;
  total_questions: number;
  total_marks: number;
  duration_minutes: number;
  started_at: string;
  completed_at: string;
  expires_at: string;
  obtained_marks: number;
  percentage: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered: number;
  cut_marks: number;
  subjects_info: { uid: string; title: string; }[];
  topics_info: { uid: string; name: string; }[];
  questions: {
    image: string;
    uid: string;
    order: number;
    topic_name: string;
    subject_title: string;
    question_uid: string;
    question_number: number;
    question_text: string;
    marks: number;
    negative_marks: number;
    time_limit_seconds: number;
    options: {
      uid: string;
      text: string;
      label: string;
      order: number;
      is_correct: boolean;
    }[];
    selected_option?: {
      uid: string;
      text: string;
      label: string;
    };
    is_correct?: boolean;
    explanation?: string;
  }[];
}

export default function ExamResultsPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const accessToken = getAccessToken();

  const [examResults, setExamResults] = useState<ExamResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewMode, setShowReviewMode] = useState(false);

  useEffect(() => {
    document.title = "Tuition Wave | Exam Results";
  }, []);

  useEffect(() => {
    const fetchExamResults = async () => {
      if (!examId) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/exams/${examId}/results`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch exam results');
        }

        const data: ExamResults = await response.json();
        setExamResults(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load exam results.",
          variant: "destructive",
        });
        navigate('/exam-practice');
      } finally {
        setLoading(false);
      }
    };

    fetchExamResults();
  }, [examId, accessToken, toast, navigate]);

  const getPerformanceData = (percentage: number) => {
    if (percentage >= 90) return { color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' };
    if (percentage >= 80) return { color: 'text-green-600', bgColor: 'bg-green-50 dark:bg-green-900/20' };
    if (percentage >= 70) return { color: 'text-blue-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' };
    if (percentage >= 60) return { color: 'text-yellow-600', bgColor: 'bg-yellow-50 dark:bg-yellow-900/20' };
    if (percentage >= 40) return { color: 'text-orange-600', bgColor: 'bg-orange-50 dark:bg-orange-900/20' };
    return { color: 'text-red-600', bgColor: 'bg-red-50 dark:bg-red-900/20' };
  };

  const calculateTimeTaken = () => {
    if (!examResults?.started_at || !examResults?.completed_at) return 0;
    const startTime = new Date(examResults.started_at).getTime();
    const endTime = new Date(examResults.completed_at).getTime();
    return Math.floor((endTime - startTime) / (1000 * 60)); // in minutes
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getAccuracyRate = () => {
    if (!examResults) return 0;
    const attempted = examResults.correct_answers + examResults.incorrect_answers;
    if (attempted === 0) return 0;
    return Math.round((examResults.correct_answers / attempted) * 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center w-full">
        <div className="text-center bg-white dark:bg-background p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 dark:text-gray-200 font-medium">Analyzing your performance...</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">This won't take long!</p>
        </div>
      </div>
    );
  }

  if (!examResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center w-full">
        <div className="text-center bg-white dark:bg-background p-8 rounded-2xl shadow-xl max-w-md">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">Results Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">We couldn't find your exam results. Please try again.</p>
          <Button onClick={() => navigate('/exam-practice')} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Exam Practice
          </Button>
        </div>
      </div>
    );
  }

  const timeTaken = calculateTimeTaken();
  const performanceData = getPerformanceData(examResults.percentage);
  const accuracyRate = getAccuracyRate();

  if (showReviewMode) {
    return (
      <div className="min-h-screen bg-gray-900 w-full">
        <DashboardHeader userName="John" />

        <ScrollArea type="always" style={{ height: 'calc(110vh - 180px)' }}>
          <div className="mx-auto px-4 py-6">
            <div className="max-w-5xl mx-auto space-y-6">
              {examResults.questions.map((question, index) => (
                <Card key={question.uid} className='bg-background border-0 rounded-lg'>
                  <CardHeader className="p-3 sm:p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 md:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <CardTitle className="text-sm md:text-md font-semibold text-white">
                            {question.question_text}
                          </CardTitle>
                          {question.topic_name && (
                            <div className="flex items-center gap-2 hidden sm:block">
                              <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                                {question.topic_name}
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-gray-700 text-gray-300 border-gray-600">
                                {question.subject_title}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-4">
                    {question.image && (
                      <div className="mb-4 rounded-lg overflow-hidden shadow-sm">
                        <img
                          src={question.image}
                          alt="Question illustration"
                          className="w-full max-h-48 sm:max-h-64 object-contain bg-gray-700"
                        />
                      </div>
                    )}
                    <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-2  gap-2 sm:gap-3 mb-4">
                      {question.options.map((option) => {
                        const isUserSelected = option.uid === question.selected_option?.uid;
                        const isCorrect = option.is_correct;
                        const isWrongSelected = isUserSelected && !isCorrect;

                        let optionClass = 'p-1 rounded-xl border-2 transition-all duration-200 text-sm';
                        let badgeElement = null;

                        if (isCorrect) {
                          optionClass += ' bg-green-900/20 border-green-600';
                          badgeElement = (
                            <Badge className="bg-green-600 text-white text-xs px-2 py-0.5">
                              Correct Answer
                            </Badge>
                          );
                        } else if (isWrongSelected) {
                          optionClass += ' bg-red-900/20 border-red-600';
                          badgeElement = (
                            <Badge variant="destructive" className="bg-red-600 text-white text-xs px-2 py-0.5">
                              Your Answer
                            </Badge>
                          );
                        } else if (isUserSelected) {
                          optionClass += ' bg-blue-900/20 border-blue-600';
                        } else {
                          optionClass += ' bg-gray-700 border-gray-600 hover:bg-gray-600';
                        }

                        return (
                          <div key={option.uid} className={optionClass}>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-3 flex-1">
                                <span className="font-semibold text-sm text-gray-300 bg-gray-600 rounded-full w-6 h-6 flex items-center justify-center">
                                  {option.label}
                                </span>
                                <span className="text-white flex-1">{option.text}</span>
                              </div>
                              <div className="hidden md:block">{badgeElement}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {question.explanation && (
                      <div className="lg:col-span-2 mt-3 p-2 md:p-5 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-xl">
                        <div className="flex items-start space-x-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-blue-200 mb-2">Explanation</h4>
                            <p className="text-blue-300 leading-relaxed">
                              {question.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-4">
            <div className="container mx-auto max-w-4xl">
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button
                  onClick={() => setShowReviewMode(false)}
                  variant="outline"
                  className="flex-1 sm:flex-none bg-background border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Results
                </Button>
                <Button
                  onClick={() => navigate('/job-preparation/practice?tab=create')}
                  variant="outline"
                  className="flex-1 sm:flex-none bg-background border-gray-600 text-gray-200 hover:bg-gray-700 hover:text-white"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Practice More
                </Button>
                <Button
                  onClick={() => navigate('/job-preparation/dashboard')}
                  className="flex-1 sm:flex-none bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 w-full">
      <DashboardHeader userName="John" />

      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="mx-auto px-4 py-6 max-w-5xl bg-gray-900 text-gray-100 min-h-screen">
          <div className="space-y-6">

            {/* Hero Section with Main Score */}
            <div className="relative">
              <Card className="bg-background shadow-sm overflow-hidden border-0">
                <CardContent className="p-8 text-center relative">
                  <div className="mb-6">
                    <h1 className="text-5xl font-bold mb-2 text-white">
                      {examResults.percentage.toFixed(1)}%
                    </h1>
                  </div>

                  {examResults.exam_type === 'model_test' && (
                    <div className="mb-6">
                      <Badge
                        variant={examResults.result_status === 'pass' ? 'default' : 'destructive'}
                        className="text-xl px-6 py-3 font-bold text-white"
                      >
                        {examResults.result_status === 'pass' ? '🎉 PASSED' : '💪 KEEP TRYING'}
                      </Badge>
                    </div>
                  )}

                  <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4" />
                      <span>{examResults.obtained_marks}/{examResults.total_marks} marks</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{formatTime(timeTaken)} taken</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4" />
                      <span>{accuracyRate}% accuracy</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 md:grid-cols-4 gap-2">
              <Card className="bg-green-900/30 border-green-700 shadow-md hover:shadow-lg transition-all duration-200">
                <CardContent className="p-3 text-center">
                  <div className="bg-green-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-green-400 mb-1">{examResults.correct_answers}</div>
                  <div className="text-sm font-medium text-green-400">Correct</div>
                </CardContent>
              </Card>

              <Card className="bg-red-900/30 border-red-700 shadow-md hover:shadow-lg transition-all duration-200">
                <CardContent className="p-3 text-center">
                  <div className="bg-red-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <XCircle className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="text-3xl font-bold text-red-400 mb-1">{examResults.incorrect_answers}</div>
                  <div className="text-sm font-medium text-red-400">Incorrect</div>
                </CardContent>
              </Card>

              <Card className="bg-amber-900/30 border-amber-700 shadow-md hover:shadow-lg transition-all duration-200">
                <CardContent className="p-3 text-center">
                  <div className="bg-amber-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <HelpCircle className="h-6 w-6 text-amber-400" />
                  </div>
                  <div className="text-3xl font-bold text-amber-400 mb-1">{examResults.unanswered}</div>
                  <div className="text-sm font-medium text-amber-400">Skipped</div>
                </CardContent>
              </Card>

              <Card className="bg-blue-900/30 border-blue-700 shadow-md hover:shadow-lg transition-all duration-200">
                <CardContent className="p-3 text-center">
                  <div className="bg-blue-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-blue-400 mb-1">{accuracyRate}%</div>
                  <div className="text-sm font-medium text-blue-400">Accuracy</div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Breakdown */}
            <Card className="bg-background shadow-sm border-0">
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span className="text-base sm:text-lg text-white">
                      Performance Breakdown
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-300">Overall Score</span>
                      <span className="font-bold text-lg text-white">{examResults.percentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={examResults.percentage} className="h-3" />
                    <p className="text-sm text-gray-400">
                      You scored {examResults.obtained_marks} out of {examResults.total_marks} marks
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-300">Time Efficiency</span>
                      <span className="font-bold text-lg text-white">
                        {Math.round((timeTaken / examResults.duration_minutes) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.min((timeTaken / examResults.duration_minutes) * 100, 100)}
                      className="h-3"
                    />
                    <p className="text-sm text-gray-400">
                      Used {formatTime(timeTaken)} of {formatTime(examResults.duration_minutes)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-300">Attempt Rate</span>
                      <span className="font-bold text-lg text-white">
                        {Math.round(((examResults.correct_answers + examResults.incorrect_answers) / examResults.total_questions) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={((examResults.correct_answers + examResults.incorrect_answers) / examResults.total_questions) * 100}
                      className="h-3"
                    />
                    <p className="text-sm text-gray-400">
                      Attempted {examResults.correct_answers + examResults.incorrect_answers} of {examResults.total_questions} questions
                    </p>
                  </div>
                </div>

                {examResults.cut_marks > 0 && (
                  <div className="mt-6 p-4 bg-blue-900/30 rounded-xl border border-blue-700">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-800 p-2 rounded-full">
                        <Target className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-100">Cut-off Comparison</h3>
                        <p className="text-sm text-gray-400">
                          Required: {examResults.cut_marks} marks • You scored: {examResults.obtained_marks} marks
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Exam Details & Performance Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Exam Information */}
              <Card className="bg-background shadow-sm border-0">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <span className="text-base sm:text-lg text-white">
                        Exam Information
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Exam Type</div>
                        <Badge variant="secondary" className="capitalize">
                          {examResults.exam_type.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Status</div>
                        <Badge variant="outline" className="capitalize text-green-400 border-green-400">
                          {examResults.status}
                        </Badge>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Total Questions</div>
                        <div className="text-lg font-semibold text-white">
                          {examResults.total_questions}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Duration</div>
                        <div className="text-lg font-semibold text-white">
                          {formatTime(examResults.duration_minutes)}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Time Used</div>
                        <div className="text-lg font-semibold text-white">
                          {formatTime(timeTaken)}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-400 mb-1">Total Marks</div>
                        <div className="text-lg font-semibold text-white">
                          {examResults.total_marks}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-400">Started At:</span>
                        <span className="text-sm font-medium text-white">
                          {new Date(examResults.started_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-400">Completed At:</span>
                        <span className="text-sm font-medium text-white">
                          {new Date(examResults.completed_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Insights */}
              <Card className="bg-background shadow-sm border-0">
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <span className="text-base sm:text-lg text-white">
                        Performance Insights
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-900/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        <span className="font-medium text-gray-300">Accuracy Rate</span>
                      </div>
                      <span className="text-lg font-bold text-green-400">{accuracyRate}%</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-900/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span className="font-medium text-gray-300">Completion Rate</span>
                      </div>
                      <span className="text-lg font-bold text-blue-400">
                        {Math.round(((examResults.correct_answers + examResults.incorrect_answers) / examResults.total_questions) * 100)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                        <span className="font-medium text-gray-300">Speed Score</span>
                      </div>
                      <span className="text-lg font-bold text-purple-400">
                        {timeTaken < examResults.duration_minutes ? 'Fast' : 'Normal'}
                      </span>
                    </div>
                  </div>

                  {/* Improvement Areas */}
                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="font-semibold text-white mb-3 flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Areas for Improvement</span>
                    </h4>
                    <div className="space-y-2">
                      {examResults.incorrect_answers > 0 && (
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <span className="text-gray-400">
                            Review {examResults.incorrect_answers} incorrect answers
                          </span>
                        </div>
                      )}
                      {examResults.unanswered > 0 && (
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <span className="text-gray-400">
                            {examResults.unanswered} questions left unanswered
                          </span>
                        </div>
                      )}
                      {timeTaken > examResults.duration_minutes * 0.9 && (
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span className="text-gray-400">
                            Practice time management
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <Card className="bg-background text-white border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-lg md:text-2xl font-bold mb-2">What's Next?</h2>
                  <p className="text-gray-400 hidden md:block">Continue your learning journey with these options</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setShowReviewMode(true)}
                    variant="secondary"
                    size="sm"
                    className="h-20 bg-primary-700 hover:bg-primary-800 text-white border-white/30 backdrop-blur-sm transition-all duration-200"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Eye className="h-5 w-5" />
                      <span className="font-medium">Review Answers</span>
                      <span className="text-xs opacity-80 hidden md:block">See detailed solutions</span>
                    </div>
                  </Button>

                  <Button
                    onClick={() => navigate('/job-preparation/practice?tab=create')}
                    variant="secondary"
                    size="lg"
                    className="h-20 bg-primary-700 hover:bg-primary-800 text-white border-white/30 backdrop-blur-sm transition-all duration-200"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Target className="h-5 w-5" />
                      <span className="font-medium">Practice More</span>
                      <span className="text-xs opacity-80 hidden md:block">Take another exam</span>
                    </div>
                  </Button>

                  <Button
                    onClick={() => navigate('/job-preparation/dashboard')}
                    variant="secondary"
                    size="lg"
                    className="h-20 bg-primary-700 hover:bg-primary-800 text-white border-white/30 backdrop-blur-sm transition-all duration-200"
                  >
                    <div className="flex flex-col items-center space-y-1">
                      <Trophy className="h-5 w-5" />
                      <span className="font-medium">Dashboard</span>
                      <span className="text-xs opacity-80 hidden md:block">Track progress</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}