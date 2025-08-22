
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, CheckCircle, XCircle, AlertCircle, HelpCircle, Target, BookOpen, Trophy, RefreshCw, TrendingUp, Brain, Star, Menu, X } from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';
import { AnswerResult, QuestionState } from '@/types/common';
import { Subtopic } from '@/types/jobPreparation';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import TutorPagination from '@/components/FindTutors/TutorPagination';

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

  // Get currently selected subtopic data for display
  const selectedSubtopic = selectedSubtopicId
    ? subtopicsData?.results.find(sub => sub.uid === selectedSubtopicId)
    : null;

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-3 bg-muted rounded w-full"></div>
            <div className="grid grid-cols-1 gap-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-8 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const SubtopicFilters = () => (
    <div className="flex flex-wrap gap-2">
      <button
        className={`inline-flex items-center px-2 py-1.5 rounded-md text-xs font-medium transition-all ${selectedSubtopicId === null
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          }`}
        onClick={handleShowAllQuestions}
      >
        <Star className="h-3 w-3 mr-1" />
        <span className="hidden sm:inline">All Questions</span>
        <span className="sm:hidden">All</span>
        <Badge className="ml-1 bg-white/20 text-current border-none text-xs">
          {questionsData?.count || 0}
        </Badge>
      </button>
      {subtopicsData?.results.map((subtopic) => (
        subtopic.total_questions > 0 && (
          <button
            key={subtopic.uid}
            className={`inline-flex items-center px-2 py-1.5 rounded-md text-xs font-medium transition-all ${selectedSubtopicId === subtopic.uid
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            onClick={() => handleSubtopicClick(subtopic)}
          >
            <HelpCircle className="h-3 w-3 mr-1" />
            <span className="truncate max-w-24 sm:max-w-32">{subtopic.subtopic_name}</span>
            <Badge className="ml-1 bg-white/20 text-current border-none text-xs">
              {subtopic.total_questions}
            </Badge>
          </button>
        )
      ))}
    </div>
  );

  return (
    <div className="flex-1 overflow-auto bg-background h-screen w-full">
      {userProfile ? <DashboardHeader userName="BCS Candidate" /> : <Header />}

      <ScrollArea type="always" style={{ height: userProfile ? 'calc(100vh - 80px)' : 'calc(100vh - 160px)' }}>
        <main className="flex-1 pb-4">
          <div className="p-2 sm:p-4 max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-3 flex items-center space-x-2 text-xs text-muted-foreground">
              <span className="hover:text-primary cursor-pointer transition-colors">Job Preparation</span>
              <span>/</span>
              <span className="text-primary font-medium">Practice Questions</span>
            </div>

            {/* Header Section */}
            <div className="mb-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBack}
                      className="flex-shrink-0"
                    >
                      <ChevronLeft className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">Back</span>
                    </Button>
                    <div className="min-w-0 flex-1">
                      <h1 className="text-lg sm:text-xl font-bold text-foreground flex items-center">
                        <Brain className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                        <span className="truncate">Practice Questions</span>
                      </h1>
                      {selectedSubtopic ? (
                        <p className="text-primary font-medium text-xs flex items-center">
                          <Target className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{selectedSubtopic.subtopic_name}</span>
                        </p>
                      ) : (
                        <p className="text-primary font-medium text-xs flex items-center">
                          <BookOpen className="h-3 w-3 mr-1 flex-shrink-0" />
                          All Questions
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      onClick={handleRefresh}
                      variant="outline"
                      size="sm"
                      className="px-2"
                    >
                      <RefreshCw className="h-3 w-3" />
                      <span className="hidden sm:inline ml-1">Reset</span>
                    </Button>
                    <Button
                      onClick={handleModeToggle}
                      size="sm"
                      className="px-2"
                    >
                      <BookOpen className="h-3 w-3" />
                      <span className="hidden sm:inline ml-1">Reading</span>
                    </Button>
                  </div>
                </div>

                {/* Progress Stats for Mobile */}
                {progressStats.total > 0 && (
                  <div className="sm:hidden bg-card rounded-lg p-2 shadow-sm border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground">Progress</span>
                      <span className="text-xs font-bold text-primary">{progressStats.accuracy}%</span>
                    </div>
                    <div className="flex gap-3 text-xs">
                      <span className="text-green-600">✓ {progressStats.correct}</span>
                      <span className="text-red-600">✗ {progressStats.incorrect}</span>
                      <span className="text-muted-foreground">Total: {progressStats.total}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                      <div
                        className="bg-gradient-to-r from-green-500 to-primary h-full rounded-full transition-all duration-500"
                        style={{ width: `${progressStats.accuracy}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Subtopic Filters */}
            {subtopicsData && subtopicsData.results.length > 0 && (
              <div className="mb-4">
                {/* Mobile Filter Toggle */}
                <div className="sm:hidden mb-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="w-full justify-between"
                  >
                    <span className="text-xs">Filter by Subtopic</span>
                    {showMobileFilters ? <X className="h-3 w-3" /> : <Menu className="h-3 w-3" />}
                  </Button>
                </div>

                {/* Filters */}
                <div className={`${showMobileFilters ? 'block' : 'hidden'} sm:block`}>
                  <Card className="border-0 shadow-sm bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-3">
                      <SubtopicFilters />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Questions */}
            {questionsLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <div className="space-y-3">
                  {questionsData?.results.map((question, index) => {
                    const questionState = questionStates[question.uid];
                    const isAnswered = questionState?.isAnswered;
                    const showResult = questionState?.showResult;
                    const selectedOption = questionState?.selectedOption;
                    const result = questionState?.result;

                    return (
                      <Card
                        key={question.uid}
                        className="border-0 shadow-sm bg-card overflow-hidden transition-all duration-300 hover:shadow-md"
                      >
                        <CardHeader className="bg-muted/30 border-b p-3">
                          <CardTitle className="flex items-start justify-between gap-2">
                            <div className="flex items-start space-x-2 min-w-0 flex-1">
                              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs flex-shrink-0">
                                {question.question_number}
                              </div>
                              <span className="text-sm leading-relaxed text-foreground">
                                {question.question_text}
                              </span>
                            </div>
                            {isAnswered && (
                              <Badge
                                variant={result?.is_correct ? "default" : "destructive"}
                                className={`${result?.is_correct
                                  ? 'bg-green-100 text-green-800 border-green-300'
                                  : 'bg-red-100 text-red-800 border-red-300'
                                  } px-1.5 py-0.5 text-xs flex-shrink-0`}
                              >
                                {result?.is_correct ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    <span className="hidden sm:inline">Correct</span>
                                    <span className="sm:hidden">✓</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-3 w-3 mr-1" />
                                    <span className="hidden sm:inline">Incorrect</span>
                                    <span className="sm:hidden">✗</span>
                                  </>
                                )}
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="p-3">
                          {question.image && (
                            <div className="mb-3 rounded-md overflow-hidden">
                              <img
                                src={question.image}
                                alt="Question illustration"
                                className="w-full max-h-40 object-contain"
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            {question.options.map((option) => {
                              let optionClassName = 'p-2 border rounded-md cursor-pointer transition-all duration-200';

                              if (selectedOption === option.option_label) {
                                if (isAnswered) {
                                  if (result?.is_correct && option.option_label === result.correct_option_label) {
                                    optionClassName += ' bg-green-50 border-green-300 text-green-800';
                                  } else if (!result?.is_correct && option.option_label === selectedOption) {
                                    optionClassName += ' bg-red-50 border-red-300 text-red-800';
                                  }
                                } else {
                                  optionClassName += ' bg-primary/10 border-primary text-primary';
                                }
                              } else if (isAnswered && showResult && option.option_label === result?.correct_option_label) {
                                optionClassName += ' bg-green-50 border-green-300 text-green-800';
                              } else {
                                optionClassName += ' bg-muted/50 border-border hover:bg-accent hover:text-accent-foreground';
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
                                    <div className="flex items-start space-x-2 min-w-0 flex-1">
                                      <div className="w-5 h-5 bg-background rounded-full flex items-center justify-center font-bold text-foreground shadow-sm text-xs flex-shrink-0">
                                        {option.option_label}
                                      </div>
                                      <span className="text-sm leading-relaxed">
                                        {option.option_text}
                                      </span>
                                    </div>
                                    {isAnswered && showResult && (
                                      <>
                                        {option.option_label === result?.correct_option_label && (
                                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                                        )}
                                        {option.option_label === selectedOption && !result?.is_correct && (
                                          <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                                        )}
                                      </>
                                    )}
                                    {selectedOption === option.option_label && !isAnswered && (
                                      <div className="animate-pulse flex-shrink-0">
                                        <AlertCircle className="h-4 w-4 text-primary" />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {isAnswered && showResult && result && result.explanation && (
                            <div className="mt-3 p-2 bg-primary/10 rounded-md border-l-4 border-primary">
                              <div className="flex items-start space-x-2">
                                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                  <HelpCircle className="h-3 w-3 text-primary-foreground" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="font-semibold text-primary mb-1 text-xs">
                                    Explanation
                                  </h4>
                                  <p className="text-primary/80 text-sm leading-relaxed">
                                    {result.explanation}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {question.negative_marks > 0 && (
                            <div className="mt-2 flex items-center space-x-2 text-orange-600">
                              <AlertCircle className="h-3 w-3 flex-shrink-0" />
                              <span className="text-xs font-medium">
                                Negative marks: {question.negative_marks}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {questionsData && (
                  <>
                    {!userProfile && (
                      <div className="mb-3 p-3 bg-destructive/10 text-destructive rounded-md mt-4">
                        <span className="text-sm">
                          Please log in to access all the questions.
                        </span>
                      </div>
                    )}

                    <TutorPagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(questionsData.count / 20)}
                      onPageChange={handlePageChange}
                      hasNext={!!questionsData.next}
                      hasPrevious={!!questionsData.previous}
                    />
                  </>
                )}
              </>
            )}
          </div>
        </main>

        {/* Desktop Progress Card */}
        {progressStats.total > 0 && (
          <div className="fixed bottom-4 right-4 z-50 hidden lg:block">
            <Card className="bg-card/95 backdrop-blur-lg shadow-xl border w-64">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground">
                      Progress
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {progressStats.accuracy}% accuracy
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-purple-50 rounded-md">
                    <span className="text-xs font-medium text-purple-700">
                      Answered
                    </span>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 font-bold text-xs">
                      {progressStats.total}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                    <span className="text-xs font-medium text-green-700 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Correct
                    </span>
                    <Badge className="bg-green-100 text-green-800 border-green-300 font-bold text-xs">
                      {progressStats.correct}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                    <span className="text-xs font-medium text-red-700 flex items-center">
                      <XCircle className="h-3 w-3 mr-1" />
                      Incorrect
                    </span>
                    <Badge className="bg-red-100 text-red-800 border-red-300 font-bold text-xs">
                      {progressStats.incorrect}
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs font-medium text-muted-foreground mb-1">
                      <span>Accuracy Rate</span>
                      <span>{progressStats.accuracy}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-primary h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressStats.accuracy}%` }}
                      />
                    </div>
                    {progressStats.accuracy >= 80 && (
                      <p className="text-xs text-green-600 mt-1 font-medium">
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
        <div className="h-16 sm:h-8"></div>
      </ScrollArea>
    </div>
  );
};

export default QuestionsPage;
