
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, BookOpen, Target, Timer, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import JobPreparationService from '@/services/JobPreparationService';
import { ExamData } from '@/types/jobPreparation';
import { AnswerResult } from '@/types/common';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import QuestionCard from '@/components/JobPreparation/QuestionCard';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ExamPage() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [examData, setExamData] = useState({} as ExamData);
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [results, setResults] = useState<{ [key: string]: AnswerResult }>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEndExamDialog, setShowEndExamDialog] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState<Set<string>>(new Set());

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

  const handleBack = () => {
    if (window.location.href.includes("model-test")) {
      navigate(`/job-preparation/create-model-test`);
    } else {
      navigate(`/job-preparation/practice`);
    }
  };

  const handleOptionSelect = async (questionUid: string, optionLabel: string) => {
    // Find the option UID from the label
    const question = examData.exam_questions.find(q => q.question_uid === questionUid);
    const selectedOption = question?.options.find(opt => opt.option_label === optionLabel);
    
    if (!selectedOption) return;

    // Set the selected option immediately for UI feedback
    setSelectedOptions(prev => ({
      ...prev,
      [questionUid]: optionLabel
    }));

    // Validate and submit the answer
    if (!examId || !selectedOption.uid) {
      toast({
        title: "No Option Selected",
        description: "Please select an option before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      await JobPreparationService.submitExamAnswer(
        examId,
        questionUid,
        selectedOption.uid
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

  // Convert exam questions to Question format for QuestionCard
  const convertToQuestions = () => {
    return examData.exam_questions?.map(examQ => ({
      uid: examQ.question_uid,
      question_number: examQ.question_number,
      question_text: examQ.question_text,
      marks: examQ.marks,
      negative_marks: examQ.negative_marks,
      time_limit_seconds: examQ.time_limit_seconds,
      image: '',
      options: examQ.options.map(opt => ({
        uid: opt.uid,
        option_label: opt.option_label,
        option_text: opt.option_text,
        order: opt.order || 0
      }))
    })) || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center w-full">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-6"></div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Loading Your Exam</h3>
          <p className="text-gray-600 dark:text-gray-400">Please wait while we prepare your questions...</p>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center w-full">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Exam Not Found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The requested exam could not be found.</p>
          <Button onClick={() => navigate('/job-preparation/practice')} className="text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Practice
          </Button>
        </div>
      </div>
    );
  }

  if (examData.status === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center w-full">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Exam Completed</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">This exam has already been completed.</p>
          <Button onClick={() => handleBack()} className="text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Practice
          </Button>
        </div>
      </div>
    );
  }

  if (examData.status === 'expired') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center w-full">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Exam Expired</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">This exam has expired.</p>
          <Button onClick={() => handleBack()} className="text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Practice
          </Button>
        </div>
      </div>
    );
  }

  const questions = convertToQuestions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 w-full">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border-b sticky top-0 z-10">
        <div className="w-full p-3 sm:p-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3 min-w-0">        
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white truncate">
                    Practice Exam
                  </h1>
                  <Badge variant="secondary" className="text-xs">
                    {examData.question_limit} Questions
                  </Badge>
                </div>
                <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                  <div className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-400">
                    <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Progress: {getAnsweredCount()}/{examData.question_limit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={getProgressPercentage()} className="w-20 sm:w-40" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
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
                    className={`flex items-center text-sm font-semibold px-3 py-2 rounded-full shadow-xl transition-all duration-300 hover:scale-110 hover:bg-red-600
                    ${timeRemaining < 300000
                        ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-red-600 text-white'}`}
                  >
                    <Timer className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {formatTime(timeRemaining)}
                  </Badge>

                  {timeRemaining < 300000 && (
                    <div className="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 animate-bounce hidden sm:block">
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
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-8">
            {/* Questions using QuestionCard component */}
            {questions.map((question, index) => {
              const examQuestion = examData.exam_questions[index];
              const isAnswered = submittedAnswers.has(question.uid);
              const selectedOption = selectedOptions[question.uid];

              return (
                <div key={question.uid} className="relative">
                  <QuestionCard
                    question={question}
                    isAnswered={isAnswered}
                    selectedOption={selectedOption}
                    onOptionSelect={handleOptionSelect}
                    mode="practice"
                  />
                  
                  {/* Additional exam-specific info */}
                  {examQuestion.topic_name && (
                    <div className="mt-2 flex items-center gap-2 px-3 sm:px-4">
                      <Badge variant="outline" className="text-xs">
                        {examQuestion.topic_name}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {examQuestion.subject_title}
                      </Badge>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-center pt-4 sm:pt-6 pb-4">
            <Button
              variant="default"
              onClick={() => setShowEndExamDialog(true)}
              disabled={isSubmitting}
              className="min-w-48 text-white"
            >
              Submit Answers
            </Button>
          </div>
          <div className="h-20 md:h-8"></div>
        </div>
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
