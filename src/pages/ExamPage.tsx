
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
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExamPageProps {
  // Define any props if needed
}

export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const accessToken = getAccessToken();

  const [examData, setExamData] = useState<ExamData | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEndExamDialog, setShowEndExamDialog] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchExam = async () => {
      if (!examId) return;

      try {
        const data = await JobPreparationService.getExamData(examId);
        console.log('Exam data:', data);
        setExamData(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load exam. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId, navigate, toast]);

  const handleOptionSelect = (questionUid: string, optionUid: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionUid]: optionUid
    }));
  };

  const handleSubmitAnswer = async (questionUid: string) => {
    if (!examId || !selectedOptions[questionUid]) {
      toast({
        title: "No Option Selected",
        description: "Please select an option before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await JobPreparationService.submitExamAnswer(
        examId,
        questionUid,
        selectedOptions[questionUid]
      );
      
      setSubmittedAnswers(prev => new Set(prev).add(questionUid));
      
      toast({
        title: "Answer Submitted",
        description: "Your answer has been submitted successfully.",
      });
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

  const getAnsweredCount = () => {
    return submittedAnswers.size;
  };

  const getProgressPercentage = () => {
    if (!examData) return 0;
    return (getAnsweredCount() / examData.exam_questions.length) * 100;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center w-full">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Exam not found</p>
          <Button onClick={() => navigate('/job-preparation/practice')} className="mt-4 text-white">
            Back to Exam Practice
          </Button>
        </div>
      </div>
    );
  }

  if (examData.status === 'completed') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center w-full">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Exam is completed</p>
          <Button onClick={() => navigate('/job-preparation/practice')} className="mt-4 text-white">
            Back to Exam Practice
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 w-full">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                {examData.exam_type} - {examData.question_limit} Questions
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Progress: {getAnsweredCount()}/{examData.question_limit}
                </div>
                <Progress value={getProgressPercentage()} className="w-32" />
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Time Remaining: {formatTime(timeRemaining)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* All Questions */}
            {examData.exam_questions.map((question, index) => (
              <Card key={question.uid} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">
                      Question {index + 1}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {submittedAnswers.has(question.question_uid) ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                      <span className="text-sm text-gray-500">
                        {question.marks} mark{question.marks > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {question.topic_name} - {question.subject_title}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-800 dark:text-gray-200 mb-4">
                      {question.question_text}
                    </p>

                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <Button
                          key={option.uid}
                          variant="outline"
                          className={`w-full justify-start text-left ${selectedOptions[question.question_uid] === option.uid
                            ? 'bg-blue-50 border-blue-500 text-blue-700'
                            : ''
                            } ${submittedAnswers.has(question.question_uid)
                              ? 'opacity-75 cursor-not-allowed'
                              : ''
                            }`}
                          onClick={() => handleOptionSelect(question.question_uid, option.uid)}
                          disabled={submittedAnswers.has(question.question_uid)}
                        >
                          <span className="font-medium mr-2">{option.option_label}</span>
                          {option.option_text}
                        </Button>
                      ))}
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        onClick={() => handleSubmitAnswer(question.question_uid)}
                        disabled={
                          isSubmitting ||
                          !selectedOptions[question.question_uid] ||
                          submittedAnswers.has(question.question_uid)
                        }
                        className="min-w-32 text-white"
                      >
                        {submittedAnswers.has(question.question_uid) ? 'Submitted' : 'Submit Answer'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* End Exam Button */}
            <div className="flex justify-center pt-6">
              <Button
                variant="destructive"
                onClick={() => setShowEndExamDialog(true)}
                disabled={isSubmitting}
                className="min-w-48 text-white"
              >
                End Exam
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
      
      <ConfirmationDialog
        isOpen={showEndExamDialog}
        onClose={() => setShowEndExamDialog(false)}
        onConfirm={handleEndExam}
        title="End Exam"
        description="Are you sure you want to end the exam? This action cannot be undone."
        variant="confirmation"
      />
    </div>
  );
}
