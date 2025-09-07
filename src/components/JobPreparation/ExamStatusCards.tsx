import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, PlayCircle, Clock, FileText, BookOpen } from 'lucide-react';
import { getAccessToken } from '@/utils/auth';
import { Link } from 'react-router-dom';

interface ExamRecord {
  uid: string;
  subject_names: string[];
  topic_names: string[];
  status: 'completed' | 'in_progress' | 'not_started' | 'expired';
  percentage: number;
  total_questions: number;
  duration_minutes: number;
  created_at: string;
  exam_type_display: string;
}

const getExamAction = (status: string, uid: string) => {
  switch (status) {
    case 'in_progress':
      return { label: 'View', to: `/job-preparation/exam/${uid}` };
    case 'completed':
      return { label: 'View Results', to: `/job-preparation/exam/${uid}/results` };
    case 'not_started':
      return { label: 'View', to: `/job-preparation/practice?tab=history` };
    default:
      return null;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'expired':
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
    completed: 'bg-green-100 text-green-800',
    expired: 'bg-red-100 text-red-800',
    in_progress: 'bg-blue-100 text-blue-800',
    not_started: 'bg-orange-100 text-orange-800'
  };
  return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
};

export default function ExamStatusCards() {
  const [exams, setExams] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchExams = async () => {
    const accessToken = getAccessToken();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/exams/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch exams');
      const data = await response.json();
      setExams(data.results);

    } catch (err: any) {
      setError('Failed to fetch exams.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  if (loading) return <p className="text-center p-4">Loading exams...</p>;
  if (error) return <p className="text-red-600 text-center p-4">{error}</p>;

  return (
    <Card className="w-full mx-auto bg-background border-gray-900 shadow-md">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <span className="text-base sm:text-lg text-white">Recent Exam Activities</span>
          </div>
          {exams.length > 0 && (
            <Badge variant="primary" className="text-xs self-start sm:self-center border-0">
              {exams.length} total
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        {exams.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 from-blue-900/20 to-indigo-900/20 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3 px-4">
              Ready to start your journey?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm sm:text-base px-4">
              Take your first exam and begin tracking your progress. Every expert was once a beginner!
            </p>
            <div className="space-y-3 px-4">
              <Link to="/job-preparation/practice">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-2 text-sm sm:text-base font-medium">
                  🚀 Take Your First Exam
                </Button>
              </Link>
              <div className="bg-green-50 bg-green-900/20 border border-green-200 border-green-800 rounded-lg p-3 sm:p-4 max-w-md mx-auto">
                <p className="text-xs sm:text-sm text-green-700 text-green-300">
                  💡 Tip: Start with easier topics to build confidence and momentum
                </p>
              </div>
            </div>
          </div>
        ) : (
            <div className="space-y-3 sm:space-y-4">
              {exams.slice(0, 5).map((exam, index) => (
                <div
                  key={exam.uid}
                  className={`group relative p-3 sm:p-4 border rounded-lg transition-all hover:shadow-md hover:border-gray-300 hover:border-gray-600 ${index === 0
                    ? 'bg-gradient-to-r from-blue-50/50 to-indigo-50/50 from-blue-900/10 to-indigo-900/10 border-blue-200 border-blue-800'
                    : 'border-gray-700'
                    }`}
                >
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-blue-500 text-white text-xs px-2 py-1">Latest</Badge>
                    </div>
                  )}

                  {/* Mobile Layout */}
                  <div className="block sm:hidden space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(exam.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1 line-clamp-2 text-white">
                            {exam.subject_names?.length > 0
                              ? `${exam.subject_names.slice(0, 1).join('')}${exam.subject_names.length > 1 ? ` +${exam.subject_names.length - 1} more` : ''}`
                              : exam.topic_names?.length > 0
                                ? `${exam.topic_names.slice(0, 1).join('')}${exam.topic_names.length > 1 ? ` +${exam.topic_names.length - 1} more` : ''}`
                                : exam.exam_type_display}
                          </h4>
                          <Badge
                            variant="outline"
                            className={`${getStatusBadge(exam.status)} font-medium hidden sm:block text-xs`}
                          >
                            {exam.status.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`text-lg font-bold ${exam.percentage >= 80 ? 'text-green-600' :
                          exam.percentage >= 60 ? 'text-yellow-600' :
                            exam.percentage >= 40 ? 'text-orange-600' :
                              'text-red-600'
                          }`}>
                          {exam.percentage}%
                        </div>
                        <div className="text-xs text-muted-foreground hidden sm:block">
                          {exam.percentage >= 80 ? 'Excellent' :
                            exam.percentage >= 60 ? 'Good' :
                              exam.percentage >= 40 ? 'Fair' :
                                'Needs Work'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          {new Date(exam.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          {new Date(exam.created_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {(() => {
                        const action = getExamAction(exam.status, exam.uid);
                        return action ? (
                          <Link to={action.to}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs bg-gradient-to-r from-blue-500 to-primary-500 text-white border-none hover:from-blue-600 hover:to-primary-600 transition-all h-7 px-3"
                            >
                              {action.label}
                            </Button>
                          </Link>
                        ) : null;
                      })()}
                    </div>
                  </div>

                  {/* Desktop/Tablet Layout */}
                  <div className="hidden sm:flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getStatusIcon(exam.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base mb-1 truncate text-white">
                          {exam.subject_names?.length > 0
                            ? `${exam.subject_names.slice(0, 2).join(' • ')}${exam.subject_names.length > 2 ? ` +${exam.subject_names.length - 2} more` : ''}`
                            : exam.topic_names?.length > 0
                              ? `${exam.topic_names.slice(0, 2).join(' • ')}${exam.topic_names.length > 2 ? ` +${exam.topic_names.length - 2} more` : ''}`
                              : exam.exam_type_display}
                        </h4>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {new Date(exam.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            {new Date(exam.created_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Badge
                        variant="outline"
                        className={`${getStatusBadge(exam.status)} font-medium hidden md:inline-flex`}
                      >
                        {exam.status.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                      </Badge>

                      <div className="text-right">
                        <div className={`text-lg font-bold ${exam.percentage >= 80 ? 'text-green-600' :
                          exam.percentage >= 60 ? 'text-yellow-600' :
                            exam.percentage >= 40 ? 'text-orange-600' :
                              'text-red-600'
                          }`}>
                          {exam.percentage}%
                        </div>
                        <div className="text-xs text-muted-foreground hidden sm:block">
                          {exam.percentage >= 80 ? 'Excellent' :
                            exam.percentage >= 60 ? 'Good' :
                              exam.percentage >= 40 ? 'Fair' :
                                'Needs Work'}
                        </div>
                      </div>

                      {(() => {
                        const action = getExamAction(exam.status, exam.uid);
                        return action ? (
                          <Link to={action.to}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-sm bg-gradient-to-r from-blue-500 to-primary-500 text-white border-none hover:from-blue-600 hover:to-primary-600 transition-all"
                            >
                              {action.label}
                            </Button>
                          </Link>
                        ) : null;
                      })()}
                    </div>
                </div>
              </div>
            ))}

              <div className="mt-6 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-200 border-purple-800">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-purple-800 text-purple-300 mb-1 text-sm sm:text-base">
                      Keep the momentum going! 🎯
                    </h4>
                    <p className="text-xs sm:text-sm text-purple-600 text-purple-400">
                      Take another exam to improve your ranking
                    </p>
                  </div>
                  <Link to="/job-preparation/practice" className="w-full sm:w-auto">
                    <Button
                      size="sm"
                      className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs sm:text-sm"
                    >
                      Take Another Exam
                    </Button>
                  </Link>
                </div>
              </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
