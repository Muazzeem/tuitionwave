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
  Eye,
  GraduationCap,
} from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import TutorPagination from '@/components/FindTutors/TutorPagination';

const ReadingModePage: React.FC = () => {
  const { userProfile } = useAuth();
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4 px-4 sm:px-0">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <CardHeader className="pb-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="grid grid-cols-1 gap-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex-1 overflow-auto dark:bg-gray-900 h-screen bg-gray-50 w-full">
      {userProfile ? <DashboardHeader userName="BCS Candidate" /> : <Header />}

      <ScrollArea type="always" style={{ height: userProfile ? 'calc(100vh - 80px)' : 'calc(100vh - 160px)' }}>
        <main className="flex-1 pb-6">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="hover:text-green-600 cursor-pointer transition-colors">Job Preparation</span>
              <span>/</span>
              <span className="text-green-600 font-medium">Reading Mode</span>
            </div>

            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      onClick={handleBack}
                      className="hover:bg-green-50 dark:hover:bg-green-900/20"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Back to Topic</span>
                    </Button>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <GraduationCap className="h-6 w-6 mr-2 text-green-600" />
                        Reading Mode
                      </h1>
                      <p className="text-green-600 font-medium text-sm flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        Study with answers & explanations
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Button
                      onClick={handleModeToggle}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Target className="h-4 w-4" />
                      <span className="hidden sm:inline ml-2">Practice Mode</span>
                    </Button>
                  </div>
                </div>

                {/* Study Stats */}
                {readingQuestionsData && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          Study Material
                        </span>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        {readingQuestionsData.count} Questions
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Questions Section */}
            {readingQuestionsLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                  <div className="space-y-4 px-1 sm:px-0">
                  {readingQuestionsData?.results.map((question, index) => (
                    <Card
                      key={question.uid}
                      className="border-0 shadow-md bg-white dark:bg-gray-800 overflow-hidden transition-all duration-300 hover:shadow-lg"
                    >
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-b p-3 sm:p-4">
                        <CardTitle className="flex items-start justify-between gap-3">
                          <div className="flex items-start space-x-3 min-w-0 flex-1">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {question.question_number}
                            </div>
                            <span className="text-sm sm:text-base leading-relaxed text-gray-900 dark:text-white">
                              {question.question_text}
                            </span>
                          </div>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 flex-shrink-0">
                            Study
                          </Badge>
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-3 sm:p-4">
                        {question.image && (
                          <div className="mb-4 rounded-lg overflow-hidden shadow-sm">
                            <img
                              src={question.image}
                              alt="Question illustration"
                              className="w-full max-h-64 sm:max-h-80 object-contain bg-gray-50 dark:bg-gray-700"
                            />
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                          {question.options.map((option) => {
                            let optionClassName = 'p-3 border-2 rounded-lg transition-all duration-200';

                            if (option.is_correct) {
                              optionClassName += ' bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-600';
                            } else {
                              optionClassName += ' bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
                            }

                            return (
                              <div key={option.uid} className={optionClassName}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-sm text-sm flex-shrink-0 ${option.is_correct
                                      ? 'bg-green-600 text-white'
                                      : 'bg-white dark:bg-gray-600 text-gray-800 dark:text-white'
                                      }`}>
                                      {option.option_label}
                                    </div>
                                    <span className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                                      {option.option_text}
                                    </span>
                                  </div>
                                  {option.is_correct && (
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                      <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {question.explanation && (
                          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500 mb-4">
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Lightbulb className="h-3 w-3 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1 text-sm flex items-center">
                                  <HelpCircle className="h-4 w-4 mr-1" />
                                  Explanation
                                </h4>
                                <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                                  {question.explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {question.negative_marks > 0 && (
                          <div className="flex items-center space-x-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-bold">!</span>
                            </div>
                            <span className="text-orange-700 dark:text-orange-300 font-medium text-sm">
                              Negative marks: {question.negative_marks}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                  </div>

                  <TutorPagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(readingQuestionsData.count / 20)}
                    onPageChange={handlePageChange}
                    hasNext={!!readingQuestionsData.next}
                    hasPrevious={!!readingQuestionsData.previous}
                  />
              </>
            )}
          </div>
        </main>

        {!userProfile && <Footer />}
      </ScrollArea>
    </div>
  );
};

export default ReadingModePage;