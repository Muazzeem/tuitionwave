import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen } from 'lucide-react';
import { getAccessToken } from '@/utils/auth';
import { Badge } from '../ui/badge';

export default function StudyProgress() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      const accessToken = getAccessToken();
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/exams/study-progress/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch progress');

        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching study progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  return (
    <Card className='bg-background border-gray-900 shadow-md'>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <BookOpen className="h-5 w-5 text-emerald-500" />
            Study Progress
          </div>
          {!loading && subjects.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {subjects.length} subjects
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-3"></div>
            <p className="text-sm text-muted-foreground">Loading your progress...</p>
          </div>
        ) : subjects.length === 0 ? (
          <div className="text-center py-12">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 from-emerald-900/20 to-green-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Start your study journey!</h3>
            <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
              Begin studying different subjects to track your learning progress here
            </p>
              <div className="bg-blue-50 bg-blue-900/20 border border-blue-200 border-blue-800 rounded-lg p-4 max-w-sm mx-auto">
                <p className="text-sm text-blue-700 text-blue-300">
                  Your study progress across subjects will appear here
              </p>
            </div>
          </div>
        ) : (
              <div className="space-y-5">
                {subjects.map((subject, index) => {
                  const progressPercentage = subject.total > 0 ? Math.round((subject.completed / subject.total) * 100) : 0;
                  const isCompleted = progressPercentage === 100;
                  const isHighProgress = progressPercentage >= 75;
                  const isMediumProgress = progressPercentage >= 50;

                  return (
                    <div
                      key={subject.subject_name}
                      className={`p-4 rounded-lg border text-white transition-all hover:shadow-sm ${isCompleted
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 from-green-900/20 to-emerald-900/20 border-green-200 border-green-800'
                        : isHighProgress
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 from-blue-900/20 to-indigo-900/20 border-blue-200 border-blue-800'
                          : 'border-gray-200 border-gray-700 hover:border-gray-300 hover:border-gray-600'
                        }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-base">{subject.subject_name}</span>
                          {isCompleted && (
                            <Badge className="bg-green-500 text-white text-xs px-2 py-1">
                              ✓ Complete
                            </Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <div className={`font-bold text-lg ${isCompleted ? 'text-green-600' :
                            isHighProgress ? 'text-blue-600' :
                              isMediumProgress ? 'text-yellow-600' :
                                'text-gray-400'
                            }`}>
                            {progressPercentage}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {subject.completed} of {subject.total} done
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Progress
                          value={progressPercentage}
                          className={`h-3 ${isCompleted ? '[&>div]:bg-green-500' :
                            isHighProgress ? '[&>div]:bg-blue-500' :
                              isMediumProgress ? '[&>div]:bg-yellow-500' :
                                '[&>div]:bg-gray-400'
                            }`}
                        />
                      </div>
                    </div>
                  );
                })}

                {/* Overall Progress Summary */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 from-purple-900/20 to-indigo-900/20 rounded-lg border border-purple-200 border-purple-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-purple-800 text-purple-300 mb-1">
                        Overall Progress
                      </h4>
                      <p className="text-sm text-purple-600 text-purple-400">
                        {(() => {
                          const completedSubjects = subjects.filter(s => s.completed === s.total).length;
                          const totalSubjects = subjects.length;
                          if (completedSubjects === totalSubjects) {
                            return `🎯 Amazing! All ${totalSubjects} subjects completed!`;
                          } else if (completedSubjects > 0) {
                            return `${completedSubjects}/${totalSubjects} subjects completed`;
                          } else {
                            return `${totalSubjects} subjects to explore`;
                          }
                        })()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-700 text-purple-300">
                        {Math.round(subjects.reduce((acc, s) => acc + (s.total > 0 ? (s.completed / s.total) * 100 : 0), 0) / subjects.length) || 0}%
                      </div>
                      <div className="text-xs text-purple-600 text-purple-400">average</div>
                    </div>
                  </div>
                </div>
              </div>
        )}
      </CardContent>
    </Card>
  );
}
