
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookOpen, Search, Star, TrendingUp, Users, Target } from 'lucide-react';
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

  const getCategoryGradient = (categoryNo: number) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-purple-500 to-pink-600',
      'from-indigo-500 to-blue-600',
      'from-yellow-500 to-orange-600',
      'from-pink-500 to-rose-600',
      'from-teal-500 to-cyan-600'
    ];
    return gradients[categoryNo % gradients.length];
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
      {filteredCategories.map((category) => {
        const IconComponent = getCategoryIcon(category.category_no);
        const gradient = getCategoryGradient(category.category_no);

        return (
          <Card
            key={category.uid}
            className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary
            shadow-md bg-white bg-background overflow-hidden border-0"
            onClick={() => handleCategoryClick(category)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-start space-x-3">
                <div className={`p-3 bg-gradient-to-br ${gradient} rounded-lg shadow-lg`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 text-white group-hover:text-primary transition-colors truncate">
                    {category.category_name}
                  </h3>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Category preview info */}
              <div className="mt-0 pt-3 border-t border-gray-100 border-gray-700">
                <div className="flex items-center text-xs text-gray-500 text-gray-400 space-x-4">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-3 w-3" />
                    <span>Explore</span>
                  </div>
                  <div className="flex items-center space-x-1">
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
        <main className="flex-1 bg-gray-50 bg-gray-900">
          <div className={userProfile ? "p-2 md:p-6 max-w-7xl mx-auto" : "p-2 md:p-6 container"}>
            {/* Header Section */}
            <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600 text-gray-400">
              <span className="hover:text-blue-600 cursor-pointer transition-colors">Job Preparation</span>
              <span>/</span>
              <span className="text-blue-600 font-medium">Categories</span>
            </div>

            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-white">
                      Categories
                    </h1>
                    <p className="text-gray-600 text-gray-400 mt-1">
                      Choose a categories to start practicing
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search Categories..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-10 focus:ring-2 focus:ring-primary/20 transition-all border-primary-800 text-white"
                />
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
