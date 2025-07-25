
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { getAccessToken } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import ConfirmationDialog from '@/components/ConfirmationDialog';

interface ExamQuestion {
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
  }[];
}

interface ExamData {
  uid: string;
  exam_type: string;
  status: string;
  question_limit: number;
  total_questions: number;
  total_marks: number;
  duration_minutes: number;
  started_at: string | null;
  completed_at: string | null;
  expires_at: string | null;
  obtained_marks: number;
  percentage: number;
  correct_answers: number;
  incorrect_answers: number;
  unanswered: number;
  cut_marks: number;
  subjects_info: { uid: string; title: string; }[];
  topics_info: { uid: string; name: string; }[];
  exam_questions: ExamQuestion[];
}

interface UserAnswer {
  [questionUid: string]: string | null;
}

export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const accessToken = getAccessToken();

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showEndExamDialog, setShowEndExamDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch exam data
  useEffect(() => {
    const fetchExamData = async () => {
      if (!examId) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/exams/${examId}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch exam data');
        }

        const data: ExamData = await response.json();
        setExamData(data);
        
        // Set timer based on duration
        const durationInSeconds = data.duration_minutes * 60;
        setTimeLeft(durationInSeconds);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load exam data.",
          variant: "destructive",
        });
        navigate('/exam-practice');
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [examId, accessToken, toast, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = async (questionUid: string, optionUid: string) => {
    if (!examId) return;

    try {
      // Submit answer to API
      await fetch(`${import.meta.env.VITE_API_URL}/api/exams/${examId}/submit-answer/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: questionUid,
          selected_option: optionUid,
        }),
      });

      // Update local state
      setUserAnswers(prev => ({
        ...prev,
        [questionUid]: optionUid,
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save answer.",
        variant: "destructive",
      });
    }
  };

  const handleSubmitExam = async () => {
    if (!examId || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/exams/${examId}/submit/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to submit exam');
      }

      toast({
        title: "Success",
        description: "Exam submitted successfully!",
      });

      navigate(`/exam/${examId}/results`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit exam.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setShowEndExamDialog(false);
    }
  };

  const nextQuestion = () => {
    if (examData && currentQuestionIndex < examData.exam_questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getAnsweredCount = () => {
    return Object.values(userAnswers).filter(answer => answer !== null).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Exam not found</p>
          <Button onClick={() => navigate('/exam-practice')} className="mt-4">
            Back to Exam Practice
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = examData.exam_questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / examData.exam_questions.length) * 100;
  const answeredCount = getAnsweredCount();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                {examData.exam_type.charAt(0).toUpperCase() + examData.exam_type.slice(1)} Exam
              </h1>
              <Badge variant="outline">
                {examData.question_limit} Questions
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className={`h-5 w-5 ${timeLeft < 300 ? 'text-red-500' : 'text-blue-500'}`} />
                <span className={`text-lg font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-blue-500'}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowEndExamDialog(true)}
                disabled={submitting}
              >
                End Exam
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Question {currentQuestionIndex + 1} of {examData.exam_questions.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Answered: {answeredCount}/{examData.exam_questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Question {currentQuestion.question_number}</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{currentQuestion.subject_title}</Badge>
                  <Badge variant="outline">{currentQuestion.topic_name}</Badge>
                  <Badge variant="outline">{currentQuestion.marks} marks</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-6 leading-relaxed">{currentQuestion.question_text}</p>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = userAnswers[currentQuestion.question_uid] === option.uid;
                  
                  return (
                    <div
                      key={option.uid}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20' 
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestion.question_uid, option.uid)}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                        }`}>
                          {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                        </div>
                        <span className="font-medium mr-2">{option.option_label}</span>
                        <span>{option.option_text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={previousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {userAnswers[currentQuestion.question_uid] && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {userAnswers[currentQuestion.question_uid] ? 'Answered' : 'Not answered'}
              </span>
            </div>

            <Button
              onClick={nextQuestion}
              disabled={currentQuestionIndex === examData.exam_questions.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* End Exam Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showEndExamDialog}
        onClose={() => setShowEndExamDialog(false)}
        onConfirm={handleSubmitExam}
        title="End Exam"
        description={`Are you sure you want to end the exam? You have answered ${answeredCount} out of ${examData.exam_questions.length} questions.`}
        variant="destructive"
      />
    </div>
  );
}
