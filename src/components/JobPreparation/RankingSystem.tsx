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

      <Card className="lg:col-span-2 rounded-2xl bg-background-900 p-0 min-h-48 border-0">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
            <h2 className="text-lg font-semibold text-white">
              Top Rankers
            </h2>
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
              <div className="hidden sm:block bg-blue-50 bg-blue-900/20 border border-blue-200 border-blue-800 rounded-lg p-4 max-w-sm mx-auto">
                <p className="text-sm text-blue-700 text-blue-300">
                  Complete exams to earn points and see your ranking here
                </p>
              </div>
            </div>
          ) : (
              <div className="space-y-3">
                {topRankers.map((user, index) => (
                <div
                  key={user.id}
                    className={`flex items-center justify-between p-3 border transition-all hover:shadow-sm rounded-xl text-center border border-slate-800 bg-background-600/40 text-slate-300 text-sm`}
                >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {getRankIcon(user.rank)}
                      </div>
                      <Avatar className="">
                        <AvatarFallback className="font-medium bg-gray-900">
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
                    </div>
                  </div>
                ))}
              </div>
          )}
        </CardContent>
      </Card>


      <Card className="rounded-2xl bg-background-900 p-0 min-h-48 border-0">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-white">
                Your Ranking
              </h2>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentUser.rank ? (
            <>
              <div className="text-center p-6 border transition-all hover:shadow-sm rounded-xl text-center border border-slate-800 bg-background-600/40 text-slate-300 text-sm">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="text-xl sm:text-3xl lg:text-4xl font-semibold font-unbounded">
                    #{currentUser.rank}
                  </div>
                  {currentUser.rank <= 3 && (
                    <div className="text-2xl">
                      {currentUser.rank === 1 ? '🥇' : currentUser.rank === 2 ? '🥈' : '🥉'}
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-white text-slate-300">
                  {currentUser.rank === 1 ? 'Champion!' : currentUser.rank <= 3 ? 'Top Performer!' : 'Current Rank'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-transparent rounded-xl border border-gray-700">
                  <div className="text-xl md:text-2xl font-bold text-gray-100">
                    {currentUser.score}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Total Points</p>
                </div>

                <div className="text-center p-4 bg-transparent rounded-xl border border-gray-700">
                  <div className="text-xl md:text-2xl font-bold text-gray-100">
                    {currentUser.totalExams}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
                <div className="rounded-2xl bg-background-900 p-0 min-h-48 border-0">
                  <Award className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">Not ranked yet</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Complete your first exam to get ranked
                </p>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
