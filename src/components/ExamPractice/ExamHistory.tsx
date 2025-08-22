import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CheckCircle, XCircle, PlayCircle, Clock, FileText, Calendar, Filter, Loader2, AlertCircle, BookOpen, PlusCircle, Trophy, Target, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAccessToken } from '@/utils/auth';
import ConfirmationDialog from '../ConfirmationDialog';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface ApiExamRecord {
  uid: string;
  exam_type: string;
  exam_type_display: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed' | 'expired';
  status_display: string;
  question_limit: number;
  total_questions: number;
  total_marks: number;
  duration_minutes: number;
  percentage: number;
  category_name: string;
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
  baseUrl?: string;
  authToken?: string;
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
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ApiExamRecord | null>(null);

  const examRecords = useInternalApi ? internalExamRecords : (externalExamRecords || []);
  const examFilter = useInternalApi ? internalExamFilter : (externalExamFilter || 'all');
  const setExamFilter = useInternalApi ? setInternalExamFilter : (externalSetExamFilter || (() => { }));
  const currentPage = useInternalApi ? internalCurrentPage : (externalCurrentPage || 1);
  const setCurrentPage = useInternalApi ? setInternalCurrentPage : (externalSetCurrentPage || (() => { }));
  const totalPages = useInternalApi ? internalTotalPages : (externalTotalPages || 1);
  const accessToken = getAccessToken();
  const { toast } = useToast();

  const fetchExams = async (status: string = '', page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const statusParam = status !== 'all' && status ? `?status=${status}&page=${page}` : `?page=${page}`;
      const url = `${import.meta.env.VITE_API_URL}/api/exams?exam_type=custom${statusParam}`;

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
      setTotalCount(data.count);
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

      const data = await response.json();

      // Navigate to the exam page
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
    console.log(exam)
    // navigate(`/job-preparation/exam/${exam.uid}/results`);
  };

  const displayedExams = useInternalApi
    ? examRecords
    : examRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in_progress':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'not_started':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'expired':
        return <Clock className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
      failed: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
      not_started: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200';
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
            className="w-full sm:flex-1 border-primary bg-primary-600 hover:bg-primary-800 text-white transition-colors"
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
            className="w-full sm:flex-1 border-primary bg-primary-600 hover:bg-primary-800 text-white transition-colors"
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
            className="w-full sm:flex-1 border-primary bg-primary-600 hover:bg-primary-800 text-white transition-colors"
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
            <Loader2 className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-900">
      <div className="space-y-6 mt-6">
        {/* Header and Filter Section */}
        <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <Label className="text-sm font-medium whitespace-nowrap">Filter Status:</Label>
            </div>
            <Select value={examFilter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-full sm:w-40 bg-background border-muted">
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

          <div className="text-sm text-muted-foreground">
            {loading && useInternalApi ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading exams...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>
                  Showing {examRecords.length} {useInternalApi ? `of ${totalCount}` : ''} exams
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && useInternalApi && examRecords.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Loading your exams...</p>
            </div>
          </div>
        )}

        {/* Exam Cards Grid */}
        {(!loading || !useInternalApi) && examRecords.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {displayedExams.map((exam) => (
              <Card key={exam.uid} className="group transition-all duration-300 hover:-translate-y-1 dark:bg-background hover:border-primary shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm sm:text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {exam.exam_type_display}
                      </h3>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {getStatusIcon(exam.status)}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${getStatusBadge(exam.status)}`}
                      >
                        {exam.status_display}
                      </Badge>
                    </div>

                    {/* Exam Details */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3 flex-shrink-0" />
                          <span>{exam.question_limit} Questions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>{exam.duration_minutes} Min</span>
                        </div>
                      </div>

                      {/* Score Display */}
                      {(exam.status === 'completed' || exam.status === 'failed') && (
                        <div className="bg-gray-900 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Score</span>
                            <span className={`font-bold text-lg ${getScoreColor(exam.percentage)}`}>
                              {exam.percentage.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-2">
                            <div
                              className={`h-2 rounded-full transition-all ${exam.percentage >= 80 ? 'bg-green-500' :
                                exam.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                              style={{ width: `${Math.min(exam.percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Date Information */}
                      <div className="text-xs text-muted-foreground">
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
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 border-t border-muted">
                      {getActionButton(exam)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {(!loading || !useInternalApi) && examRecords.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <Card className="max-w-md mx-auto shadow-md border border-primary bg-background">
              <CardContent className="p-6 sm:p-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">No Exam History</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 leading-relaxed">
                  {examFilter === 'all'
                    ? 'You haven\'t taken any exams yet. Start your preparation journey and track your progress!'
                    : `No ${examFilter.replace('_', ' ')} exams found. Try a different filter or create a new exam to get started.`
                  }
                </p>
                <div className="space-y-3">
                  <Link to="/job-preparation/practice" className="block">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white transition-colors">
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
                      View All Exams
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pagination */}
        {(!loading || !useInternalApi) && totalPages > 1 && (
          <div className="flex justify-center pt-6 pb-4">
            <Pagination>
              <PaginationContent className="flex-wrap gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        handlePageChange(currentPage - 1);
                      }
                    }}
                    className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : 'hover:bg-muted'} transition-colors`}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(pageNum);
                        }}
                        isActive={currentPage === pageNum}
                        className="transition-colors hover:bg-muted"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        handlePageChange(currentPage + 1);
                      }
                    }}
                    className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'hover:bg-muted'} transition-colors`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
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