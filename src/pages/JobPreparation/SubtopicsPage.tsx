import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { ChevronLeft, HelpCircle } from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';
import { Subtopic } from '@/types/jobPreparation';

const SubtopicsPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const { categoryId, subjectId, topicId } = params;

  const { data: subtopicsData, isLoading: subtopicsLoading } = useQuery({
    queryKey: ['subtopics', topicId, currentPage],
    queryFn: () => JobPreparationService.getSubtopics(topicId!, currentPage),
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

  const handleSubtopicClick = (subtopic: Subtopic) => {
    navigate(`/job-preparation/category/${categoryId}/subject/${subjectId}/topic/${topicId}/subtopic/${subtopic.uid}`);
  };

  const handleBack = () => {
    navigate(`/job-preparation/category/${categoryId}/subject/${subjectId}`);
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
              </>
            )}
          </div>
          
          <div>
            <div className="flex items-center space-x-4 mb-6">
              <Button variant="ghost" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h2 className="text-lg md:text-2xl font-semibold text-gray-800 dark:text-white">Subtopics</h2>
            </div>
            {subtopicsLoading ? (
              <div className="text-center py-8">Loading subtopics...</div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subtopicsData?.results.map((subtopic) => (
                    <Card 
                      key={subtopic.uid} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleSubtopicClick(subtopic)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <HelpCircle className="h-5 w-5 text-purple-600" />
                          <span className='text-lg md:text-lg'>{subtopic.subtopic_name}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{subtopic.total_questions} Questions</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {subtopicsData && renderPagination(
                  subtopicsData.count, 
                  !!subtopicsData.next, 
                  !!subtopicsData.previous
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

export default SubtopicsPage;