
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, CheckCircle, XCircle, Target, BookOpen, Trophy, RefreshCw, TrendingUp, Brain } from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';
import { AnswerResult, QuestionState } from '@/types/common';
import { Subtopic } from '@/types/jobPreparation';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import TutorPagination from '@/components/FindTutors/TutorPagination';
import QuestionCard from '@/components/JobPreparation/QuestionCard';
import SubtopicFilters from '@/components/JobPreparation/SubtopicFilters';

const QuestionsPage: React.FC = () => {
  const { userProfile } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [questionStates, setQuestionStates] = useState<QuestionState>({});
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { categoryId, subjectId, topicId, subtopicId } = params;

  // Reset question states when changing topics, pages, or subtopics
  useEffect(() => {
    setQuestionStates({});
  }, [topicId, currentPage, selectedSubtopicId]);

  const progressStats = React.useMemo(() => {
    const answered = Object.values(questionStates).filter(state => state?.isAnswered);
    const correct = answered.filter(state => state?.result?.is_correct);
    const incorrect = answered.filter(state => state?.result && !state.result.is_correct);
    const accuracy = answered.length > 0 ? Math.round((correct.length / answered.length) * 100) : 0;

    return {
      total: answered.length,
      correct: correct.length,
      incorrect: incorrect.length,
      accuracy,
    };
  }, [questionStates]);

  const { data: questionsData, isLoading: questionsLoading, refetch } = useQuery({
    queryKey: ['questions', selectedSubtopicId || topicId, currentPage, selectedSubtopicId ? 'subtopic' : 'topic'],
    queryFn: () => {
      if (selectedSubtopicId) {
        return JobPreparationService.getQuestionsBySubtopic(selectedSubtopicId, currentPage);
      }
      return JobPreparationService.getQuestions(topicId!, currentPage);
    },
    enabled: !!(selectedSubtopicId || topicId),
  });

  const { data: subtopicsData } = useQuery({
    queryKey: ['subtopics', topicId],
    queryFn: () => JobPreparationService.getSubtopics(topicId!, 1),
    enabled: !!topicId,
  });

  const checkAnswerMutation = useMutation({
    mutationFn: async ({ questionId, selectedOptionLabel }: { questionId: string; selectedOptionLabel: string }) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/practice/check-answer/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question_id: questionId,
          selected_option_label: selectedOptionLabel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to check answer');
      }

      return response.json() as Promise<AnswerResult>;
    },
    onSuccess: (result, variables) => {
      setQuestionStates(prev => ({
        ...prev,
        [variables.questionId]: {
          ...prev[variables.questionId],
          result,
          showResult: true,
          isAnswered: true,
        }
      }));
    },
  });

  const handleOptionSelect = (questionUid: string, optionLabel: string) => {
    setQuestionStates(prev => {
      const currentState = prev[questionUid];

      if (currentState?.isAnswered) return prev;

      const updatedState = {
        ...currentState,
        selectedOption: optionLabel,
        isAnswered: false,
        showResult: false,
      };

      setTimeout(() => {
        handleSubmitAnswer(questionUid, optionLabel);
      }, 300);

      return {
        ...prev,
        [questionUid]: updatedState,
      };
    });
  };

  const handleSubmitAnswer = (questionUid: string, optionLabel?: string) => {
    const currentState = questionStates[questionUid];
    const selectedOption = optionLabel || currentState?.selectedOption;

    if (!selectedOption || currentState?.isAnswered) return;

    checkAnswerMutation.mutate({
      questionId: questionUid,
      selectedOptionLabel: selectedOption,
    });
  };

  const handleSubtopicClick = (subtopic: Subtopic) => {
    setSelectedSubtopicId(subtopic.uid);
    setCurrentPage(1);
    setShowMobileFilters(false);
    const newSearchParams = new URLSearchParams();
    setSearchParams(newSearchParams);
  };

  const handleShowAllQuestions = () => {
    setSelectedSubtopicId(null);
    setCurrentPage(1);
    setShowMobileFilters(false);
    const newSearchParams = new URLSearchParams();
    setSearchParams(newSearchParams);
  };

  const handleBack = () => {
    if (subtopicId === 'direct') {
      navigate(`/job-preparation/category/${categoryId}/subject/${subjectId}`);
    } else {
      navigate(`/job-preparation/category/${categoryId}/subject/${subjectId}/topic/${topicId}`);
    }
  };

  const handleModeToggle = () => {
    navigate(`/job-preparation/category/${categoryId}/subject/${subjectId}/topic/${topicId}/subtopic/${subtopicId || 'direct'}/reading`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newSearchParams = new URLSearchParams();
    if (page > 1) newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRefresh = () => {
    setQuestionStates({});
    refetch();
  };

  const selectedSubtopic = selectedSubtopicId
    ? subtopicsData?.results.find(sub => sub.uid === selectedSubtopicId)
    : null;

  const LoadingSkeleton = () => (
    <div className="space-y-4 px-1 sm:px-0">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="grid grid-cols-1 gap-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex-1 overflow-auto dark:bg-gray-900 h-screen bg-gray-50 w-full">
      {userProfile ? <DashboardHeader userName="BCS Candidate" /> : <Header />}

      <ScrollArea type="always" style={{ height: userProfile ? 'calc(100vh - 80px)' : 'calc(109vh - 160px)' }}>
        <main className="flex-1 pb-6">
          <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-4 sm:mb-6 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Link to="/job-preparation/questions">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Job Preparation</span>
              </Link>
              <span>/</span>
              <span className="text-blue-600 font-medium">Practice Questions</span>
            </div>

            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Back to Topic</span>
                    </Button>
                    <div>
                      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Brain className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600" />
                        Practice Questions
                      </h1>
                      {selectedSubtopic ? (
                        <p className="text-blue-600 font-medium text-sm flex items-center">
                          <Target className="h-4 w-4 mr-1" />
                          <span className="truncate">{selectedSubtopic.subtopic_name}</span>
                        </p>
                      ) : (
                        <p className="text-blue-600 font-medium text-sm flex items-center">
                          <BookOpen className="h-4 w-4 mr-1" />
                          All Questions
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleRefresh}
                      variant="outline"
                      size="sm"
                      className="border-blue-200 text-blue-700 dark:border-blue-700 dark:text-blue-300"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Reset</span>
                    </Button>
                    <Button
                      onClick={handleModeToggle}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <BookOpen className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Reading</span>
                    </Button>
                  </div>
                </div>

                {/* Progress Stats for Mobile */}
                {progressStats.total > 0 && (
                  <div className="sm:hidden bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                      <span className="text-sm font-bold text-blue-600">{progressStats.accuracy}%</span>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span className="text-green-600">✓ {progressStats.correct}</span>
                      <span className="text-red-600">✗ {progressStats.incorrect}</span>
                      <span className="text-gray-600">Total: {progressStats.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressStats.accuracy}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Subtopic Filters */}
            {subtopicsData && (
              <SubtopicFilters
                subtopics={subtopicsData.results}
                selectedSubtopicId={selectedSubtopicId}
                totalQuestions={questionsData?.count || 0}
                onSubtopicSelect={handleSubtopicClick}
                onShowAll={handleShowAllQuestions}
                showMobileFilters={showMobileFilters}
                onToggleMobileFilters={() => setShowMobileFilters(!showMobileFilters)}
              />
            )}

            {/* Questions */}
            {questionsLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <div className="space-y-3 sm:space-y-4 px-1 sm:px-0">
                    {questionsData?.results.map((question, index) => {
                    const questionState = questionStates[question.uid];
                    const isAnswered = questionState?.isAnswered;
                    const showResult = questionState?.showResult;
                    const selectedOption = questionState?.selectedOption;
                    const result = questionState?.result;
                      const questionNumber = (currentPage - 1) * 20 + (index + 1);

                    return (
                      <QuestionCard
                        key={question.uid}
                        question={question}
                        isAnswered={isAnswered}
                        showResult={showResult}
                        selectedOption={selectedOption}
                        result={result}
                        questionNumber={questionNumber}
                        onOptionSelect={handleOptionSelect}
                        mode="practice"
                      />
                    );
                  })}
                </div>

                {questionsData && (
                  <>
                      {!userProfile ? (
                        <div className="mb-4 p-4 bg-red-100 text-yellow-800 rounded mt-5 text-center">
                          <span className="text-md">
                            Please log in to access all the questions.
                          </span>
                        </div>
                      ) : (
                        <TutorPagination
                          currentPage={currentPage}
                          totalPages={Math.ceil(questionsData.count / 20)}
                          onPageChange={handlePageChange}
                          hasNext={!!questionsData.next}
                          hasPrevious={!!questionsData.previous}
                        />
                      )}
                  </>
                )}
              </>
            )}
          </div>
          <div className="h-20 md:h-8"></div>
        </main>

        {/* Desktop Progress Card */}
        {progressStats.total > 0 && (
          <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
            <Card className="bg-white/95 backdrop-blur-lg dark:bg-gray-900/95 shadow-2xl border-0 w-72">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      Progress
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {progressStats.accuracy}% accuracy
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Answered
                    </span>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 font-bold">
                      {progressStats.total}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Correct
                    </span>
                    <Badge className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 font-bold">
                      {progressStats.correct}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      Incorrect
                    </span>
                    <Badge className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 font-bold">
                      {progressStats.incorrect}
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                      <span>Accuracy Rate</span>
                      <span>{progressStats.accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressStats.accuracy}%` }}
                      />
                    </div>
                    {progressStats.accuracy >= 80 && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-medium">
                        🎉 Excellent performance!
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {!userProfile && <Footer />}
      </ScrollArea>
    </div>
  );
};

export default QuestionsPage;
