
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, PlayCircle, Clock, FileText } from 'lucide-react';

interface ExamRecord {
  id: string;
  title: string;
  subject: string;
  status: 'completed' | 'failed' | 'running' | 'pending';
  score?: number;
  totalQuestions: number;
  duration: number;
  date: string;
}

export default function ExamStatusCards() {
  const examRecords: ExamRecord[] = [
    {
      id: '1',
      title: 'বাংলা সাহিত্য - মধ্যুগ',
      subject: 'বাংলা',
      status: 'completed',
      score: 85,
      totalQuestions: 20,
      duration: 30,
      date: '2024-01-15'
    },
    {
      id: '2',
      title: 'সাধারণ গণিত - বীজগণিত',
      subject: 'গণিত',
      status: 'running',
      totalQuestions: 25,
      duration: 45,
      date: '2024-01-16'
    },
    {
      id: '3',
      title: 'বাংলাদেশের ইতিহাস',
      subject: 'বাংলাদেশ বিষয়াবলী',
      status: 'failed',
      score: 45,
      totalQuestions: 30,
      duration: 60,
      date: '2024-01-14'
    },
    {
      id: '4',
      title: 'English Grammar - Tenses',
      subject: 'English',
      status: 'pending',
      totalQuestions: 15,
      duration: 20,
      date: '2024-01-17'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      running: 'bg-blue-100 text-blue-800',
      pending: 'bg-orange-100 text-orange-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className='dark:bg-gray-800 dark:border-gray-700'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Exam Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {examRecords.map((exam) => (
            <div key={exam.id} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(exam.status)}
                <div>
                  <h4 className="font-medium">{exam.title}</h4>
                  <p className="text-sm text-muted-foreground">{exam.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={getStatusBadge(exam.status)}>
                  {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                </Badge>
                {exam.score && (
                  <span className={`text-sm font-medium ${exam.score >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                    {exam.score}%
                  </span>
                )}
                <Button size="sm" variant="outline">
                  {exam.status === 'running' ? 'Continue' : 'View'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
