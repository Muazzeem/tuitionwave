import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ChevronLeft, CheckCircle, XCircle, AlertCircle, HelpCircle, Target, BookOpen, Trophy, RefreshCw, TrendingUp, Brain, Star } from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';
import { AnswerResult, QuestionState } from '@/types/common';
import { Subtopic } from '@/types/jobPreparation';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';

const QuestionsPage: React.FC = () => {
  const { userProfile } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [questionStates, setQuestionStates] = useState<QuestionState>({});
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string | null>(null);
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

  // Get subtopics for this topic to display them
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

  const handleShowAnswer = (questionUid: string) => {
    setQuestionStates(prev => ({
      ...prev,
      [questionUid]: {
        ...prev[questionUid],
        showResult: !prev[questionUid]?.showResult,
      }
    }));
  };

  const handleSubtopicClick = (subtopic: Subtopic) => {
    setSelectedSubtopicId(subtopic.uid);
    setCurrentPage(1);
    const newSearchParams = new URLSearchParams();
    setSearchParams(newSearchParams);
  };

  const handleShowAllQuestions = () => {
    setSelectedSubtopicId(null);
    setCurrentPage(1);
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
  };

  const handleRefresh = () => {
    setQuestionStates({});
    refetch();
  };

  const renderPagination = (count: number, hasNext: boolean, hasPrevious: boolean) => {
    const totalPages = Math.ceil(count / 20);

    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages: number[] = [];
      const maxVisiblePages = 5;

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }

      return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
            {hasPrevious && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                />
              </PaginationItem>
            )}

            {pageNumbers.map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => handlePageChange(pageNum)}
                  isActive={currentPage === pageNum}
                  className={`cursor-pointer transition-all ${currentPage === pageNum
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }`}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}

            {hasNext && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  // Get currently selected subtopic data for display
  const selectedSubtopic = selectedSubtopicId
    ? subtopicsData?.results.find(sub => sub.uid === selectedSubtopicId)
    : null;

  const LoadingSkeleton = () => (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex-1 overflow-auto dark:bg-gray-900 h-screen bg-gray-50 w-full">
      {userProfile ? <DashboardHeader userName="BCS Candidate" /> :
        <Header />
      }
      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <main className="flex-1 pb-20">
          <div className="p-6">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Job Preparation</span>
              <span>/</span>
              <span className="text-blue-600 font-medium">Practice Questions</span>
            </div>

            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Back to Topics
                  </Button>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                      <Brain className="h-8 w-8 mr-3 text-blue-600" />
                      Practice Questions
                    </h1>
                    {selectedSubtopic ? (
                      <p className="text-blue-600 font-medium mt-1 flex items-center">
                        <Target className="h-4 w-4 mr-1" />
                        {selectedSubtopic.subtopic_name}
                      </p>
                    ) : <p className='text-blue-600 font-medium mt-1 flex items-center'>
                      <BookOpen className="h-4 w-4 mr-1" />
                      All Questions
                    </p>
                    }
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset Progress
                  </Button>
                  <Button
                    onClick={handleModeToggle}
                    className="bg-gradient-to-r from-blue-600 to-primary-600 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Switch to Reading
                  </Button>
                </div>
              </div>
            </div>

            {/* Subtopic Filter Section */}
            {subtopicsData && subtopicsData.results.length > 0 && (
              <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg font-semibold text-gray-800 dark:text-white">
                    <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                    Filter by Subtopic
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    <button
                      className={`inline-flex items-center px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 transform hover:scale-105 ${selectedSubtopicId === null
                        ? 'bg-gradient-to-r from-blue-600 to-primary-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      onClick={handleShowAllQuestions}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      <span>All Questions</span>
                      <Badge className="ml-2 bg-white/20 text-current border-none">
                        {questionsData?.count || 0}
                      </Badge>
                    </button>
                    {subtopicsData.results.map((subtopic) => (
                      subtopic.total_questions > 0 && (
                        <button
                          key={subtopic.uid}
                          className={`inline-flex items-center px-4 py-3 rounded-xl text-sm font-medium cursor-pointer ${selectedSubtopicId === subtopic.uid
                            ? 'bg-gradient-to-r from-blue-600 to-primary-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          onClick={() => handleSubtopicClick(subtopic)}
                        >
                          <HelpCircle className="h-4 w-4 mr-2" />
                          <span>{subtopic.subtopic_name}</span>
                          <Badge className="ml-2 bg-white/20 text-current border-none">
                            {subtopic.total_questions}
                          </Badge>
                        </button>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            {questionsLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                  <div className="space-y-8">
                    {questionsData?.results.map((question, index) => {
                      const questionState = questionStates[question.uid];
                      const isAnswered = questionState?.isAnswered;
                      const showResult = questionState?.showResult;
                      const selectedOption = questionState?.selectedOption;
                      const result = questionState?.result;

                      return (
                        <Card
                          key={question.uid}
                          className="border-0 shadow-xl bg-white dark:bg-background overflow-hidden transition-all duration-300 hover:shadow-2xl"
                        >
                          <CardHeader className="bg-gradient-to-r from-primary-600/30 to-blue-600/30 border-b p-4">
                            <CardTitle className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base lg:text-lg">
                                  {question.question_number}
                                </div>
                                <span className="mr-2 text-sm sm:text-sm md:text-base lg:text-lg">
                                  {question.question_text}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {isAnswered && (
                                  <Badge
                                    variant={result?.is_correct ? "default" : "destructive"}
                                    className={`${result?.is_correct
                                      ? 'bg-green-100 text-green-800 border-green-300'
                                      : 'bg-red-100 text-red-800 border-red-300'
                                      } px-3 py-1 font-medium`}
                                  >
                                    {result?.is_correct ? (
                                      <>
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Correct
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Incorrect
                                      </>
                                    )}
                                  </Badge>
                                )}
                                {/* {isAnswered && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleShowAnswer(question.uid)}
                                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                  >
                                    {showResult ? (
                                      <>
                                        <EyeOff className="h-4 w-4 mr-1" />
                                        Hide Answer
                                      </>
                                    ) : (
                                      <>
                                        <Eye className="h-4 w-4 mr-1" />
                                        Show Answer
                                      </>
                                    )}
                                  </Button>
                                )} */}
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-5">
                            <div className="mb-0">
                              <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">

                              </p>
                              {question.image && (
                                <div className="mt-4 rounded-lg overflow-hidden">
                                  <img
                                    src={question.image}
                                    alt="Question illustration"
                                    className="w-full max-h-48 object-contain mb-3"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {question.options.map((option) => {
                                let optionClassName = 'p-2 border-2 rounded-xl cursor-pointer';

                                if (selectedOption === option.option_label) {
                                  if (isAnswered) {
                                    if (result?.is_correct && option.option_label === result.correct_option_label) {
                                      optionClassName += 'bg-gradient-to-r from-green-50 to-green-100 border-green-400 shadow-lg dark:from-green-900/20 dark:to-green-800/20';
                                    } else if (!result?.is_correct && option.option_label === selectedOption) {
                                      optionClassName += 'bg-gradient-to-r from-red-50 to-red-100 border-red-400 shadow-lg dark:from-red-900/20 dark:to-red-800/20';
                                    }
                                  } else {
                                    optionClassName += 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-400 shadow-lg dark:from-blue-900/20 dark:to-blue-800/20';
                                  }
                                } else if (isAnswered && showResult && option.option_label === result?.correct_option_label) {
                                  optionClassName += 'bg-gradient-to-r from-green-50 to-green-100 border-green-400 shadow-lg dark:from-green-900/20 dark:to-green-800/20';
                                } else {
                                  optionClassName += 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300';
                                }

                                return (
                                  <div
                                    key={option.uid}
                                    className={optionClassName}
                                    onClick={() => {
                                      if (!isAnswered) {
                                        handleOptionSelect(question.uid, option.option_label);
                                      }
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center font-bold text-gray-800 dark:text-white shadow-sm">
                                          {option.option_label}
                                        </div>
                                        <span className="text-gray-800 dark:text-gray-200 flex-1">
                                          {option.option_text}
                                        </span>
                                      </div>
                                      {isAnswered && showResult && (
                                        <>
                                          {option.option_label === result?.correct_option_label && (
                                            <CheckCircle className="h-6 w-6 text-green-600 ml-2" />
                                          )}
                                          {option.option_label === selectedOption && !result?.is_correct && (
                                            <XCircle className="h-6 w-6 text-red-600 ml-2" />
                                          )}
                                        </>
                                      )}
                                      {selectedOption === option.option_label && !isAnswered && (
                                        <div className="ml-2 animate-pulse">
                                          <AlertCircle className="h-6 w-6 text-blue-600" />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {isAnswered && showResult && result && result.explanation && (
                              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-l-4 border-blue-500">
                                <div className="flex items-start space-x-3">
                                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <HelpCircle className="h-4 w-4 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                                      Explanation
                                    </h4>
                                    <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                                      {result.explanation}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {question.negative_marks > 0 && (
                              <div className="mt-4 flex items-center space-x-2 text-orange-600 dark:text-orange-400">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  Negative marks: {question.negative_marks}
                                </span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
                {questionsData && renderPagination(
                  questionsData.count,
                  !!questionsData.next,
                  !!questionsData.previous
                )}
              </>
            )}
          </div>
        </main>

        {/* Enhanced Progress Card */}
        {progressStats.total > 0 && (
          <div className="fixed bottom-6 right-6 z-50 hidden md:block">
            <Card className="bg-white/95 backdrop-blur-lg dark:bg-gray-900/95 shadow-2xl border-0 w-80">
              <CardContent className="p-3">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      Progress Tracker
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {progressStats.accuracy}% accuracy rate
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total Answered
                    </span>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 font-bold">
                      {progressStats.total}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <span className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Correct
                    </span>
                    <Badge className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-300 font-bold">
                      {progressStats.correct}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" />
                      Incorrect
                    </span>
                    <Badge className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-300 font-bold">
                      {progressStats.incorrect}
                    </Badge>
                  </div>

                  {/* Enhanced Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      <span>Accuracy Rate</span>
                      <span>{progressStats.accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out shadow-lg"
                        style={{ width: `${progressStats.accuracy}%` }}
                      >
                        <div className="w-full h-full bg-white/20 rounded-full animate-pulse"></div>
                      </div>
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

        {userProfile ? '' : <Footer />}
      </ScrollArea>
    </div>
  );
}
export default QuestionsPage;