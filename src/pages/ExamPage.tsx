import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, HelpCircle } from 'lucide-react';
import { getAccessToken } from '@/utils/auth';
import { useToast } from '@/hooks/use-toast';
import JobPreparationService from '@/services/JobPreparationService';
import { ExamData, ExamQuestion, QuestionOption } from '@/types/jobPreparation';
import ConfirmationDialog from '@/components/ConfirmationDialog';

interface ExamPageProps {
  // Define any props if needed
}

export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const accessToken = getAccessToken();

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEndExamDialog, setShowEndExamDialog] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      if (!examId) return;

      try {
        const data = await JobPreparationService.getExamData(examId);
        setExamData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load exam. Please try again.",
          variant: "destructive",
        });
        navigate('/exam-practice');
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId, navigate, toast]);

  const handleOptionSelect = (optionUid: string) => {
    setSelectedOption(optionUid);
  };

  const handleSubmitAnswer = async () => {
    if (!examId) return;

    setIsSubmitting(true);
    try {
      if (selectedOption) {
        await JobPreparationService.submitExamAnswer(
          examId,
          examData?.exam_questions[currentQuestionIndex].question_uid!,
          selectedOption
        );
        toast({
          title: "Answer Submitted",
          description: "Your answer has been submitted successfully.",
        });
      } else {
        toast({
          title: "No Option Selected",
          description: "Please select an option before submitting.",
          variant: "warning",
        });
        return;
      }

      if (currentQuestionIndex < examData!.exam_questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        toast({
          title: "Last Question",
          description: "You have reached the last question. Please submit the exam.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndExam = async () => {
    try {
      const response = await JobPreparationService.submitExam(examId!);
      toast({
        title: "Success",
        description: "Exam submitted successfully!",
      });
      navigate(`/exam/${examId}/results`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit exam. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowEndExamDialog(false);
    }
  };

  const currentQuestion = examData?.exam_questions[currentQuestionIndex];

  const calculateTimeRemaining = () => {
    if (!examData?.expires_at) return 0;
    const expiryTime = new Date(examData.expires_at).getTime();
    const now = new Date().getTime();
    return Math.max(0, expiryTime - now);
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [examData?.expires_at]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let timeString = '';
    if (hours > 0) {
      timeString += `${hours}h `;
    }
    if (minutes > 0 || hours > 0) {
      timeString += `${minutes}m `;
    }
    timeString += `${seconds}s`;

    return timeString;
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

  if (!examData || !currentQuestion) {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
              {examData.exam_type} - Question {currentQuestionIndex + 1} of {examData.question_limit}
            </h1>
            <div className="text-gray-600 dark:text-gray-400">
              Time Remaining: {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {currentQuestion.question_text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentQuestion.options.map((option) => (
                  <Button
                    key={option.uid}
                    variant="outline"
                    className={`w-full justify-start ${selectedOption === option.uid ? 'bg-secondary text-secondary-foreground' : ''}`}
                    onClick={() => handleOptionSelect(option.uid)}
                    disabled={isSubmitting}
                  >
                    {option.option_label} {option.option_text}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="secondary"
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex(currentQuestionIndex - 1);
                  setSelectedOption(null);
                }
              }}
              disabled={currentQuestionIndex === 0 || isSubmitting}
            >
              Previous
            </Button>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowEndExamDialog(true)}
                disabled={isSubmitting}
              >
                End Exam
              </Button>
              <Button
                onClick={handleSubmitAnswer}
                disabled={isSubmitting}
              >
                {currentQuestionIndex === examData.exam_questions.length - 1 ? 'Submit Exam' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <ConfirmationDialog
        isOpen={showEndExamDialog}
        onClose={() => setShowEndExamDialog(false)}
        onConfirm={handleEndExam}
        title="End Exam"
        description="Are you sure you want to end the exam? This action cannot be undone."
        variant="cancel"
      />
    </div>
  );
}
