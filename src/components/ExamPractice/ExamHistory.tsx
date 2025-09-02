
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle, 
  XCircle, 
  PlayCircle, 
  Clock, 
  FileText, 
  Calendar, 
  Filter, 
  Loader2, 
  AlertCircle, 
  BookOpen, 
  PlusCircle, 
  Trophy, 
  Target, 
  RefreshCw
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAccessToken } from '@/utils/auth';
import ConfirmationDialog from '../ConfirmationDialog';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ApiExamRecord {
  uid: string;
  exam_type: string;
  exam_type_display: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'expired';
  status_display: string;
  subject_names: string[];
  topic_names: string[];
  question_limit: number;
  total_questions: number;
  total_marks: number;
  duration_minutes: number;
  percentage: number;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

interface ApiResponse {
  count: number;
  total_pages: number;
  current_page: number;
  next: string | null;
  previous: string | null;
  results: ApiExamRecord[];
}

interface ExamHistoryProps {
  examRecords?: ApiExamRecord[];
  examFilter?: 'all' | 'not_started' | 'in_progress' | 'completed';
  setExamFilter?: (filter: 'all' | 'not_started' | 'in_progress' | 'completed') => void;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  totalPages?: number;
  itemsPerPage?: number;
  useInternalApi?: boolean;
  onExamUpdate?: (updatedExam: ApiExamRecord) => void;
}

export default function ExamHistory({
  examRecords: externalExamRecords,
  examFilter: externalExamFilter,
  setExamFilter: externalSetExamFilter,
  currentPage: externalCurrentPage,
  setCurrentPage: externalSetCurrentPage,
  totalPages: externalTotalPages,
  itemsPerPage = 10,
  useInternalApi = false,
}: ExamHistoryProps) {
  const navigate = useNavigate();

  const [internalExamRecords, setInternalExamRecords] = useState<ApiExamRecord[]>([]);
  const [internalExamFilter, setInternalExamFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalTotalPages, setInternalTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ApiExamRecord | null>(null);

  const examRecords = useInternalApi ? internalExamRecords : (externalExamRecords || []);
  const examFilter = useInternalApi ? internalExamFilter : (externalExamFilter || 'all');
  const setExamFilter = useInternalApi ? setInternalExamFilter : (externalSetExamFilter || (() => { }));
  const currentPage = useInternalApi ? internalCurrentPage : (externalCurrentPage || 1);
  const setCurrentPage = useInternalApi ? setInternalCurrentPage : (externalSetCurrentPage || (() => { }));
  const totalPages = useInternalApi ? internalTotalPages : (externalTotalPages || Math.ceil(examRecords.length / itemsPerPage));
  const accessToken = getAccessToken();
  const { toast } = useToast();

  const fetchExams = async (status: string = '', page: number = 1, showRefresh: boolean = false) => {
    if (showRefresh) {
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const params = new URLSearchParams();
      if (status !== 'all' && status) {
        params.append('status', status);
      }
      params.append('page', page.toString());
      
      const url = `${import.meta.env.VITE_API_URL}/api/exams/?${params.toString()}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      setInternalExamRecords(data.results);
      setInternalTotalPages(data.total_pages);
      setInternalCurrentPage(data.current_page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exams');
      setInternalExamRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (useInternalApi) {
      fetchExams(examFilter, currentPage);
    }
  }, [examFilter, currentPage, useInternalApi]);

  const handleFilterChange = (newFilter: 'all' | 'not_started' | 'in_progress' | 'completed') => {
    setExamFilter(newFilter);
    if (useInternalApi) {
      setInternalCurrentPage(1);
    } else if (externalSetCurrentPage) {
      externalSetCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStartExam = () => {
    setIsOpen(true);
  };

  async function handleConfirmCreateExam(): Promise<void> {
    if (!selectedExam) return;

    const url = `${import.meta.env.VITE_API_URL}/api/exams/${selectedExam.uid}/start/`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to start exam.",
          variant: "destructive",
        });
        return;
      }

      navigate(`/job-preparation/exam/${selectedExam.uid}`);

      toast({
        title: "Success",
        description: "Exam started successfully.",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsOpen(false);
      setSelectedExam(null);
    }
  }

  const handleContinueExam = (exam: ApiExamRecord) => {
    navigate(`/job-preparation/exam/${exam.uid}`);
  };

  const handleViewResults = (exam: ApiExamRecord) => {
    navigate(`/job-preparation/exam/${exam.uid}/results`);
  };

  const displayedExams = useInternalApi
    ? examRecords
    : examRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusIcon = (status: string) => {
    const iconClass = "h-5 w-5";
    switch (status) {
      case 'completed':
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case 'failed':
        return <XCircle className={`${iconClass} text-red-500`} />;
      case 'in_progress':
        return <PlayCircle className={`${iconClass} text-blue-500`} />;
      case 'not_started':
        return <Clock className={`${iconClass} text-orange-500`} />;
      case 'expired':
        return <Clock className={`${iconClass} text-red-500`} />;
      default:
        return <Clock className={`${iconClass} text-gray-500`} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'failed':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'not_started':
        return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800';
      case 'expired':
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionButton = (exam: ApiExamRecord) => {
    switch (exam.status) {
      case 'not_started':
        return (
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-blue-500 to-primary-500 hover:from-blue-600 hover:to-primary-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => {
              handleStartExam();
              setSelectedExam(exam);
            }}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Start Exam
          </Button>
        );
      case 'in_progress':
        return (
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => handleContinueExam(exam)}
          >
            <PlayCircle className="h-4 w-4 mr-2" />
            Continue
          </Button>
        );
      case 'completed':
      case 'expired':
      case 'failed':
        return (
          <Button
            size="sm"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => handleViewResults(exam)}
          >
            <Trophy className="h-4 w-4 mr-2" />
            View Results
          </Button>
        );
      default:
        return null;
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (showEllipsis) {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis1');
      }
      
      // Show current page and surrounding pages
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis2');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    } else {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) handlePageChange(currentPage - 1);
              }}
              className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          
          {pages.map((page, index) => (
            <PaginationItem key={index}>
              {typeof page === 'string' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page);
                  }}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) handlePageChange(currentPage + 1);
              }}
              className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const getQuickStats = () => {
    const completed = examRecords.filter(exam => exam.status === 'completed').length;
    const inProgress = examRecords.filter(exam => exam.status === 'in_progress').length;
    const notStarted = examRecords.filter(exam => exam.status === 'not_started').length;
    
    return { completed, inProgress, notStarted, total: examRecords.length };
  };

  const stats = getQuickStats();

  if (error && useInternalApi) {
    return (
      <div className="space-y-6 p-4">
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <div className="text-center">
          <Button onClick={() => fetchExams(examFilter, currentPage)} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900 min-h-screen">
      <div className="space-y-6">

        {/* Filter and Control Section */}
        <Card className="bg-gray-900 border-0">
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  <Label className="text-sm font-medium whitespace-nowrap">Filter Status:</Label>
                </div>
                <Select value={examFilter} onValueChange={handleFilterChange}>
                  <SelectTrigger className="w-full sm:w-48 bg-background border-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900">
                    <SelectItem value="all">All Exams</SelectItem>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && useInternalApi && examRecords.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <Card className="p-8 text-center">
              <CardContent>
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Loading Your Exams</h3>
                <p className="text-muted-foreground">Please wait while we fetch your exam history...</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Exam Cards Grid */}
        {(!loading || !useInternalApi) && displayedExams.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {displayedExams.map((exam) => (
              <Card key={exam.uid} className="dark:bg-background border border-muted hover:border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                      {exam.exam_type_display}
                    </CardTitle>
                    {getStatusIcon(exam.status)}
                  </div>
                  
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium w-fit ${getStatusBadge(exam.status)}`}
                  >
                    {exam.status_display}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Exam Metadata */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileText className="h-4 w-4 flex-shrink-0" />
                      <span>{exam.question_limit} Questions</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4 flex-shrink-0" />
                      <span>{exam.duration_minutes} Min</span>
                    </div>
                  </div>

                  {/* Score Display */}
                  {exam.status && (
                    <div className="bg-muted/30 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Final Score</span>
                        <span className={`font-bold text-lg ${getScoreColor(exam.percentage)}`}>
                          {exam.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            exam.percentage >= 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                            exam.percentage >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                            'bg-gradient-to-r from-red-400 to-red-500'
                          }`}
                          style={{ width: `${Math.min(exam.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Subjects and Topics */}
                  {(exam.subject_names?.length > 0 || exam.topic_names?.length > 0) && (
                    <div className="space-y-2">
                      {exam.subject_names?.length > 0 && (
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Subjects:</p>
                          <div className="flex flex-wrap gap-1">
                            {exam.subject_names.slice(0, 2).map((subject, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                            {exam.subject_names.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{exam.subject_names.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Date Information */}
                  <div className="text-xs text-muted-foreground border-t pt-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {exam.completed_at
                          ? `Completed: ${formatDate(exam.completed_at)}`
                          : exam.started_at
                            ? `Started: ${formatDate(exam.started_at)}`
                            : `Created: ${formatDate(exam.created_at)}`
                        }
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="pt-2">
                    {getActionButton(exam)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {(!loading || !useInternalApi) && displayedExams.length === 0 && (
          <div className="text-center py-16">
            <Card className="max-w-md mx-auto shadow-lg border-2 border-dashed border-muted bg-card/50">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">No Exam History</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {examFilter === 'all'
                    ? 'You haven\'t taken any exams yet. Start your preparation journey and track your progress!'
                    : `No ${examFilter.replace('_', ' ')} exams found. Try a different filter or create a new exam to get started.`
                  }
                </p>
                <div className="space-y-3">
                  <Link to="/job-preparation/practice" className="block">
                    <Button className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create New Exam
                    </Button>
                  </Link>
                  {examFilter !== 'all' && (
                    <Button
                      variant="outline"
                      onClick={() => handleFilterChange('all')}
                      className="w-full hover:bg-muted transition-colors"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      View All Exams
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Pagination */}
        {displayedExams.length > 0 && totalPages > 1 && (
          <Card className="border-0 bg-gray-900">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {renderPagination()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={handleConfirmCreateExam}
          title="Start Exam Confirmation"
          description="Are you ready to begin this exam? Once started, the timer will begin and you cannot pause the exam."
          variant="confirmation"
        />
      </div>
    </div>
  );
}
