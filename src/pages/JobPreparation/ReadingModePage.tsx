import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import {
  ChevronLeft,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Target,
  Lightbulb,
  RefreshCw,
  Eye,
} from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';

const ReadingModePage: React.FC = () => {
  const { userProfile } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const { categoryId, subjectId, topicId, subtopicId } = params;

  const { data: readingQuestionsData, isLoading: readingQuestionsLoading, refetch } = useQuery({
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
          <PaginationContent className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2">
            {hasPrevious && (
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                />
              </PaginationItem>
            )}

            {pageNumbers.map((pageNum) => (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  onClick={() => handlePageChange(pageNum)}
                  isActive={currentPage === pageNum}
                  className={`cursor-pointer transition-all ${currentPage === pageNum
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'hover:bg-green-50 dark:hover:bg-green-900/20'
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
                  className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                />
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

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
      <main className="flex-1">
        <div className="p-6">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="hover:text-green-600 cursor-pointer transition-colors">Job Preparation</span>
            <span>/</span>
            <span className="text-green-600 font-medium">Reading Mode</span>
          </div>

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Topics
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                    <BookOpen className="h-8 w-8 mr-3 text-green-600" />
                    Reading Mode
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    Study questions with answers and explanations
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleModeToggle}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Back to Practice
                </Button>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          {readingQuestionsLoading ? (
            <LoadingSkeleton />
          ) : (
            <>
                <div className="space-y-8">
                  {readingQuestionsData?.results.map((question, index) => (
                    <Card
                      key={question.uid}
                      className="border-0 shadow-xl bg-white dark:bg-background overflow-hidden transition-all duration-300 hover:shadow-2xl"
                    >
                      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b p-4">
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                              {question.question_number}
                            </div>
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                              {question.question_text}
                            </span>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="mb-0">
                          {question.image && (
                            <div className="mt-4 rounded-lg overflow-hidden shadow-md">
                              <img
                                src={question.image}
                                alt="Question illustration"
                                className="w-full max-h-96 object-contain bg-gray-50 dark:bg-gray-700"
                              />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                          {question.options.map((option) => {
                            let optionClassName = 'p-2 border-2 rounded-xl';

                            if (option.is_correct) {
                              optionClassName += 'bg-gradient-to-r from-green-50 to-green-100 border-green-400 shadow-lg dark:from-green-900/30 dark:to-green-800/30 dark:border-green-500';
                            } else {
                              optionClassName += 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600';
                            }

                            return (
                              <div key={option.uid} className={optionClassName}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-start space-x-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm ${option.is_correct
                                      ? 'bg-green-600 text-white'
                                      : 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white'
                                      }`}>
                                      {option.option_label}
                                    </div>
                                    <span className="text-gray-800 dark:text-gray-200 flex-1">
                                      {option.option_text}
                                  </span>
                                  </div>
                                  {option.is_correct && (
                                    <div className="flex items-center space-x-2 ml-2">
                                      <Badge className="bg-green-600 text-white text-xs">
                                        Correct
                                      </Badge>
                                      <CheckCircle className="h-6 w-6 text-green-600" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {question.explanation && (
                          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border-l-4 border-blue-500 mb-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <Lightbulb className="h-4 w-4 text-white" />
                            </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                                  <HelpCircle className="h-4 w-4 mr-1" />
                                  Detailed Explanation
                                </h4>
                                <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                                  {question.explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {question.negative_marks > 0 && (
                          <div className="flex items-center space-x-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">!</span>
                            </div>
                            <span className="text-orange-700 dark:text-orange-300 font-medium">
                            Negative marks: {question.negative_marks}
                            </span>
                          </div>
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
      </main>
      {userProfile ? '' : <Footer />}
    </div>
  );
};

export default ReadingModePage;