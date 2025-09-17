import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Trophy, Target, TrendingUp } from 'lucide-react';
import { getAccessToken } from '@/utils/auth';

interface QuickStatsData {
  totalExams: number;
  completedExams: number;
  averageScore: number;
  currentRank: number;
  totalStudents: number;
}

/** Skeleton while loading */
function SummarySkeleton() {
  return (
    <Card className="bg-background rounded-2xl border-0 p-5 sm:p-6">
      <Skeleton className="h-6 w-28 mb-6" />

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-x-10 gap-y-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center">
            <Skeleton className="h-12 w-12 rounded-xl mr-5" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
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
        Authorization: `Bearer ${accessToken}`,
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

  if (loading) return <SummarySkeleton />;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!data) return null;

  const stats = [
    { title: 'Total Exams', value: data.totalExams, icon: BookOpen },
    { title: 'Completed', value: data.completedExams, icon: Target },
    { title: 'Average Score', value: `${data.averageScore}%`, icon: TrendingUp },
    { title: 'Current Rank', value: data.currentRank, icon: Trophy },
  ];

  return (
    <Card className="bg-background rounded-2xl border-0 p-5 sm:p-5 lg:min-h-80">
      <h2 className="text-lg font-semibold text-white">Summary</h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-y-8 mt-2">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center">
            <div className="h-8 w-8 md:h-12 md:w-12 rounded-xl bg-background-700/80 flex items-center justify-center mr-5">
              <s.icon className="h-4 w-4 md:h-8 md:w-8 text-blue-600" />
            </div>
            <div className="leading-tight">
              <div className="text-xl md:text-3xl font-bold text-white">{s.value}</div>
              <div className="mt-1 text-base text-muted-foreground text-xs md:text-sm">{s.title}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
