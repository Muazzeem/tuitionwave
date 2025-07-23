
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CheckCircle, XCircle, PlayCircle, Clock, FileText, Users, Calendar, Filter } from "lucide-react";

interface ExamRecord {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'running' | 'completed' | 'failed';
  questionsCount: number;
  duration: number;
  score?: number;
  completedAt?: string;
  createdAt: string;
}

interface ExamHistoryProps {
  examRecords: ExamRecord[];
  examFilter: 'all' | 'active' | 'running' | 'completed' | 'failed';
  setExamFilter: (filter: 'all' | 'active' | 'running' | 'completed' | 'failed') => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  itemsPerPage: number;
}

export default function ExamHistory({
  examRecords,
  examFilter,
  setExamFilter,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage
}: ExamHistoryProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'active':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      running: 'bg-blue-100 text-blue-800 border-blue-200',
      active: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredExams = examFilter === 'all' 
    ? examRecords 
    : examRecords.filter(exam => exam.status === examFilter);

  const paginatedExams = filteredExams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <Label className="text-sm font-medium">Filter by Status:</Label>
          <Select value={examFilter} onValueChange={setExamFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Passed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {filteredExams.length} exams
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedExams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-medium line-clamp-2">{exam.title}</h3>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(exam.status)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusBadge(exam.status)}`}
                  >
                    {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                  </Badge>
                  
                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-3 w-3" />
                      {exam.category}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-3 w-3" />
                      {exam.questionsCount} Questions
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {exam.duration} Minutes
                    </div>
                  </div>
                </div>

                {exam.score !== undefined && (
                  <div className="pt-2 border-t">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Score: </span>
                      <span className={`font-medium ${exam.score >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                        {exam.score}%
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {exam.completedAt ? `Completed: ${exam.completedAt}` : `Created: ${exam.createdAt}`}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  {exam.status === 'active' && (
                    <Button size="sm" className="flex-1">
                      Start Exam
                    </Button>
                  )}
                  {exam.status === 'running' && (
                    <Button size="sm" variant="outline" className="flex-1">
                      Continue
                    </Button>
                  )}
                  {(exam.status === 'completed' || exam.status === 'failed') && (
                    <Button size="sm" variant="outline" className="flex-1">
                      View Results
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredExams.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {examFilter === 'all' ? 'No exams found' : `No ${examFilter} exams found`}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(Math.max(1, currentPage - 1));
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(Math.min(totalPages, currentPage + 1));
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
