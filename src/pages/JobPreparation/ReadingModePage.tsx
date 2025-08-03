
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ChevronLeft, Clock, CheckCircle, HelpCircle } from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';

const ReadingModePage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const { categoryId, subjectId, topicId, subtopicId } = params;

  const { data: readingQuestionsData, isLoading: readingQuestionsLoading } = useQuery({
    queryKey: ['questions-reading', topicId, currentPage],
    queryFn: () => JobPreparationService.getQuestionsReadingMode(topicId!, currentPage),
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

  const handleBack = () => {
    navigate(`/job-preparation/category/${categoryId}/subject/${subjectId}`);
  };

  const handleModeToggle = () => {
    navigate(`/job-preparation/category/${categoryId}/subject/${subjectId}/topic/${topicId}/subtopic/${subtopicId || 'direct'}`);
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
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
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
                <span>Reading Mode</span>
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
                <h2 className="text-lg md:text-lg font-semibold text-gray-800 dark:text-white">
                  Questions (Reading Mode)
                </h2>
              </div>
              <Button className='hidden md:block text-white'
                onClick={handleModeToggle}
                variant="default"
              >
                Switch to Practice
              </Button>
            </div>

            <Button className='mb-4 md:hidden block lg:hidden'
                onClick={handleModeToggle}
                variant="default"
              >
                Switch to Practice
              </Button>
            
            {readingQuestionsLoading ? (
              <div className="text-center py-8">Loading questions...</div>
            ) : (
              <>
                <div className="space-y-6">
                  {readingQuestionsData?.results.map((question) => (
                    <Card key={question.uid}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className='text-lg md:text-lg'>Question #{question.question_number}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4 text-lg">{question.question_text}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {question.options.map((option) => {
                            let optionClassName = 'p-3 border rounded-lg transition-colors ';
                            
                            if (option.is_correct) {
                              optionClassName += 'bg-green-50 border-green-300 dark:bg-green-900/20';
                            } else {
                              optionClassName += 'hover:bg-gray-50 dark:hover:bg-gray-800';
                            }

                            return (
                              <div key={option.uid} className={optionClassName}>
                                <div className="flex items-center justify-between">
                                  <span>
                                    <span className="font-medium">{option.option_label}</span> {option.option_text}
                                  </span>
                                  {option.is_correct && (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {question.explanation && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <HelpCircle className="h-5 w-5 text-blue-600" />
                              <span className="font-semibold text-blue-800 dark:text-blue-200">Explanation:</span>
                            </div>
                            <p className="text-blue-700 dark:text-blue-300">
                              {question.explanation}
                            </p>
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
                {readingQuestionsData && renderPagination(
                  readingQuestionsData.count, 
                  !!readingQuestionsData.next, 
                  !!readingQuestionsData.previous
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReadingModePage;
