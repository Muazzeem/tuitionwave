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

  if (loading) return <p>Loading exams...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <Card className="dark:bg-background dark:border-gray-900 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" />
            Recent Exam Activities
          </div>
          {exams.length > 0 && (
            <Badge variant="primary" className="text-xs">
              {exams.length} total
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {exams.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Ready to start your journey?</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Take your first exam and begin tracking your progress. Every expert was once a beginner!
            </p>
            <div className="space-y-3">
              <Link to="/job-preparation/practice">
                <Button className="bg-gradient-to-r from-blue-500 to-primary-500 hover:from-blue-600 hover:to-primary-600 text-white px-6 py-2 text-base font-medium">
                  🚀 Take Your First Exam
                </Button>
              </Link>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-green-700 dark:text-green-300">
                  💡 Tip: Start with easier topics to build confidence and momentum
                </p>
              </div>
            </div>
          </div>
        ) : (
            <div className="space-y-3">
              {exams.slice(0, 5).map((exam, index) => (
                <div
                  key={exam.uid}
                  className={`group relative p-4 border rounded-lg transition-all hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 ${index === 0 ? 'bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200 dark:border-blue-800' : 'dark:border-gray-700'
                    }`}
                >
                  {index === 0 && (
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-blue-500 text-white text-xs px-2 py-1">Latest</Badge>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {getStatusIcon(exam.status)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base mb-1 truncate">
                          {exam.subject_names?.length > 0
                            ? `${exam.subject_names.slice(0, 2).join(' • ')}${exam.subject_names.length > 2 ? ` +${exam.subject_names.length - 2} more` : ''}`
                            : exam.topic_names?.length > 0
                              ? `${exam.topic_names.slice(0, 2).join(' • ')}${exam.topic_names.length > 2 ? ` +${exam.topic_names.length - 2} more` : ''}`
                              : exam.exam_type_display}
                        </h4>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            📅 {new Date(exam.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            ⏱️ {new Date(exam.created_at).toLocaleTimeString('en-US', {
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
                        className={`${getStatusBadge(exam.status)} font-medium`}
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
                        <div className="text-xs text-muted-foreground">
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
                              variant="outline"
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

              {exams.length > 5 && (
                <div className="text-center pt-4 border-t dark:border-gray-800">
                  <Link to="/exam-history">
                    <Button variant="ghost" className="text-blue-600 dark:text-blue-400 hover:text-blue-700">
                      View All {exams.length} Exams →
                    </Button>
                  </Link>
                </div>
              )}

              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-1">
                      Keep the momentum going! 🎯
                    </h4>
                    <p className="text-sm text-purple-600 dark:text-purple-400">
                      Take another exam to improve your ranking
                    </p>
                  </div>
                  <Link to="/job-preparation/practice">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
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
