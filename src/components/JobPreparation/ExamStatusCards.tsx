import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, PlayCircle, Clock, FileText } from 'lucide-react';
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
      return { label: 'View Results', to: `/job-preparation/practice?tab=history` };
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
    <Card className="dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Exam Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {exams.slice(0, 5).map((exam) => (
            <div key={exam.uid} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(exam.status)}
                <div>
                  <h4 className="font-medium">
                    {exam.subject_names.join(', ') || exam.topic_names.join(', ') || exam.exam_type_display}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {new Date(exam.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={getStatusBadge(exam.status)}>
                  {exam.status.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                </Badge>
                <span className={`text-sm font-medium ${exam.percentage >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                  {exam.percentage}%
                </span>
                {(() => {
                  const action = getExamAction(exam.status, exam.uid);
                  return action ? (
                    <Link to={action.to}>
                      <Button size="sm" variant="outline" className="text-sm hover:bg-gray-900">
                        {action.label}
                      </Button>
                    </Link>
                  ) : null;
                })()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}