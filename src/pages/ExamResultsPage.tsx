
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, Trophy, Target, BookOpen, ArrowLeft } from 'lucide-react';
import { getAccessToken } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';

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
  obtained_marks: number;
  percentage: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered: number;
  cut_marks: number;
  subjects_info: { uid: string; title: string; }[];
  topics_info: { uid: string; name: string; }[];
}

export default function ExamResultsPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const accessToken = getAccessToken();

  const [examResults, setExamResults] = useState<ExamResults | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!examResults) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Results not found</p>
          <Button onClick={() => navigate('/exam-practice')} className="mt-4">
            Back to Exam Practice
          </Button>
        </div>
      </div>
    );
  }

  const timeTaken = examResults.started_at && examResults.completed_at
    ? Math.floor((new Date(examResults.completed_at).getTime() - new Date(examResults.started_at).getTime()) / (1000 * 60))
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/exam-practice')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Exam Practice
              </Button>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Exam Results
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Score Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span>Overall Performance</span>
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
              </div>
              
              <Progress value={examResults.percentage} className="h-4 mb-4" />
              
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
                  <Target className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-600">{examResults.unanswered}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Unanswered</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{timeTaken}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Minutes</div>
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
                      <span className="text-gray-600 dark:text-gray-400">Total Questions:</span>
                      <span className="font-medium">{examResults.question_limit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="font-medium">{examResults.duration_minutes} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Cut Marks:</span>
                      <span className="font-medium">{examResults.cut_marks}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Subjects Covered</h3>
                  <div className="space-y-2">
                    {examResults.subjects_info.map((subject) => (
                      <Badge key={subject.uid} variant="secondary" className="mr-2 mb-2">
                        {subject.title}
                      </Badge>
                    ))}
                  </div>
                  
                  <h3 className="font-semibold mb-3 mt-4">Topics Covered</h3>
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
            <Button onClick={() => navigate('/exam-practice')} variant="outline">
              Back to Exam Practice
            </Button>
            <Button onClick={() => navigate('/job-preparation/dashboard')}>
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
