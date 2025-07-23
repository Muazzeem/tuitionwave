
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Trophy, Target, TrendingUp } from 'lucide-react';

interface QuickStatsProps {
  data: {
    totalExams: number;
    completedExams: number;
    averageScore: number;
    currentRank: number;
    totalStudents: number;
  };
}

export default function QuickStats({ data }: QuickStatsProps) {
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
        <Card key={index}>
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
