import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  BookOpen,
  Target,
  Eye,
  GraduationCap,
} from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';
import { ScrollArea } from '@/components/ui/scroll-area';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import TutorPagination from '@/components/FindTutors/TutorPagination';
import QuestionCard from '@/components/JobPreparation/QuestionCard';
import SubtopicFilters from '@/components/JobPreparation/SubtopicFilters';
import { Subtopic } from '@/types/jobPreparation';

const ReadingModePage: React.FC = () => {
  const { userProfile } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { categoryId, subjectId, topicId, subtopicId } = params;

  const { data: readingQuestionsData, isLoading: readingQuestionsLoading } = useQuery({
    queryKey: ['questions-reading', selectedSubtopicId || topicId, currentPage, selectedSubtopicId ? 'subtopic' : 'topic'],
    queryFn: () => {
      if (selectedSubtopicId) {
        return JobPreparationService.getQuestionsReadingModeBySubtopic(selectedSubtopicId, currentPage);
      }
      return JobPreparationService.getQuestionsReadingMode(topicId!, currentPage);
    },
    enabled: !!(selectedSubtopicId || topicId),
  });

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

      <ScrollArea type="always" style={{ height: userProfile ? 'calc(100vh - 80px)' : 'calc(100vh - 160px)' }}>
        <main className="flex-1 pb-6">
          <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-4 sm:mb-6 flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="hover:text-green-600 cursor-pointer transition-colors">Job Preparation</span>
              <span>/</span>
              <span className="text-green-600 font-medium">Reading Mode</span>
            </div>

            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
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
                      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-green-600" />
                        Reading Mode
                      </h1>
                      {selectedSubtopic ? (
                        <p className="text-green-600 font-medium text-sm flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          <span className="truncate">{selectedSubtopic.subtopic_name}</span>
                        </p>
                      ) : (
                        <p className="text-green-600 font-medium text-sm flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          Study with answers & explanations
                        </p>
                      )}
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
                        <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
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

            {/* Subtopic Filters */}
            {subtopicsData && (
              <SubtopicFilters
                subtopics={subtopicsData.results}
                selectedSubtopicId={selectedSubtopicId}
                totalQuestions={readingQuestionsData?.count || 0}
                onSubtopicSelect={handleSubtopicClick}
                onShowAll={handleShowAllQuestions}
                showMobileFilters={showMobileFilters}
                onToggleMobileFilters={() => setShowMobileFilters(!showMobileFilters)}
              />
            )}

            {/* Questions Section */}
            {readingQuestionsLoading ? (
              <LoadingSkeleton />
            ) : (
              <>
                <div className="space-y-3 sm:space-y-4 px-1 sm:px-0">
                  {readingQuestionsData?.results.map((question) => (
                    <QuestionCard
                      key={question.uid}
                      question={question}
                      mode="reading"
                    />
                  ))}
                </div>

                {readingQuestionsData && (
                  <TutorPagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(readingQuestionsData.count / 20)}
                    onPageChange={handlePageChange}
                    hasNext={!!readingQuestionsData.next}
                    hasPrevious={!!readingQuestionsData.previous}
                  />
                )}
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
