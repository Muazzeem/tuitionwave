
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, TrendingUp, TrendingDown } from 'lucide-react';

interface RankingUser {
  id: string;
  name: string;
  score: number;
  rank: number;
  change: number;
  totalExams: number;
}

export default function RankingSystem() {
  const currentUser: RankingUser = {
    id: 'current',
    name: 'You',
    score: 1650,
    rank: 156,
    change: 12,
    totalExams: 32
  };

  const topRankers: RankingUser[] = [
    { id: '1', name: 'রহিম আহমেদ', score: 2450, rank: 1, change: 0, totalExams: 58 },
    { id: '2', name: 'সারা খান', score: 2380, rank: 2, change: 1, totalExams: 55 },
    { id: '3', name: 'করিম উদ্দিন', score: 2320, rank: 3, change: -1, totalExams: 52 },
    { id: '4', name: 'ফাতিমা বেগম', score: 2280, rank: 4, change: 2, totalExams: 50 },
    { id: '5', name: 'আলী হাসান', score: 2250, rank: 5, change: -1, totalExams: 48 }
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <span className="text-muted-foreground">-</span>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topRankers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {getRankIcon(user.rank)}
                  <Avatar className="h-8 w-8 bg-white">
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <p className="text-sm text-muted-foreground">{user.totalExams} exams completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">{user.score}</span>
                  <div className="flex items-center gap-1">
                    {getChangeIndicator(user.change)}
                    {user.change !== 0 && (
                      <span className={`text-sm ${user.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {Math.abs(user.change)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Your Ranking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 dark:bg-gray-900 rounded-lg">
            <div className="text-3xl font-bold text-primary">#{currentUser.rank}</div>
            <p className="text-sm text-muted-foreground">Current Rank</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Total Score</span>
              <span className="font-medium">{currentUser.score}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Rank Change</span>
              <div className="flex items-center gap-1">
                {getChangeIndicator(currentUser.change)}
                <span className={`text-sm ${currentUser.change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {currentUser.change > 0 ? '+' : ''}{currentUser.change}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Total Exams</span>
              <span className="font-medium">{currentUser.totalExams}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
