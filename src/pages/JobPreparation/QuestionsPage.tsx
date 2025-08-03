import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ChevronLeft, Clock, CheckCircle, XCircle, AlertCircle, HelpCircle, Target, BookOpen, Trophy } from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';
import { AnswerResult, QuestionState } from '@/types/common';
import { Subtopic } from '@/types/jobPreparation';

const QuestionsPage: React.FC = () => {
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

  const { data: questionsData, isLoading: questionsLoading } = useQuery({
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
          <PaginationContent>
            {hasPrevious && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}

            {pageNumbers.map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => handlePageChange(pageNum)}
                  isActive={currentPage === pageNum}
                  className="cursor-pointer"
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            ))}

            {hasNext && (
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="cursor-pointer"
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pb-20">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hidden md:block lg:block">
            <span>Job Preparation</span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={handleBack}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <h2 className="text-lg md:text-lg font-semibold text-gray-800 dark:text-white">
                  Questions (Practice Mode)
                  {selectedSubtopic && (
                    <span className="text-blue-600 ml-2">- {selectedSubtopic.subtopic_name}</span>
                  )}
                </h2>
              </div>
              <Button className='hidden md:block'
                onClick={handleModeToggle}
                variant="outline"
              >
                Switch to Reading
              </Button>
            </div>

            <Button className='mb-4 md:hidden block lg:hidden'
              onClick={handleModeToggle}
              variant="outline"
            >
              Switch to Reading
            </Button>

            {subtopicsData && subtopicsData.results.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Filter by Subtopic
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div
                    className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium cursor-pointer transition-all hover:scale-105 ${selectedSubtopicId === null
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    onClick={handleShowAllQuestions}
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    <span>All Questions</span>
                  </div>
                  {subtopicsData.results.map((subtopic) => (
                    subtopic.total_questions > 0 && (
                      <div
                        key={subtopic.uid}
                        className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium cursor-pointer transition-all hover:scale-105 ${selectedSubtopicId === subtopic.uid
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`}
                        onClick={() => handleSubtopicClick(subtopic)}
                      >
                        <HelpCircle className="h-4 w-4 mr-2" />
                        <span>{subtopic.subtopic_name}</span>
                        <Badge
                          variant="secondary"
                          className="ml-2 text-xs bg-white/20 text-current border-none"
                        >
                          {subtopic.total_questions}
                        </Badge>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {questionsLoading ? (
              <div className="text-center py-8">Loading questions...</div>
            ) : (
              <>
                <div className="space-y-6">
                  {questionsData?.results.map((question) => {
                    const questionState = questionStates[question.uid];
                    const isAnswered = questionState?.isAnswered;
                    const showResult = questionState?.showResult;
                    const selectedOption = questionState?.selectedOption;
                    const result = questionState?.result;

                    return (
                      <Card key={question.uid}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className='text-lg md:text-lg'>Question #{question.question_number}</span>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              {isAnswered && (
                                <Badge variant={result?.is_correct ? "default" : "destructive"}>
                                  {result?.is_correct ? 'Correct' : 'Incorrect'}
                                </Badge>
                              )}
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4 text-lg">{question.question_text}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {question.options.map((option) => {
                              let optionClassName = 'p-3 border rounded-lg transition-colors ';

                              if (selectedOption === option.option_label) {
                                if (isAnswered) {
                                  if (result?.is_correct && option.option_label === result.correct_option_label) {
                                    optionClassName += 'bg-green-50 border-green-300 dark:bg-green-900/20';
                                  } else if (!result?.is_correct && option.option_label === selectedOption) {
                                    optionClassName += 'bg-red-50 border-red-300 dark:bg-red-900/20';
                                  }
                                } else {
                                  optionClassName += 'bg-blue-50 border-blue-300 dark:bg-blue-900/20';
                                }
                              } else if (isAnswered && showResult && option.option_label === result?.correct_option_label) {
                                optionClassName += 'bg-green-50 border-green-300 dark:bg-green-900/20';
                              } else {
                                optionClassName += 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer';
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
                                    <span>
                                      <span className="font-medium">{option.option_label}</span> {option.option_text}
                                    </span>
                                    {isAnswered && showResult && (
                                      <>
                                        {option.option_label === result?.correct_option_label && (
                                          <CheckCircle className="h-5 w-5 text-green-600" />
                                        )}
                                        {option.option_label === selectedOption && !result?.is_correct && (
                                          <XCircle className="h-5 w-5 text-red-600" />
                                        )}
                                      </>
                                    )}
                                    {selectedOption === option.option_label && !isAnswered && (
                                      <AlertCircle className="h-5 w-5 text-blue-600" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {isAnswered && showResult && result && (
                            <>
                              {result.explanation && (
                                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <HelpCircle className="h-5 w-5 text-blue-600" />
                                    <span className="font-semibold text-blue-800 dark:text-blue-200">Explanation:</span>
                                  </div>
                                  <p className="text-blue-700 dark:text-blue-300">
                                    {result.explanation}
                                  </p>
                                </div>
                              )}
                            </>
                          )}

                          {question.negative_marks > 0 && (
                            <p className="mt-3 text-sm text-red-600">
                              Negative marks: {question.negative_marks}
                            </p>
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
        </div>
      </main>

      {progressStats.total > 0 && (
        <div className="fixed bottom-3 right-3 z-50">
          <Card className="bg-white/95 backdrop-blur-sm dark:bg-gray-900/95 shadow-xl border-2">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Progress</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {progressStats.accuracy}% accuracy
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Answered:</span>
                  <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20">
                    {progressStats.total}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 dark:text-green-400">Correct:</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    {progressStats.correct}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-600 dark:text-red-400">Incorrect:</span>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                    {progressStats.incorrect}
                  </Badge>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>Accuracy</span>
                    <span>{progressStats.accuracy}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressStats.accuracy}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default QuestionsPage;
