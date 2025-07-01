
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { BookOpen } from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';
import { Category } from '@/types/jobPreparation';

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', currentPage],
    queryFn: () => JobPreparationService.getCategories(currentPage),
  });

  const handleCategoryClick = (category: Category) => {
    navigate(`/job-preparation/category/${category.uid}`);
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
          </div>
          
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoriesPage;
