
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
import { Topic } from '@/types/jobPreparation';

const TopicsPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const { categoryId, subjectId } = params;

  const { data: topicsData, isLoading: topicsLoading } = useQuery({
    queryKey: ['topics', subjectId, currentPage],
    queryFn: () => JobPreparationService.getTopics(subjectId!, currentPage),
    enabled: !!subjectId,
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

  const handleTopicClick = (topic: Topic) => {
    navigate(`/job-preparation/category/${categoryId}/subject/${subjectId}/topic/${topic.uid}`);
  };

  const handleBack = () => {
    navigate(`/job-preparation/category/${categoryId}`);
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
          </div>
          
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TopicsPage;
