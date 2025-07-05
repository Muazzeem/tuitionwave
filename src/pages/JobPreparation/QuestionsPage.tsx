import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ChevronLeft, Clock, CheckCircle, XCircle, AlertCircle, HelpCircle, Target, BookOpen } from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';
import { AnswerResult, QuestionState } from '@/types/common';
import { Subtopic } from '@/types/jobPreparation';

const QuestionsPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [questionStates, setQuestionStates] = useState<QuestionState>({});
  const { categoryId, subjectId, topicId, subtopicId } = params;

  // Reset question states when changing topics or pages
  useEffect(() => {
    setQuestionStates({});
  }, [topicId, currentPage]);

  // Calculate progress statistics
  const progressStats = React.useMemo(() => {
    const answered = Object.values(questionStates).filter(state => state?.isAnswered);
    const correct = answered.filter(state => state?.result?.is_correct);
    const incorrect = answered.filter(state => state?.result && !state.result.is_correct);
    
    return {
      total: answered.length,
      correct: correct.length,
      incorrect: incorrect.length,
    };
  }, [questionStates]);

  // Get questions - always use topic UID for questions
  const { data: questionsData, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions', topicId, currentPage],
    queryFn: () => JobPreparationService.getQuestions(topicId!, currentPage),
    enabled: !!topicId,
  });

  // Get subtopics for this topic to display them
  const { data: subtopicsData } = useQuery({
    queryKey: ['subtopics', topicId],
    queryFn: () => JobPreparationService.getSubtopics(topicId!, 1),
    enabled: !!topicId,
  });

  const { data: categoryData } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const categories = await JobPreparationService.getCategories(1);
      return categories.results.find(cat => cat.uid === categoryId);
    },
    enabled: !!categoryId,
  });

  const { data: subjectData } = useQuery({
    queryKey: ['subject', subjectId],
    queryFn: async () => {
      const subjects = await JobPreparationService.getSubjects(categoryId!, 1);
      return subjects.results.find(sub => sub.uid === subjectId);
    },
    enabled: !!subjectId && !!categoryId,
  });

  const { data: topicData } = useQuery({
    queryKey: ['topic', topicId],
    queryFn: async () => {
      const topics = await JobPreparationService.getTopics(subjectId!, 1);
      return topics.results.find(topic => topic.uid === topicId);
    },
    enabled: !!topicId && !!subjectId,
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
    navigate(`/job-preparation/category/${categoryId}/subject/${subjectId}/topic/${topicId}/subtopic/${subtopic.uid}`);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900 pb-20">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hidden md:block lg:block">
            <span>Job Preparation</span>
            {categoryData && (
              <>
                <span>/</span>
                <span>{categoryData.category_name}</span>
              </>
            )}
            {subjectData && (
              <>
                <span>/</span>
                <span>{subjectData.subject_title}</span>
              </>
            )}
            {topicData && (
              <>
                <span>/</span>
                <span>{topicData.topic_name}</span>
                <span>/</span>
                <span>Practice Mode</span>
              </>
            )}
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={handleBack}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <h2 className="text-lg md:text-2xl font-semibold text-gray-800 dark:text-white">
                  Questions (Practice Mode)
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

            {/* Show subtopics if available */}
            {subtopicsData && subtopicsData.results.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Available Subtopics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subtopicsData.results.map((subtopic) => (
                    <Card 
                      key={subtopic.uid} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleSubtopicClick(subtopic)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center space-x-2 text-base">
                          <HelpCircle className="h-4 w-4 text-purple-600" />
                          <span>{subtopic.subtopic_name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Badge variant="outline" className="text-xs">
                          {subtopic.total_questions} Questions
                        </Badge>
                      </CardContent>
                    </Card>
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
                            <span className='text-lg md:text-2xl'>Question #{question.question_number}</span>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{question.time_limit_seconds}s</span>
                              <Badge variant="outline">
                                {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                              </Badge>
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

                          {isAnswered && (
                            <div className="mt-4 flex items-center space-x-2">
                              <Button 
                                variant="outline"
                                onClick={() => handleShowAnswer(question.uid)}
                              >
                                {showResult ? 'Hide Result' : 'Show Result'}
                              </Button>
                            </div>
                          )}
                          
                          {isAnswered && showResult && result && (
                            <>
                              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                  <span className="font-semibold text-green-800 dark:text-green-200">Correct Answer:</span>
                                </div>
                                <p className="text-green-700 dark:text-green-300">
                                  {result.correct_option_label} {result.correct_option_text}
                                </p>
                              </div>
                              
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
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="bg-white dark:bg-gray-800 shadow-lg border-2">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-sm">Progress</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total:</span>
                  <Badge variant="outline" className="text-xs">{progressStats.total}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-600">Correct:</span>
                  <Badge variant="default" className="bg-green-600 text-xs">{progressStats.correct}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-600">Incorrect:</span>
                  <Badge variant="destructive" className="text-xs">{progressStats.incorrect}</Badge>
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
