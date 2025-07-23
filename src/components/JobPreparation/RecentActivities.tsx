
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Trophy, BookOpen } from 'lucide-react';

interface Activity {
  id: string;
  type: 'exam_completed' | 'exam_failed' | 'achievement' | 'study_session';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
}

export default function RecentActivities() {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'exam_completed',
      title: 'বাংলা সাহিত্য পরীক্ষা সম্পন্ন',
      description: 'মধ্যুগের কবি-সাহিত্যিক',
      timestamp: '2 hours ago',
      score: 85
    },
    {
      id: '2',
      type: 'achievement',
      title: 'নতুন র‌্যাঙ্ক অর্জন',
      description: 'আপনি #156 র‌্যাঙ্কে পৌঁছেছেন',
      timestamp: '5 hours ago'
    },
    {
      id: '3',
      type: 'study_session',
      title: 'অধ্যয়ন সেশন',
      description: 'গণিত - বীজগণিত চ্যাপটার সম্পন্ন',
      timestamp: '1 day ago'
    },
    {
      id: '4',
      type: 'exam_failed',
      title: 'পরীক্ষায় অকৃতকার্য',
      description: 'ইংরেজি ব্যাকরণ - পুনরায় চেষ্টা করুন',
      timestamp: '2 days ago',
      score: 45
    },
    {
      id: '5',
      type: 'exam_completed',
      title: 'সাধারণ জ্ঞান পরীক্ষা',
      description: 'বাংলাদেশের ইতিহাস ও সংস্কৃতি',
      timestamp: '3 days ago',
      score: 78
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'exam_completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'exam_failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'achievement':
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 'study_session':
        return <BookOpen className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'exam_completed':
        return 'bg-green-50 border-green-200';
      case 'exam_failed':
        return 'bg-red-50 border-red-200';
      case 'achievement':
        return 'bg-yellow-50 border-yellow-200';
      case 'study_session':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className='dark:bg-gray-800 dark:border-gray-700'>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className={`flex items-start gap-3 p-3 rounded-lg border ${getActivityColor(activity.type)}`}
            >
              <div className="mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-black">{activity.title}</h4>
                  <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                {activity.score && (
                  <Badge 
                    variant="outline" 
                    className={`mt-2 ${activity.score >= 50 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    Score: {activity.score}%
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
