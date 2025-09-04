import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, BookOpen, Target, Timer, ArrowLeft, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import JobPreparationService from '@/services/JobPreparationService';
import { ExamData } from '@/types/jobPreparation';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [examData, setExamData] = useState({} as ExamData);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEndExamDialog, setShowEndExamDialog] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState<Set<string>>(new Set());
  const [submittingQuestion, setSubmittingQuestion] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Tuition Wave | Exam";
  }, []);

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
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId, navigate, toast]);


  const handelBack = () => {
    if (window.location.href.includes("model-test")) {
      navigate(`/job-preparation/create-model-test`);
    } else {
      navigate(`/job-preparation/practice`);
    }
  };

  const handleSelectAndSubmit = async (questionUid: string, optionUid: string) => {
    // Set the selected option immediately for UI feedback
    setSelectedOptions(prev => ({
      ...prev,
      [questionUid]: optionUid
    }));

    // Set submitting state for this specific question
    setSubmittingQuestion(questionUid);

    // Validate and submit the answer
    if (!examId || !optionUid) {
      toast({
        title: "No Option Selected",
        description: "Please select an option before submitting.",
        variant: "destructive",
      });
      setSubmittingQuestion(null);
      return;
    }

    try {
      await JobPreparationService.submitExamAnswer(
        examId,
        questionUid,
        optionUid
      );

      setSubmittedAnswers(prev => new Set(prev).add(questionUid));

      toast({
        title: "Answer Submitted",
        description: "Your answer has been recorded successfully.",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmittingQuestion(null);
    }
  };

  const handleEndExam = async () => {
    setLoading(true);
    setIsSubmitting(true);
    try {
      const response = await JobPreparationService.submitExam(examId);
      if (response.status === 200) {
        navigate(`/job-preparation/exam/${examId}/results`);
        toast({
          title: "Exam Completed!",
          description: "Your exam has been submitted successfully. Redirecting to results...",
          duration: 3000,
        });
      }
      setLoading(false);
      setIsSubmitting(false);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit exam. Please try again.",
        variant: "destructive",
      });
    } finally {
      setShowEndExamDialog(false);
      setIsSubmitting(false);
      setLoading(false);
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
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      // Auto-submit when time runs out
      if (remaining <= 2 && examData.status === 'in_progress') {
        handleEndExam();
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [examData?.expires_at, examData.status]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let result = [];
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}min`);
    if (seconds > 0 || result.length === 0) result.push(`${seconds}sec`);

    return result.join(' ');
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center w-full">
        <div className="text-center bg-gray-800 p-8 rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
          <h3 className="text-lg font-semibold text-white mb-2">Loading Your Exam</h3>
          <p className="text-gray-400">Please wait while we prepare your questions...</p>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center w-full">
        <div className="text-center bg-gray-800 p-8 rounded-2xl shadow-lg">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Exam Not Found</h3>
          <p className="text-gray-400 mb-4">The requested exam could not be found.</p>
          <Button onClick={() => navigate('/job-preparation/practice')} className="bg-blue-600 hover:bg-blue-700 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Practice
          </Button>
        </div>
      </div>
    );
  }

  if (examData.status === 'completed') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center w-full">
        <div className="text-center bg-gray-800 p-8 rounded-2xl shadow-lg">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Exam Completed</h3>
          <p className="text-gray-400 mb-4">This exam has already been completed.</p>
          <Button onClick={() => handelBack()} className="bg-blue-600 hover:bg-blue-700 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Practice
          </Button>
        </div>
      </div>
    );
  }

  if (examData.status === 'expired') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center w-full">
        <div className="text-center bg-gray-800 p-8 rounded-2xl shadow-lg">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Exam Expired</h3>
          <p className="text-gray-400 mb-4">This exam has expired.</p>
          <Button onClick={() => handelBack()} className="bg-blue-600 hover:bg-blue-700 text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Practice
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 w-full">
      {/* Enhanced Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg border-b border-gray-700 sticky top-0 z-10">
        <div className="w-full p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                  <h1 className="text-xl font-bold text-white">
                    Practice Exam
                  </h1>
                  <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                    {examData.question_limit} Questions
                  </Badge>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Target className="h-4 w-4" />
                    Progress: {getAnsweredCount()}/{examData.question_limit}
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={getProgressPercentage()} className="w-40" />
                    <span className="text-sm font-medium text-gray-300">
                      {Math.round(getProgressPercentage())}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              {examData.status === 'in_progress' && (
                <div className="flex items-center gap-3">
                  <Badge
                    className={`flex items-center text-sm font-semibold px-4 py-2 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:bg-red-600
                    ${timeRemaining < 300000
                        ? 'bg-red-600 text-white animate-water-drop'
                        : 'bg-red-600 text-white'}`}
                  >
                    <Timer className="h-4 w-4 mr-2" />
                    {formatTime(timeRemaining)}
                  </Badge>

                  {timeRemaining < 300000 && (
                    <div className="text-sm font-medium text-red-400 animate-bounce">
                      ⏳ Hurry up!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ScrollArea type="always" style={{ height: 'calc(100vh - 140px)' }}>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Questions */}
            {examData.exam_questions?.map((question, index) => (
              <Card key={question.uid} className='bg-gray-800 border-gray-700 rounded-lg'>
                <CardHeader className="p-2 sm:p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-white">
                          {question.question_text}
                        </CardTitle>
                        {question.topic_name && (
                          <div className="flex items-center gap-2 mt-1">
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
                    <div className="flex items-center gap-3">
                      {submittedAnswers.has(question.question_uid) && (
                        <div className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="h-5 w-5" />
                          <span className="text-xs font-medium">Answered</span>
                        </div>
                      )}
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
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-3 mb-4">
                      {question.options?.map((option) => {
                        const isSelected = selectedOptions[question.question_uid] === option.uid;
                        const isSubmitted = submittedAnswers.has(question.question_uid);
                        const isSubmitting = submittingQuestion === question.question_uid;

                        return (
                          <Button
                            key={option.uid}
                            variant="outline"
                            className={`w-full rounded-lg shadow-md justify-start p-2 text-left h-auto min-h-[60px] transition-all duration-200 bg-gray-700 border-gray-600 text-gray-200 ${isSelected
                              ? 'bg-blue-900/50 border-blue-500 text-blue-300 shadow-md'
                              : 'hover:bg-gray-600'
                              } ${isSubmitted
                                ? 'opacity-75 cursor-not-allowed'
                                : 'hover:shadow-md'
                              }`}
                            onClick={() => {
                              if (!isSubmitted) {
                                handleSelectAndSubmit(question.question_uid, option.uid);
                              }
                            }}
                            disabled={isSubmitted || isSubmitting}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold p-2 ${isSelected
                                ? 'bg-blue-500 text-white border-blue-500'
                                : 'border-gray-400 text-gray-300'
                                }`}>
                                {option.option_label}
                              </div>
                              <span className="text-left flex-1">
                                {option.option_text}
                              </span>
                              {isSubmitting && isSelected && (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
                              )}
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center pt-6 pb-4">
            <Button
              variant="default"
              onClick={() => setShowEndExamDialog(true)}
              disabled={isSubmitting}
              className="min-w-48 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Submit Answers
            </Button>
          </div>
        </div>
        <div className="pb-20"></div>
      </ScrollArea>

      <ConfirmationDialog
        isOpen={showEndExamDialog}
        onClose={() => setShowEndExamDialog(false)}
        onConfirm={handleEndExam}
        title="Submit Exam"
        description={`You have answered ${getAnsweredCount()} out of ${examData.exam_questions?.length || 0} questions. Once submitted, you cannot make changes. Are you sure you want to submit your exam?`}
        variant="confirmation"
      />
    </div>
  );
}