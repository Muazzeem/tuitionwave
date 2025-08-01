import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen } from 'lucide-react';
import { getAccessToken } from '@/utils/auth';

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
    <Card className='dark:bg-gray-800 dark:border-gray-700'>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Study Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : (
            <div className="space-y-4">
              {subjects.map((subject) => (
                <div key={subject.subject_name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{subject.subject_name}</span>
                    <span className="text-muted-foreground">
                      {subject.completed}/{subject.total}
                    </span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                </div>
              ))}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
