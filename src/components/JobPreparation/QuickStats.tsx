import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Trophy, Target, TrendingUp } from 'lucide-react';
import { getAccessToken } from '@/utils/auth';

interface QuickStatsData {
  totalExams: number;
  completedExams: number;
  averageScore: number;
  currentRank: number;
  totalStudents: number;
}

export default function QuickStatsSection() {
  const [data, setData] = useState<QuickStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = getAccessToken();
    fetch(`${import.meta.env.VITE_API_URL}/api/users/quick-stats/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if required:
        'Authorization': `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error loading stats');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading quick stats...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data) return null;

  const stats = [
    {
      title: 'Total Exams',
      value: data.totalExams,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Completed',
      value: data.completedExams,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Average Score',
      value: `${data.averageScore}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Current Rank',
      value: `#${data.currentRank}`,
      icon: Trophy,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className='dark:bg-gray-800 dark:border-gray-700'>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
