
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Star, TrendingUp, Users, Target, ChevronLeft } from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';
import { Category } from '@/types/jobPreparation';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TutorPagination from '@/components/FindTutors/TutorPagination';
import { ScrollArea } from '@/components/ui/scroll-area';

const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

  // Determine if user is on authorized or public route
  const isAuthorizedRoute = location.pathname.startsWith('/job-preparation');

  const { data: categoriesData, isLoading: categoriesLoading, error } = useQuery({
    queryKey: ['categories', currentPage],
    queryFn: () => JobPreparationService.getCategories(currentPage),
  });

  // Filter categories based on search term
  useEffect(() => {
    if (categoriesData?.results) {
      if (searchTerm.trim() === '') {
        setFilteredCategories(categoriesData.results);
      } else {
        const filtered = categoriesData.results.filter(category =>
          category.category_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCategories(filtered);
      }
    }
  }, [categoriesData, searchTerm]);

  const handleCategoryClick = (category: Category) => {
    const basePath = isAuthorizedRoute ? '/job-preparation' : '/questions';
    navigate(`${basePath}/category/${category.uid}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newSearchParams = new URLSearchParams(searchParams);
    if (page > 1) {
      newSearchParams.set('page', page.toString());
    } else {
      newSearchParams.delete('page');
    }
    setSearchParams(newSearchParams);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const newSearchParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      newSearchParams.set('search', value);
    } else {
      newSearchParams.delete('search');
    }
    setSearchParams(newSearchParams);
  };

  const getCategoryIcon = (categoryNo: number) => {
    const icons = [BookOpen, Target, Users, Star, TrendingUp];
    const IconComponent = icons[categoryNo % icons.length];
    return IconComponent;
  };

  const renderGridView = () => (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
      {filteredCategories.map((category) => {
        const IconComponent = getCategoryIcon(category.category_no);

        return (
          <Card
            key={category.uid}
            className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-background overflow-hidden border-0 rounded-2xl"
            onClick={() => handleCategoryClick(category)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-start space-x-3">
                <div className={`p-2 bg-[#0962D633] rounded-3xl shadow-lg`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 text-white group-hover:text-primary-300 transition-colors truncate">
                    {category.category_name}
                  </h3>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Category preview info */}
              <div className="mt-0 pt-3 border-t border-primary-700">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span>Explore</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    <span>Practice</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-16">
      <div className="mx-auto w-24 h-24 bg-gray-100 bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <Search className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 text-white mb-2">
        No categories found
      </h3>
      <p className="text-gray-500 text-gray-400 max-w-md mx-auto">
        {searchTerm ?
          `No categories match your search "${searchTerm}". Try adjusting your search terms.` :
          "No categories are available at the moment."
        }
      </p>
      {searchTerm && (
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => handleSearchChange('')}
        >
          Clear search
        </Button>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="flex-1 overflow-auto bg-gray-900 h-screen">
        {userProfile ? <DashboardHeader userName="BCS Candidate" /> : <Header />}
        <main className="flex-1 bg-gray-50 bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 text-gray-400 mb-4">
              Unable to load categories. Please try again later.
            </p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
            >
              Refresh Page
            </Button>
          </div>
        </main>
        {!userProfile && <Footer />}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {userProfile ? <DashboardHeader userName="BCS Candidate" /> : <Header />}
      <ScrollArea type="always" style={{ height: userProfile ? 'calc(100vh - 80px)' : 'calc(109vh - 160px)' }}>
        <main className="flex-1 mx-auto">
          <div className={userProfile ? "p-4 md:p-6" : "p-4 md:p-6"}>
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div>
                    <h2 className="text-xl md:text-3xl font-bold text-white font-unbounded">
                      Categories
                    </h2>
                    <p className="text-muted-foreground hidden md:block">
                      Choose a categories to start practicing
                    </p>
                  </div>
                </div>
              </div>              
            </div>

            {categoriesLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 text-gray-400">Loading categories...</p>
                </div>
              </div>
            ) : filteredCategories.length === 0 ? (
              renderEmptyState()
            ) : (
              <>
                {renderGridView()}
                {categoriesData && !searchTerm.trim() && (
                  <TutorPagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(categoriesData.count / 20)}
                    onPageChange={handlePageChange}
                    hasNext={!!categoriesData.next}
                    hasPrevious={!!categoriesData.previous}
                  />
                )}
              </>
            )}
          </div>
        </main>
        <div className="h-20 md:h-8"></div>
        {!userProfile && <Footer />}
      </ScrollArea>
    </div>
  );
};

export default CategoriesPage;
