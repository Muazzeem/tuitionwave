import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, ArrowLeft, AlertCircle, Trophy, ChevronLeft } from 'lucide-react';
import { getAccessToken } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardHeader from '@/components/DashboardHeader';
import { ExamResults } from '@/types/jobPreparation';
import { Skeleton } from '@/components/ui/skeleton';

import ResultsHeaderCard from "../../components/JobPreparation/ResultsHeaderCard";


export default function ExamResultsPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const accessToken = getAccessToken();

  const [examResults, setExamResults] = useState<ExamResults | null>(null);
  const [loading, setLoading] = useState(true);

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

  // --------- SKELETON UI (when loading) ----------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <DashboardHeader userName="John" />

        <ScrollArea type="always" style={{ height: "calc(100vh - 100px)" }}>
          <div className="container mx-auto p-0">
            {/* Sticky header skeleton */}
            <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80">
              <div className="py-4">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="text-center justify-self-center w-full max-w-xl mx-auto">
                    <Skeleton className="h-7 w-2/3 mx-auto mb-2" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </div>
                  <div className="h-8 w-8" aria-hidden="true" />
                </div>
              </div>
              <div className="border-b border-white/10" />
            </div>

            <div className="pt-5 container mx-auto md:max-w-6xl p-0">
              {/* Results header card skeleton */}
              <Card className="bg-background border-0 shadow-sm rounded-2xl">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="p-4 rounded-xl border border-gray-800">
                        <Skeleton className="h-4 w-24 mb-3" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
                {/* Left column card skeleton */}
                <Card className="bg-background border-0 shadow-sm rounded-2xl">
                  <CardHeader>
                    <Skeleton className="h-5 w-40" />
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-3 w-56 mt-2" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-10" />
                      </div>
                      <Skeleton className="h-2 w-full" />
                      <Skeleton className="h-3 w-64 mt-2" />
                    </div>

                    <div className="p-4 rounded-lg border border-blue-900/40">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-5 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-40 mb-2" />
                          <Skeleton className="h-3 w-56" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Right column (leaderboard) skeleton */}
                <Card className="bg-background border-0 shadow-sm rounded-2xl">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-52" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-gray-700 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Skeleton className="w-10 h-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-40 mb-2" />
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-3 w-24" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Skeleton className="h-6 w-8 mb-1" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Bottom button skeleton */}
              <div className="text-center mt-8">
                <Skeleton className="h-10 w-40 mx-auto rounded-md" />
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }
  // --------- END SKELETON UI ----------

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
  const timeTaken = calculateTimeTaken();

  const examResultsInfo = {
    percentage: examResults?.percentage,
    obtained_marks: examResults?.obtained_marks,
    total_marks: examResults?.total_marks,
    correct_answers: examResults?.correct_answers,
    incorrect_answers: examResults?.incorrect_answers,
    unanswered: examResults?.unanswered,
    resultStatus: examResults?.result_status
  };

  // ------------- REAL UI (after loading) -------------
  if (!examResults) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center w-full">
        <div className="text-center p-8 rounded-2xl max-w-md">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-200 mb-2">Results Not Found</h2>
          <p className="text-gray-400 mb-6">We couldn't find your exam results.</p>
          <Button onClick={() => navigate('/exam-practice')} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Exam Practice
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardHeader userName="John" />
      <ScrollArea type="always" style={{ height: "calc(100vh - 100px)" }}>
        <div className="container mx-auto p-0">
          {/* Header */}
          <div className="sm:sticky top-0 z-10 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80">
            <div className="py-4 p-2">
              <div className="grid grid-cols-[auto_1fr_auto] items-center">
                <button
                  type="button"
                  onClick={() => navigate(`/job-preparation/model-test?tab=running`)}
                  aria-label="Back to results"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>

                <div className="text-center justify-self-center">
                  <h2 className="text-lg md:text-3xl font-bold mb-1 font-unbounded">
                    Exam Results
                  </h2>
                  <p className="text-gray-400 hidden md:block">
                    Track Your Progress And Improve Your Performance
                  </p>
                </div>

                <div className="h-8 w-8" aria-hidden="true" />
              </div>
            </div>
            <div className="border-b border-white/10" />
          </div>

          <div className="pt-5 container mx-auto md:max-w-6xl p-0">
            <ResultsHeaderCard
              examResults={examResultsInfo}
              timeTakenLabel={timeTaken}
              onReview={() =>
                navigate(`/job-preparation/exam/${examId}/review-answer`)
              }
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-background border-0 shadow-sm rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-white text-md">Performance Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400 text-sm">Overall Score</span>
                        <span className="font-bold text-white">{examResults.percentage.toFixed(1)}%</span>
                      </div>
                      <Progress value={examResults.percentage} className="h-2 bg-gray-700" />
                      <p className="text-xs text-gray-400 mt-1">
                        You scored {examResults.obtained_marks} out of {examResults.total_marks} marks
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400 text-sm">Time Efficiency</span>
                        <span className="font-bold text-white">
                          {Math.round((timeTaken / examResults.duration_minutes) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={Math.min((timeTaken / examResults.duration_minutes) * 100, 100)}
                        className="h-2 bg-gray-700"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Used {formatTime(timeTaken)} of {formatTime(examResults.duration_minutes)}
                      </p>
                    </div>

                    {examResults.cut_marks > 0 && (
                      <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700">
                        <div className="flex items-center gap-3">
                          <Target className="h-5 w-5 text-blue-400" />
                          <div>
                            <h3 className="font-semibold text-blue-200">Cut-off Comparison</h3>
                            <p className="text-sm text-blue-300">
                              Required: {examResults.cut_marks} marks • You scored: {examResults.obtained_marks} marks
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Exam Information */}
                <Card className="bg-background border-0 shadow-sm rounded-2xl">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white text-md">Exam Information</CardTitle>
                      <Badge variant="outline" className="text-green-400 border-green-400">
                        Complete
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">

                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Exam Type</span>
                      <Badge variant="secondary" className="bg-green-700 text-green-100">
                        Model Test
                      </Badge>
                    </div>

                    <div>
                      <p className="text-gray-400 text-sm mb-3 text-sm">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Start Date</span>
                        <p className="text-gray-200">
                          {new Date(examResults.started_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">Complete Date</span>
                        <p className="text-gray-200">
                          {new Date(examResults.completed_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Leaderboard */}
              <div className="lg:col-span-1">
                <Card className="bg-background border-0 shadow-sm rounded-2xl">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white text-md">Total Participation(20)</CardTitle>
                      <div className="text-right">
                        <p className="text-gray-400 text-sm">Your Rank: 02</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[1, 2, 3, 4, 5, 6].map((rank) => (
                      <div key={rank} className="flex items-center justify-between p-3 border border-gray-700 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            M
                          </div>
                          <div>
                            <p className="text-white font-medium text-md">Muazzem Hossain</p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span>{formatTime(timeTaken)} Taken</span>
                              <Target className="h-3 w-3 ml-2" />
                              <span>Cut Marks: {examResults.cut_marks < 10 ? '0' : ''}{examResults.cut_marks}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-white">{rank === 1 ? '8' : '10'}</p>
                          <p className="text-xs text-gray-400">Points</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="text-center mt-8">
              <Button
                onClick={() => navigate('/job-preparation/practice?tab=create')}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 px-8"
              >
                Practice More
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
