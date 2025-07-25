import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CheckCircle, XCircle, PlayCircle, Clock, FileText, Users, Calendar, Filter, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAccessToken } from '@/utils/auth';
import ConfirmationDialog from '../ConfirmationDialog';
import { useToast } from '@/hooks/use-toast';

interface ApiExamRecord {
  uid: string;
  exam_type: string;
  exam_type_display: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
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
  // Props for external state management (your usage)
  examRecords?: ApiExamRecord[];
  examFilter?: 'all' | 'not_started' | 'in_progress' | 'completed';
  setExamFilter?: (filter: 'all' | 'not_started' | 'in_progress' | 'completed') => void;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  totalPages?: number;
  itemsPerPage?: number;

  // Props for internal API management
  baseUrl?: string;
  authToken?: string;
  useInternalApi?: boolean;

  // Callback for external state updates
  onExamUpdate?: (updatedExam: ApiExamRecord) => void;
}

export default function ExamHistory({
  // External props
  examRecords: externalExamRecords,
  examFilter: externalExamFilter,
  setExamFilter: externalSetExamFilter,
  currentPage: externalCurrentPage,
  setCurrentPage: externalSetCurrentPage,
  totalPages: externalTotalPages,
  itemsPerPage = 10,

  useInternalApi = false,
  onExamUpdate
}: ExamHistoryProps) {
  // Internal state (used when useInternalApi is true)
  const [internalExamRecords, setInternalExamRecords] = useState<ApiExamRecord[]>([]);
  const [internalExamFilter, setInternalExamFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all');
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const [internalTotalPages, setInternalTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ApiExamRecord | null>(null);

  // Determine which state to use
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
      const url = `${import.meta.env.VITE_API_URL}/api/exams/${statusParam}`;

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

      // Create updated exam object
      const updatedExam: ApiExamRecord = {
        ...selectedExam,
        status: 'in_progress',
        status_display: 'In Progress',
        started_at: new Date().toISOString(),
      };

      // Update state based on which mode we're in
      if (useInternalApi) {
        // Update internal state
        setInternalExamRecords(prevExams =>
          prevExams.map(exam =>
            exam.uid === selectedExam.uid ? updatedExam : exam
          )
        );
      } else if (onExamUpdate) {
        onExamUpdate(updatedExam);
      }

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
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      not_started: 'bg-orange-100 text-orange-800 border-orange-200'
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
          <Button size="sm" className="flex-1 text-white" onClick={() => {
            handleStartExam();
            setSelectedExam(exam);
          }}>
            Start Exam
          </Button>
        );
      case 'in_progress':
        return (
          <Button size="sm" variant="outline" className="flex-1 text-white"
            onClick={() => {
              setSelectedExam(exam);
            }}
          >
            Continue
          </Button>
        );
      case 'completed':
      case 'failed':
        return (
          <Button size="sm" variant="outline" className="flex-1 text-white"
            onClick={() => {
              setSelectedExam(exam);
            }}
          >
            View Results
          </Button>
        );
      default:
        return null;
    }
  };

  if (error && useInternalApi) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
        <Button onClick={() => fetchExams(examFilter, currentPage)} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Label className="text-sm font-medium">Filter by Status:</Label>
          <Select value={examFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
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
              Loading...
            </div>
          ) : (
            `Showing ${examRecords.length} ${useInternalApi ? `of ${totalCount}` : ''} exams`
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && useInternalApi && examRecords.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Exam Cards Grid */}
      {(!loading || !useInternalApi) && examRecords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedExams.map((exam) => (
            <Card key={exam.uid} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium line-clamp-2">{exam.exam_type_display}</h3>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(exam.status)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusBadge(exam.status)}`}
                    >
                      {exam.status_display}
                    </Badge>

                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-3 w-3" />
                        {exam.category_name}
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-3 w-3" />
                        {exam.question_limit} Questions
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {exam.duration_minutes} Minutes
                      </div>
                    </div>
                  </div>

                  {exam.status === 'completed' && exam.percentage > 0 && (
                    <div className="pt-2 border-t">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Score: </span>
                        <span className={`font-medium ${exam.percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                          {exam.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {exam.completed_at
                        ? `Completed: ${formatDate(exam.completed_at)}`
                        : exam.started_at
                          ? `Started: ${formatDate(exam.started_at)}`
                          : `Created: ${formatDate(exam.created_at)}`
                      }
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
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
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {examFilter === 'all' ? 'No exams found' : `No ${examFilter.replace('_', ' ')} exams found`}
          </p>
        </div>
      )}

      {/* Pagination */}
      {(!loading || !useInternalApi) && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
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
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirmCreateExam}
        title="Are you sure?"
        description=""
        variant="confirmation"
      />
    </div>
  );
}