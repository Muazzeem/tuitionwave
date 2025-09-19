import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, ArrowLeft, AlertCircle, Trophy } from 'lucide-react';
import { getAccessToken } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardHeader from '@/components/DashboardHeader';
import { ExamResults } from '@/types/jobPreparation';

import ResultsHeaderCard from "./ResultsHeaderCard";
import ReviewAnswers from './ReviewAnswers';


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

  console.log(examResults);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 w-full">
        <DashboardHeader userName="John" />
        <div className="flex items-center justify-center w-full h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-200 font-medium">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

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

  if (showReviewMode) {
    return (
      <div className="min-h-screen bg-gray-900 w-full">
        <DashboardHeader userName="John" />
        <ReviewAnswers
          examResults={examResults}
          onBackToResults={() => setShowReviewMode(false)}
          onPracticeMore={() => navigate("/job-preparation/practice?tab=create")}
          onGoToDashboard={() => navigate("/job-preparation/dashboard")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardHeader userName="John" />
      <ScrollArea type="always" style={{ height: "calc(100vh - 100px)" }}>
        <div className="container mx-auto px-4 py-8 md:max-w-6xl lg:max-w-5xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-lg md:text-3xl font-bold mb-2 font-unbounded">Results</h1>
            <p className="text-gray-400">Track Your Progress And Improve Your Performance</p>
          </div>

          {/* Main Score Display */}

          <ResultsHeaderCard
            examResults={examResultsInfo}
            timeTakenLabel={timeTaken}
            onReview={() => setShowReviewMode(true)}
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
                  {/* Mock leaderboard entries */}
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
      </ScrollArea>
    </div>
  );
}