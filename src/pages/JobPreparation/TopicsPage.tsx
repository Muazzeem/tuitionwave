
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { ChevronLeft, HelpCircle, Search, BookOpen, Target, Clock } from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';
import { Topic } from '@/types/jobPreparation';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import TutorPagination from '@/components/FindTutors/TutorPagination';
import { ScrollArea } from '@/components/ui/scroll-area';

const TopicsPage: React.FC = () => {
  const params = useParams();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [searchTerm, setSearchTerm] = useState('');
  const { categoryId, subjectId } = params;

  // Determine if user is on authorized or public route
  const isAuthorizedRoute = location.pathname.startsWith('/job-preparation');

  const { data: topicsData, isLoading: topicsLoading } = useQuery({
    queryKey: ['topics', subjectId, currentPage],
    queryFn: () => JobPreparationService.getTopics(subjectId!, currentPage),
    enabled: !!subjectId,
  });

  const handleTopicClick = (topic: Topic) => {
    const basePath = isAuthorizedRoute ? '/job-preparation' : '/questions';
    navigate(`${basePath}/category/${categoryId}/subject/${subjectId}/topic/${topic.uid}/subtopic/direct`);
  };

  const handleBack = () => {
    const basePath = isAuthorizedRoute ? '/job-preparation' : '/questions';
    navigate(`${basePath}/category/${categoryId}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newSearchParams = new URLSearchParams();
    if (page > 1) newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  };

  // Filter topics based on search term
  const filteredTopics = topicsData?.results.filter(topic =>
    topic.topic_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getTopicIcon = (index: number) => {
    const icons = [BookOpen, Target, HelpCircle, Clock];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="h-5 w-5" />;
  };

  const getTopicColor = (index: number) => {
    const colors = [
      'text-blue-600 bg-blue-50 border-blue-200',
      'text-purple-600 bg-purple-50 border-purple-200',
      'text-green-600 bg-green-50 border-green-200',
      'text-orange-600 bg-orange-50 border-orange-200'
    ];
    return colors[index % colors.length];
  };

  const renderSkeletonCards = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <Card key={index} className="animate-pulse">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-900 h-screen bg-gray-50 w-full">
      {userProfile ? <DashboardHeader userName="BCS Candidate" /> :
        <Header />
      }
      <ScrollArea type="always" style={{ height: userProfile ? 'calc(100vh - 80px)' : 'calc(109vh - 160px)' }}>
        <main className="flex-1">
          <div className={userProfile ? "p-2 md:p-6 max-w-7xl mx-auto" : "p-2 md:p-6 container"}>
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600 text-gray-400">
              <Link to="/job-preparation/questions">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Job Preparation</span>
              </Link>
              <span>/</span>
              <span className="text-blue-600 font-medium">Topics</span>
            </div>

            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="hover:bg-blue-100 hover:bg-blue-900/20 transition-colors text-white border-0"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Back to Subjects</span>
                  </Button>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-white">
                      Topics
                    </h1>
                    <p className="text-gray-600 text-gray-400 mt-1">
                      Choose a topic to start practicing
                    </p>
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 focus:ring-2 focus:ring-primary/20 transition-all border-primary-800 text-white"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              {topicsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renderSkeletonCards()}
                </div>
              ) : filteredTopics.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mb-4">
                      <Search className="h-16 w-16 text-gray-300 text-gray-600 mx-auto" />
                  </div>
                    <h3 className="text-xl font-semibold text-gray-900 text-white mb-2">
                    {searchTerm ? 'No topics found' : 'No topics available'}
                  </h3>
                    <p className="text-gray-600 text-gray-400">
                    {searchTerm
                      ? `Try searching for something else or clear your search.`
                      : 'Topics will appear here when available.'
                    }
                  </p>
                  {searchTerm && (
                    <Button
                      variant="outline"
                      onClick={() => setSearchTerm('')}
                      className="mt-4"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTopics.map((topic, index) => (
                      <Card
                        key={topic.uid}
                        className={`cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all bg-background border shadow-md duration-300 bg-background hover:border-primary border-0`}
                        onClick={() => handleTopicClick(topic)}
                      >
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${getTopicColor(index)}`}>
                              {getTopicIcon(index)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 text-white group-hover:text-primary transition-colors truncate">
                                {topic.topic_name}
                              </h3>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                            >
                              <HelpCircle className="h-3 w-3 mr-1" />
                              {topic.total_questions} Questions
                            </Badge>
                            {topic.subtopics_count > 0 && (
                              <Badge
                                variant="default"
                                className="bg-gradient-to-r from-blue-600 to-primary-600 transition-all text-white"
                              >
                                <BookOpen className="h-3 w-3 mr-1" />
                                {topic.subtopics_count} Sub-Topics
                              </Badge>
                            )}
                          </div>

                          {/* Progress Indicator */}
                          <div className="pt-2 border-t border-gray-100 border-gray-700">
                            <div className="flex items-center justify-between text-xs text-gray-500 text-gray-400">
                              <span>Click to start practicing</span>
                              <ChevronLeft className="h-3 w-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                      </div>

                  {topicsData && !searchTerm.trim() && (
                    <TutorPagination
                      currentPage={currentPage}
                      totalPages={Math.ceil(topicsData.count / 20)}
                      onPageChange={handlePageChange}
                      hasNext={!!topicsData.next}
                      hasPrevious={!!topicsData.previous}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </main>
        <div className="h-20 md:h-8"></div>
        {userProfile ? '' : <Footer />}
      </ScrollArea>
    </div>
  );
};

export default TopicsPage;
