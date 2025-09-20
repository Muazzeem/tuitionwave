
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ChevronLeft, Search, BookOpen, TrendingUp } from 'lucide-react';
import JobPreparationService from '@/services/JobPreparationService';
import { Subject } from '@/types/jobPreparation';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/DashboardHeader';
import TutorPagination from '@/components/FindTutors/TutorPagination';
import { ScrollArea } from '@/components/ui/scroll-area';

const SubjectsPage: React.FC = () => {
  const { userProfile } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const { categoryId } = params;

  // Determine if user is on authorized or public route
  const isAuthorizedRoute = location.pathname.startsWith('/job-preparation');

  const { data: subjectsData, isLoading: subjectsLoading, error } = useQuery({
    queryKey: ['subjects', categoryId, currentPage],
    queryFn: () => JobPreparationService.getSubjects(categoryId!, currentPage),
    enabled: !!categoryId,
  });

  // Filter subjects based on search term
  useEffect(() => {
    if (subjectsData?.results) {
      if (searchTerm.trim() === '') {
        setFilteredSubjects(subjectsData.results);
      } else {
        const filtered = subjectsData.results.filter(subject =>
          subject.subject_title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredSubjects(filtered);
      }
    }
  }, [subjectsData, searchTerm]);

  const handleSubjectClick = (subject: Subject) => {
    const basePath = isAuthorizedRoute ? '/job-preparation' : '/questions';
    navigate(`${basePath}/category/${categoryId}/subject/${subject.uid}`);
  };

  const handleBack = () => {
    const basePath = isAuthorizedRoute ? '/job-preparation' : '/questions';
    navigate(`${basePath}/questions`);
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

  const getQuestionCountColor = (count: number) => {
    if (count >= 100) return 'text-green-800 bg-primary-900 text-gray-200 border';
    return 'bg-gray-100 text-gray-800 bg-gray-700 text-gray-200';
  };

  const renderGridView = () => (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
      {filteredSubjects.map((subject) => (
        <Card
          key={subject.uid}
          className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 bg-background overflow-hidden border-0 rounded-2xl"
          onClick={() => handleSubjectClick(subject)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-start space-x-3">
              <div className={`p-2 bg-primary-700/50 rounded-3xl shadow-lg`}>
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 text-white group-hover:text-primary-300 transition-colors truncate">
                  {subject.subject_title}
                </h3>
                <div className="flex items-center justify-between mb-4 mt-2">
                  <Badge
                    className={`${getQuestionCountColor(subject.total_questions)} border-primary-600 font-medium text-xs hover:bg-primary-600 hover:text-white`}
                  >
                    {subject.total_questions} Questions
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500 text-gray-400">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>Practice</span>
                  </div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
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
  );

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        {userProfile ? <DashboardHeader userName="BCS Candidate" /> :
          <Header />
        }
        <main className="flex-1 bg-gray-50 bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 text-gray-400 mb-4">
              Unable to load subjects. Please try again later.
            </p>
            <Button onClick={handleBack} variant="outline">
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gray-900 h-screen bg-gray-50 w-full">
      {userProfile ? <DashboardHeader userName="BCS Candidate" /> :
        <Header />
      }
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
                      Subjects
                    </h2>
                    <p className="text-muted-foreground hidden md:block">
                      Choose a subject to start practicing
                    </p>
                  </div>
                </div>
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search Subjects..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 transition-all border-primary-800 text-white rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6 flex items-center space-x-2 text-sm text-gray-600 text-gray-400">
              <Link to="/job-preparation/questions">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">Job Preparation</span>
              </Link>
              <span>/</span>
              <span className="text-blue-600 font-medium">Subjects</span>
            </div>

            {/* Content */}
            {subjectsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 text-gray-400">Loading subjects...</p>
                </div>
              </div>
            ) : filteredSubjects.length === 0 ? (
                <div>No subjects found</div>
            ) : (
              <>
                {renderGridView()}
                {subjectsData && !searchTerm.trim() && (
                  <TutorPagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(subjectsData.count / 20)}
                    onPageChange={handlePageChange}
                    hasNext={!!subjectsData.next}
                    hasPrevious={!!subjectsData.previous}
                  />
                )}
              </>
            )}
          </div>
        </main>
        <div className="h-20 md:h-8"></div>
        {userProfile ? '' : <Footer />}
      </ScrollArea>
    </div>
  );
};

export default SubjectsPage;
