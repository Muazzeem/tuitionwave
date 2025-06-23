
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ChevronLeft, BookOpen, FileText, HelpCircle, Clock } from 'lucide-react';
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
  const [navigationState, setNavigationState] = useState<NavigationState>({ view: 'categories' });
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when view changes
  useEffect(() => {
    setCurrentPage(1);
  }, [navigationState.view, navigationState.categoryUid, navigationState.subjectUid, navigationState.topicUid]);

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

  // Questions Query
  const { data: questionsData, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions', navigationState.topicUid, currentPage],
    queryFn: () => JobPreparationService.getQuestions(navigationState.topicUid!, currentPage),
    enabled: navigationState.view === 'questions' && !!navigationState.topicUid,
  });

  const handleCategoryClick = (category: Category) => {
    setNavigationState({
      view: 'subjects',
      categoryUid: category.uid,
      categoryName: category.category_name,
    });
  };

  const handleSubjectClick = (subject: Subject) => {
    setNavigationState({
      ...navigationState,
      view: 'topics',
      subjectUid: subject.uid,
      subjectName: subject.subject_title,
    });
  };

  const handleTopicClick = (topic: Topic) => {
    setNavigationState({
      ...navigationState,
      view: 'questions',
      topicUid: topic.uid,
      topicName: topic.topic_name,
    });
  };

  const handleBack = () => {
    if (navigationState.view === 'subjects') {
      setNavigationState({ view: 'categories' });
    } else if (navigationState.view === 'topics') {
      setNavigationState({
        view: 'subjects',
        categoryUid: navigationState.categoryUid,
        categoryName: navigationState.categoryName,
      });
    } else if (navigationState.view === 'questions') {
      setNavigationState({
        view: 'topics',
        categoryUid: navigationState.categoryUid,
        categoryName: navigationState.categoryName,
        subjectUid: navigationState.subjectUid,
        subjectName: navigationState.subjectName,
      });
    }
  };

  const renderPagination = (count: number, hasNext: boolean, hasPrevious: boolean) => {
    const totalPages = Math.ceil(count / 20); // Assuming 20 items per page
    
    if (totalPages <= 1) return null;

    return (
      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            {hasPrevious && (
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    onClick={() => setCurrentPage(pageNum)}
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
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="cursor-pointer"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  const renderBreadcrumb = () => (
    <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
      <span>Job Preparation</span>
      {navigationState.categoryName && (
        <>
          <span>/</span>
          <span>{navigationState.categoryName}</span>
        </>
      )}
      {navigationState.subjectName && (
        <>
          <span>/</span>
          <span>{navigationState.subjectName}</span>
        </>
      )}
      {navigationState.topicName && (
        <>
          <span>/</span>
          <span>{navigationState.topicName}</span>
        </>
      )}
    </div>
  );

  const renderCategories = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Categories</h2>
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
                    <span>{category.category_name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">Category #{category.category_no}</Badge>
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
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Subjects</h2>
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
                    <span>{subject.subject_title}</span>
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
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Topics</h2>
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
                    <span>{topic.topic_name}</span>
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

  const renderQuestions = () => (
    <div>
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" onClick={handleBack}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Questions</h2>
      </div>
      {questionsLoading ? (
        <div className="text-center py-8">Loading questions...</div>
      ) : (
        <>
          <div className="space-y-6">
            {questionsData?.results.map((question) => (
              <Card key={question.uid}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Question #{question.question_number}</span>
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
                        className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <span className="font-medium">{option.option_label}</span> {option.option_text}
                      </div>
                    ))}
                  </div>
                  {question.negative_marks > 0 && (
                    <p className="mt-3 text-sm text-red-600">
                      Negative marks: {question.negative_marks}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          {questionsData && renderPagination(
            questionsData.count, 
            !!questionsData.next, 
            !!questionsData.previous
          )}
        </>
      )}
    </div>
  );

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
