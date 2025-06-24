import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ChevronLeft, BookOpen, FileText, HelpCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';
import { Category, Subject, Topic, Question } from '@/types/jobPreparation';

type ViewType = 'categories' | 'subjects' | 'topics' | 'questions';

interface NavigationState {
  view: ViewType;
  categoryUid?: string;
  categoryName?: string;
  subjectUid?: string;
  subjectName?: string;
  topicUid?: string;
  topicName?: string;
}

const JobPreparationPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [navigationState, setNavigationState] = useState<NavigationState>({ view: 'categories' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isReadingMode, setIsReadingMode] = useState(false);

  // Initialize navigation state from URL params
  useEffect(() => {
    const { categoryId, subjectId, topicId } = params;
    const page = parseInt(searchParams.get('page') || '1');
    const readingMode = searchParams.get('mode') === 'reading';
    
    setCurrentPage(page);
    setIsReadingMode(readingMode);
    
    if (topicId && subjectId && categoryId) {
      setNavigationState({
        view: 'questions',
        categoryUid: categoryId,
        subjectUid: subjectId,
        topicUid: topicId,
      });
    } else if (subjectId && categoryId) {
      setNavigationState({
        view: 'topics',
        categoryUid: categoryId,
        subjectUid: subjectId,
      });
    } else if (categoryId) {
      setNavigationState({
        view: 'subjects',
        categoryUid: categoryId,
      });
    } else {
      setNavigationState({ view: 'categories' });
    }
  }, [params, searchParams]);

  // Reset page when view changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      updateUrlParams(1);
    }
  }, [navigationState.view, navigationState.categoryUid, navigationState.subjectUid, navigationState.topicUid]);

  const updateUrlParams = (page: number, readingMode?: boolean) => {
    const newSearchParams = new URLSearchParams();
    if (page > 1) newSearchParams.set('page', page.toString());
    if (readingMode !== undefined ? readingMode : isReadingMode) {
      newSearchParams.set('mode', 'reading');
    }
    setSearchParams(newSearchParams);
  };

  // Categories Query
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', currentPage],
    queryFn: () => JobPreparationService.getCategories(currentPage),
    enabled: navigationState.view === 'categories',
  });

  // Subjects Query
  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects', navigationState.categoryUid, currentPage],
    queryFn: () => JobPreparationService.getSubjects(navigationState.categoryUid!, currentPage),
    enabled: navigationState.view === 'subjects' && !!navigationState.categoryUid,
  });

  // Topics Query
  const { data: topicsData, isLoading: topicsLoading } = useQuery({
    queryKey: ['topics', navigationState.subjectUid, currentPage],
    queryFn: () => JobPreparationService.getTopics(navigationState.subjectUid!, currentPage),
    enabled: navigationState.view === 'topics' && !!navigationState.subjectUid,
  });

  // Questions Query (regular mode)
  const { data: questionsData, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions', navigationState.topicUid, currentPage],
    queryFn: () => JobPreparationService.getQuestions(navigationState.topicUid!, currentPage),
    enabled: navigationState.view === 'questions' && !!navigationState.topicUid && !isReadingMode,
  });

  // Questions Query (reading mode)
  const { data: readingQuestionsData, isLoading: readingQuestionsLoading } = useQuery({
    queryKey: ['questions-reading', navigationState.topicUid, currentPage],
    queryFn: () => JobPreparationService.getQuestionsReadingMode(navigationState.topicUid!, currentPage),
    enabled: navigationState.view === 'questions' && !!navigationState.topicUid && isReadingMode,
  });

  // Fetch additional data for breadcrumb names
  const { data: categoryData } = useQuery({
    queryKey: ['category', navigationState.categoryUid],
    queryFn: async () => {
      const categories = await JobPreparationService.getCategories(1);
      return categories.results.find(cat => cat.uid === navigationState.categoryUid);
    },
    enabled: !!navigationState.categoryUid && !navigationState.categoryName,
  });

  const { data: subjectData } = useQuery({
    queryKey: ['subject', navigationState.subjectUid],
    queryFn: async () => {
      const subjects = await JobPreparationService.getSubjects(navigationState.categoryUid!, 1);
      return subjects.results.find(sub => sub.uid === navigationState.subjectUid);
    },
    enabled: !!navigationState.subjectUid && !!navigationState.categoryUid && !navigationState.subjectName,
  });

  const { data: topicData } = useQuery({
    queryKey: ['topic', navigationState.topicUid],
    queryFn: async () => {
      const topics = await JobPreparationService.getTopics(navigationState.subjectUid!, 1);
      return topics.results.find(topic => topic.uid === navigationState.topicUid);
    },
    enabled: !!navigationState.topicUid && !!navigationState.subjectUid && !navigationState.topicName,
  });

  const handleCategoryClick = (category: Category) => {
    const newState = {
      view: 'subjects' as ViewType,
      categoryUid: category.uid,
      categoryName: category.category_name,
    };
    setNavigationState(newState);
    navigate(`/job-preparation/category/${category.uid}`);
  };

  const handleSubjectClick = (subject: Subject) => {
    const newState = {
      ...navigationState,
      view: 'topics' as ViewType,
      subjectUid: subject.uid,
      subjectName: subject.subject_title,
    };
    setNavigationState(newState);
    navigate(`/job-preparation/category/${navigationState.categoryUid}/subject/${subject.uid}`);
  };

  const handleTopicClick = (topic: Topic) => {
    const newState = {
      ...navigationState,
      view: 'questions' as ViewType,
      topicUid: topic.uid,
      topicName: topic.topic_name,
    };
    setNavigationState(newState);
    navigate(`/job-preparation/category/${navigationState.categoryUid}/subject/${navigationState.subjectUid}/topic/${topic.uid}`);
  };

  const handleBack = () => {
    if (navigationState.view === 'subjects') {
      setNavigationState({ view: 'categories' });
      navigate('/job-preparation');
    } else if (navigationState.view === 'topics') {
      setNavigationState({
        view: 'subjects',
        categoryUid: navigationState.categoryUid,
        categoryName: navigationState.categoryName || categoryData?.category_name,
      });
      navigate(`/job-preparation/category/${navigationState.categoryUid}`);
    } else if (navigationState.view === 'questions') {
      setNavigationState({
        view: 'topics',
        categoryUid: navigationState.categoryUid,
        categoryName: navigationState.categoryName || categoryData?.category_name,
        subjectUid: navigationState.subjectUid,
        subjectName: navigationState.subjectName || subjectData?.subject_title,
      });
      navigate(`/job-preparation/category/${navigationState.categoryUid}/subject/${navigationState.subjectUid}`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrlParams(page);
  };

  const handleModeToggle = () => {
    const newReadingMode = !isReadingMode;
    setIsReadingMode(newReadingMode);
    updateUrlParams(1, newReadingMode);
    setCurrentPage(1);
  };

  const renderPagination = (count: number, hasNext: boolean, hasPrevious: boolean) => {
    const totalPages = Math.ceil(count / 20);
    
    if (totalPages <= 1) return null;

    return (
      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            {hasPrevious && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => handlePageChange(pageNum)}
                    isActive={currentPage === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              );
            })}
            
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

  const renderBreadcrumb = () => {
    const categoryName = navigationState.categoryName || categoryData?.category_name;
    const subjectName = navigationState.subjectName || subjectData?.subject_title;
    const topicName = navigationState.topicName || topicData?.topic_name;

    return (
      <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hidden md:block lg:block">
        <span>Job Preparation</span>
        {categoryName && (
          <>
            <span>/</span>
            <span>{categoryName}</span>
          </>
        )}
        {subjectName && (
          <>
            <span>/</span>
            <span>{subjectName}</span>
          </>
        )}
        {topicName && (
          <>
            <span>/</span>
            <span>{topicName}</span>
            {navigationState.view === 'questions' && (
              <>
                <span>/</span>
                <span>{isReadingMode ? 'Reading Mode' : 'Practice Mode'}</span>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  const renderCategories = () => (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Categories</h2>
      {categoriesLoading ? (
        <div className="text-center py-8">Loading categories...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoriesData?.results.map((category) => (
              <Card 
                key={category.uid} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCategoryClick(category)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <span className='text-lg md:text-2xl'>{category.category_name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Category No #{category.category_no}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          {categoriesData && renderPagination(
            categoriesData.count, 
            !!categoriesData.next, 
            !!categoriesData.previous
          )}
        </>
      )}
    </div>
  );

  const renderSubjects = () => (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-lg md:text-2xl font-semibold text-gray-800 dark:text-white">Subjects</h2>
      </div>
      {subjectsLoading ? (
        <div className="text-center py-8">Loading subjects...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjectsData?.results.map((subject) => (
              <Card 
                key={subject.uid} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleSubjectClick(subject)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className='text-lg md:text-2xl'>{subject.subject_title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{subject.total_questions} Questions</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
          {subjectsData && renderPagination(
            subjectsData.count, 
            !!subjectsData.next, 
            !!subjectsData.previous
          )}
        </>
      )}
    </div>
  );

  const renderTopics = () => (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-lg md:text-2xl font-semibold text-gray-800 dark:text-white">Topics</h2>
      </div>
      {topicsLoading ? (
        <div className="text-center py-8">Loading topics...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicsData?.results.map((topic) => (
              <Card 
                key={topic.uid} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleTopicClick(topic)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <HelpCircle className="h-5 w-5 text-purple-600" />
                    <span className='text-lg md:text-2xl'>{topic.topic_name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Badge variant="outline">{topic.total_questions} Questions</Badge>
                  {topic.subtopics_count > 0 && (
                    <Badge variant="secondary">{topic.subtopics_count} Subtopics</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {topicsData && renderPagination(
            topicsData.count, 
            !!topicsData.next, 
            !!topicsData.previous
          )}
        </>
      )}
    </div>
  );

  const renderQuestions = () => {
    const currentQuestionsData = isReadingMode ? readingQuestionsData : questionsData;
    const currentLoading = isReadingMode ? readingQuestionsLoading : questionsLoading;

    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h2 className="text-lg md:text-2xl font-semibold text-gray-800 dark:text-white">
              Questions {isReadingMode ? '(Reading Mode)' : '(Practice Mode)'}
            </h2>
          </div>
          <Button className='hidden md:block'
            onClick={handleModeToggle}
            variant={isReadingMode ? "default" : "outline"}
          >
            {isReadingMode ? 'Switch to Practice' : 'Switch to Reading'}
          </Button>
        </div>

        <Button className='mb-4 md:hidden block lg:hidden'
            onClick={handleModeToggle}
            variant={isReadingMode ? "default" : "outline"}
          >
            {isReadingMode ? 'Switch to Practice' : 'Switch to Reading'}
          </Button>
        
        {currentLoading ? (
          <div className="text-center py-8">Loading questions...</div>
        ) : (
          <>
            <div className="space-y-6">
              {currentQuestionsData?.results.map((question) => (
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
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-lg">{question.question_text}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {question.options.map((option) => (
                        <div 
                          key={option.uid} 
                          className={`p-3 border rounded-lg ${
                            isReadingMode 
                              ? option.is_correct 
                                ? 'bg-green-50 border-green-300 dark:bg-green-900/20' 
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>
                              <span className="font-medium">{option.option_label}</span> {option.option_text}
                            </span>
                            {isReadingMode && option.is_correct && (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {isReadingMode && question.correct_option && (
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-semibold text-green-800 dark:text-green-200">Correct Answer:</span>
                        </div>
                        <p className="text-green-700 dark:text-green-300">
                          {question.correct_option.option_label} {question.correct_option.option_text}
                        </p>
                      </div>
                    )}
                    
                    {isReadingMode && question.explanation && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <HelpCircle className="h-5 w-5 text-blue-600" />
                          <span className="font-semibold text-blue-800 dark:text-blue-200">Explanation:</span>
                        </div>
                        <p className="text-blue-700 dark:text-blue-300">{question.explanation}</p>
                      </div>
                    )}
                    
                    {question.negative_marks > 0 && (
                      <p className="mt-3 text-sm text-red-600">
                        Negative marks: {question.negative_marks}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {currentQuestionsData && renderPagination(
              currentQuestionsData.count, 
              !!currentQuestionsData.next, 
              !!currentQuestionsData.previous
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          {renderBreadcrumb()}
          
          {navigationState.view === 'categories' && renderCategories()}
          {navigationState.view === 'subjects' && renderSubjects()}
          {navigationState.view === 'topics' && renderTopics()}
          {navigationState.view === 'questions' && renderQuestions()}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobPreparationPage;
