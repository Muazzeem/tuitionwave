
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, Trophy, Target, BookOpen, ArrowLeft, HelpCircle } from 'lucide-react';
import { getAccessToken } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardHeader from '@/components/DashboardHeader';

interface ExamResults {
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
  exam_questions: {
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
      option_text: string;
      option_label: string;
      order: number;
      is_correct: boolean;
    }[];
    selected_option_uid?: string;
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
    const fetchExamResults = async () => {
      if (!examId) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/exams/${examId}/`, {
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

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeText = (percentage: number) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    if (percentage >= 40) return 'Average';
    return 'Needs Improvement';
  };

  const getPassFailStatus = (obtainedMarks: number, cutMarks: number) => {
    return obtainedMarks >= cutMarks ? 'PASS' : 'FAIL';
  };

  const getPassFailColor = (obtainedMarks: number, cutMarks: number) => {
    return obtainedMarks >= cutMarks ? 'text-green-600' : 'text-red-600';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!examResults) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center w-full">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Results not found</p>
          <Button onClick={() => navigate('/exam-practice')} className="mt-4">
            Back to Exam Practice
          </Button>
        </div>
      </div>
    );
  }

  const timeTaken = calculateTimeTaken();
  const passFailStatus = getPassFailStatus(examResults.obtained_marks, examResults.cut_marks);

  if (showReviewMode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
        <DashboardHeader userName="John" />
        <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-6">
              {examResults.exam_questions.map((question, index) => (
                <Card key={question.uid}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Question {index + 1}: {question.question_text}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Subject: {question.subject_title}</span>
                      <span>Topic: {question.topic_name}</span>
                      <span>Marks: {question.marks}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {question.options.map((option) => {
                        const isUserSelected = option.uid === question.selected_option_uid;
                        const isCorrect = option.is_correct;
                        const isWrongSelected = isUserSelected && !isCorrect;

                        const baseClass = `p-3 rounded-lg border`;
                        const selectedClass = isCorrect
                          ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800'
                          : isWrongSelected
                            ? 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800'
                            : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';

                        return (
                          <div key={option.uid} className={`${baseClass} ${selectedClass}`}>
                            <div className="flex items-center space-x-2">
                              {isCorrect ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : isWrongSelected ? (
                                <XCircle className="h-4 w-4 text-red-600" />
                              ) : (
                                <div className="h-4 w-4" />
                              )}
                              <span className="font-medium">{option.option_label}</span>
                              <span>{option.option_text}</span>
                              {isCorrect && (
                                <Badge variant="secondary" className="ml-auto">
                                  Correct Answer
                                </Badge>
                              )}
                              {isUserSelected && !isCorrect && (
                                <Badge variant="destructive" className="ml-auto">
                                  Your Answer
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Show Explanation */}
                      {question.explanation && (
                        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-100 rounded-md">
                          <h4 className="font-semibold mb-1">Explanation:</h4>
                          <p>{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => navigate('/job-preparation/practice?tab=create')} variant="outline">
              Back to Exam Practice
            </Button>
            <Button size='sm' className='text-white' onClick={() => navigate('/job-preparation/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
          <div className="pb-20"></div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <DashboardHeader userName="John" />
      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="container mx-auto px-4 py-8 w-full">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Score Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span>Overall Performance</span>
                  </div>

                  {examResults.exam_type === 'model_test' && (
                    <Badge
                      variant={passFailStatus === 'PASS' ? 'default' : 'destructive'}
                      className={`text-lg px-4 py-2 ${getPassFailColor(examResults.obtained_marks, examResults.cut_marks)}`}
                    >
                      <span className='text-white'>{passFailStatus}</span>
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className={`text-6xl font-bold mb-2 ${getGradeColor(examResults.percentage)}`}>
                    {examResults.percentage.toFixed(1)}%
                  </div>
                  <div className={`text-xl font-semibold ${getGradeColor(examResults.percentage)}`}>
                    {getGradeText(examResults.percentage)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    You scored {examResults.obtained_marks} out of {examResults.total_marks} marks
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Cut-off marks: {examResults.cut_marks}
                  </p>
                </div>

                <Progress value={examResults.percentage} className="h-4 mb-6" />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{examResults.correct_answers}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
                  </div>

                  <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-red-600">{examResults.incorrect_answers}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Incorrect</div>
                  </div>

                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <HelpCircle className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-600">{examResults.unanswered}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Unanswered</div>
                  </div>

                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{formatTime(timeTaken)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Time Taken</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exam Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span>Exam Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Performance Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400">Obtained Marks:</span>
                        <span className="font-bold text-lg">{examResults.obtained_marks}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400">Total Marks:</span>
                        <span className="font-bold text-lg">{examResults.total_marks}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400">Cut-off Marks:</span>
                        <span className="font-bold text-lg">{examResults.cut_marks}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400">Time Allocated:</span>
                        <span className="font-bold text-lg">{formatTime(examResults.duration_minutes)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400">Time Taken:</span>
                        <span className="font-bold text-lg">{formatTime(timeTaken)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Question Analysis</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-green-700 dark:text-green-400">Correct Answers:</span>
                        <span className="font-bold text-lg text-green-600">{examResults.correct_answers}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <span className="text-red-700 dark:text-red-400">Incorrect Answers:</span>
                        <span className="font-bold text-lg text-red-600">{examResults.incorrect_answers}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-400">Unanswered:</span>
                        <span className="font-bold text-lg text-gray-600">{examResults.unanswered}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="text-blue-700 dark:text-blue-400">Total Questions:</span>
                        <span className="font-bold text-lg text-blue-600">{examResults.total_questions}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Exam Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  <span>Exam Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Exam Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Exam Type:</span>
                        <span className="font-medium">{examResults.exam_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <Badge variant="secondary">{examResults.status}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Started At:</span>
                        <span className="font-medium">{new Date(examResults.started_at).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Completed At:</span>
                        <span className="font-medium">{new Date(examResults.completed_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Subjects Covered</h3>
                    <div className="space-y-2 mb-4">
                      {examResults.subjects_info.map((subject) => (
                        <Badge key={subject.uid} variant="secondary" className="mr-2 mb-2">
                          {subject.title}
                        </Badge>
                      ))}
                    </div>

                    <h3 className="font-semibold mb-3">Topics Covered</h3>
                    <div className="space-y-2">
                      {examResults.topics_info.map((topic) => (
                        <Badge key={topic.uid} variant="outline" className="mr-2 mb-2">
                          {topic.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <Button onClick={() => setShowReviewMode(true)} variant="outline">
                Review Answers
              </Button>
              <Button onClick={() => navigate('/job-preparation/practice?tab=create')} variant="outline">
                Back to Exam Practice
              </Button>
              <Button size='sm' className='text-white' onClick={() => navigate('/job-preparation/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
