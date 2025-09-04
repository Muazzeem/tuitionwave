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

      <Card className="lg:col-span-2 bg-background border-gray-900 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topRankers.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 from-yellow-900/20 to-orange-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-white">No leaderboard yet!</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to complete an exam and claim the top spot
              </p>
              <div className="bg-blue-50 bg-blue-900/20 border border-blue-200 border-blue-800 rounded-lg p-4 max-w-sm mx-auto">
                <p className="text-sm text-blue-700 text-blue-300">
                  💡 Complete exams to earn points and see your ranking here
                </p>
              </div>
            </div>
          ) : (
              <div className="space-y-3">
                {topRankers.map((user, index) => (
                <div
                  key={user.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:shadow-sm ${index === 0
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 from-yellow-900/20 to-orange-900/20 border-yellow-200 border-yellow-800'
                      : index === 1
                        ? 'bg-gradient-to-r from-gray-50 to-slate-50 from-gray-900/20 to-slate-900/20 border-gray-200 border-gray-700'
                        : index === 2
                          ? 'bg-gradient-to-r from-orange-50 to-red-50 from-orange-900/20 to-red-900/20 border-orange-200 border-orange-800'
                          : 'border-gray-200 border-gray-700 hover:border-gray-300 hover:border-gray-600'
                      }`}
                >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getRankIcon(user.rank)}
                      </div>
                      <Avatar className="h-10 w-10 bg-white shadow-sm">
                        <AvatarFallback className="font-medium">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-semibold text-base">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">
                          {user.totalExams} exam{user.totalExams !== 1 ? 's' : ''} completed
                      </p>
                    </div>
                  </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-lg">{user.score}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                      {user.change !== 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-white bg-gray-800 shadow-sm">
                          {getChangeIndicator(user.change)}
                        <span
                            className={`${user.change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                          {Math.abs(user.change)}
                        </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {topRankers.length < 10 && (
                  <div className="mt-6 p-4 bg-gray-50 bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-300 border-gray-700 text-center">
                    <p className="text-sm text-muted-foreground">
                      🎯 More spots available! Keep completing exams to join the leaderboard
                    </p>
                  </div>
                )}
              </div>
          )}
        </CardContent>
      </Card>


      <Card className="bg-background border-gray-900 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Award className="h-5 w-5 text-blue-500" />
            Your Ranking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentUser.rank ? (
            <>
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 from-blue-900/20 to-indigo-900/20 rounded-lg border border-blue-200 border-blue-800">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    #{currentUser.rank}
                  </div>
                  {currentUser.rank <= 3 && (
                    <div className="text-2xl">
                      {currentUser.rank === 1 ? '🥇' : currentUser.rank === 2 ? '🥈' : '🥉'}
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-blue-700 text-blue-300">
                  {currentUser.rank === 1 ? 'Champion!' : currentUser.rank <= 3 ? 'Top Performer!' : 'Current Rank'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 bg-gray-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 text-gray-100">
                    {currentUser.score}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total Points</p>
                </div>

                <div className="text-center p-4 bg-gray-50 bg-gray-900/50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 text-gray-100">
                    {currentUser.totalExams}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Exam{currentUser.totalExams !== 1 ? 's' : ''} Done
                  </p>
                </div>
              </div>

              {currentUser.change !== 0 && (
                <div className={`p-4 rounded-lg border-l-4 ${currentUser.change > 0
                  ? 'bg-green-50 bg-green-900/20 border-green-500 border-green-400'
                  : 'bg-red-50 bg-red-900/20 border-red-500 border-red-400'
                  }`}>
                  <div className="flex items-center gap-3">
                    {getChangeIndicator(currentUser.change)}
                    <div>
                      <p className={`font-semibold text-sm ${currentUser.change > 0 ? 'text-green-700 text-green-300' : 'text-red-700 text-red-300'
                        }`}>
                        {currentUser.change > 0 ? 'Rank Improved!' : 'Rank Dropped'}
                      </p>
                      <p className={`text-xs ${currentUser.change > 0 ? 'text-green-600 text-green-400' : 'text-red-600 text-red-400'
                        }`}>
                        {currentUser.change > 0 ? 'Up' : 'Down'} {Math.abs(currentUser.change)} position{Math.abs(currentUser.change) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-gray-800">
                <p className="text-xs text-center text-muted-foreground">
                  💪 Keep taking exams to climb higher!
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 from-gray-900/20 to-slate-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">Not ranked yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Complete your first exam to get ranked
                </p>
                <div className="bg-amber-50 bg-amber-900/20 border border-amber-200 border-amber-800 rounded-lg p-3">
                  <p className="text-sm text-amber-700 text-amber-300">
                    🚀 Start your journey to the top!
                  </p>
                </div>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
