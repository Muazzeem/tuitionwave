import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, BookOpen, Target, Clock, Search } from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';
import { Topic } from '@/types/jobPreparation';
import DashboardHeader from '@/components/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import TutorPagination from '@/components/FindTutors/TutorPagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

const TopicsPage: React.FC = () => {
  const params = useParams();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
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

  const getQuestionCountColor = (count: number) => {
    if (count >= 100) return 'text-green-800 bg-primary-900 text-gray-200 border';
    return 'bg-gray-100 text-gray-800 bg-gray-700 text-gray-200';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const newSearchParams = new URLSearchParams();
    if (page > 1) newSearchParams.set('page', page.toString());
    setSearchParams(newSearchParams);
  };

  const topics = topicsData?.results ?? [];

  const getTopicIcon = (index: number) => {
    const icons = [BookOpen, Target, Clock];
    const IconComponent = icons[index % icons.length];
    return <IconComponent className="h-5 w-5" />;
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-900 h-screen bg-gray-50 w-full">
      {userProfile ? <DashboardHeader userName="BCS Candidate" /> : <Header />}

      <ScrollArea type="always" style={{ height: userProfile ? 'calc(100vh - 80px)' : 'calc(109vh - 160px)' }}>
        <main className="flex-1 mx-auto">
          <div className={userProfile ? "p-2 md:p-10" : "p-2 md:p-10"}>
            <div className="mt-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/job-preparation/questions`)}
                    aria-label="Back to results"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 hover:bg-primary-700 transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5 text-white" />
                  </button>

                  <div>
                    <h2 className="text-xl md:text-3xl font-bold text-white font-unbounded">
                      Topics
                    </h2>
                    <p className="text-muted-foreground hidden md:block">
                      Choose a topic to start practicing
                    </p>
                  </div>
                </div>
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search topic..."
                    onChange={(e) => searchParams.set('search', e.target.value)}
                    className="pl-10 border-0 transition-all text-white rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600 text-gray-400">
              <Link to="/job-preparation/questions">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Subjects</span>
              </Link>
              <span>/</span>
              <span className="text-blue-600 font-medium">Topics</span>
            </div>

            {/* Content */}
            <div>
              {topicsLoading ? (
                <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
                  <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 text-gray-400">Loading topics...</p>
                    </div>
                  </div>
                </div>
              ) : topics.length === 0 ? (
                <div className="text-center py-16">
                    <h3 className="text-xl font-semibold text-gray-900 text-white mb-2">No topics available</h3>
                    <p className="text-gray-600 text-gray-400">Topics will appear here when available.</p>
                </div>
              ) : (
                <>
                      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
                        {topics.map((topic: Topic, index: number) => (
                      <Card
                        key={topic.uid}
                            className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-background overflow-hidden border-0 rounded-2xl"
                        onClick={() => handleTopicClick(topic)}
                      >
                        <CardHeader className="pb-3">
                              <CardTitle className="flex items-start space-x-3">
                                <div className="p-2 bg-primary-700/50 rounded-3xl shadow-lg">
                                  <div className="h-5 w-5 text-white">{getTopicIcon(index)}</div>
                            </div>

                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-gray-900 text-white group-hover:text-primary-300 transition-colors truncate">
                                {topic.topic_name}
                              </h3>

                                  <div className="flex items-center justify-between mb-4 mt-2">
                                    <div className="flex items-center gap-2">
                                      <Badge className={`${getQuestionCountColor(topic.total_questions)} border-primary-600 font-medium text-xs hover:bg-primary-600 hover:text-white`}>
                                        {topic.total_questions} Questions
                                      </Badge>

                                      {topic.subtopics_count > 0 && (
                                        <Badge className="bg-gradient-to-r from-blue-600 to-primary-600 text-white text-xs">
                                          {topic.subtopics_count} Sub-Topics
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                              <div className="pt-2 border-t border-primary-700">
                            <div className="flex items-center justify-between text-xs text-gray-500 text-gray-400">
                              <span>Click to start practicing</span>
                              <ChevronLeft className="h-3 w-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                      </div>

                      {topicsData && (
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
