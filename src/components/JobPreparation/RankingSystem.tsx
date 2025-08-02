import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { getAccessToken } from '@/utils/auth';

interface RankingUser {
  id: string;
  name: string;
  score: number;
  rank: number;
  change: number;
  totalExams: number;
}

export default function RankingSystem() {
  const [currentUser, setCurrentUser] = useState<RankingUser | null>(null);
  const [topRankers, setTopRankers] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = getAccessToken();
    const fetchRankings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/model-test-users/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch rankings');
        const data = await res.json();
        setTopRankers(data.top_users);
        setCurrentUser(data.current_user);
      } catch (err) {
        console.error('Error loading ranking data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

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

  if (loading || !currentUser) {
    return <div className="text-center p-4">Loading rankings...</div>;
  }

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
          {topRankers.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm p-4">
              No top performers found yet.
            </div>
          ) : (
              <div className="space-y-4">
                {topRankers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getRankIcon(user.rank)}
                    <Avatar className="h-8 w-8 bg-white">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user.totalExams} exams completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold">{user.score}</span>
                    <div className="flex items-center gap-1">
                      {getChangeIndicator(user.change)}
                      {user.change !== 0 && (
                        <span
                          className={`text-sm ${user.change > 0 ? 'text-green-500' : 'text-red-500'
                            }`}
                        >
                          {Math.abs(user.change)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>
          )}
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
            <div className="text-3xl font-bold text-primary">#{currentUser.rank || 0}</div>
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
                  {currentUser.change > 0 ? '+' : ''}
                  {currentUser.change}
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
