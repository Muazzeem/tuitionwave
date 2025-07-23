
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BookOpen } from 'lucide-react';

export default function StudyProgress() {
  const subjects = [
    { name: 'বাংলা', progress: 85, total: 120, completed: 102 },
    { name: 'English', progress: 72, total: 100, completed: 72 },
    { name: 'গণিত', progress: 60, total: 80, completed: 48 },
    { name: 'সাধারণ জ্ঞান', progress: 90, total: 150, completed: 135 },
    { name: 'বিজ্ঞান', progress: 45, total: 90, completed: 40 }
  ];

  return (
    <Card className='dark:bg-gray-800 dark:border-gray-700'>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Study Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjects.map((subject) => (
            <div key={subject.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{subject.name}</span>
                <span className="text-muted-foreground">
                  {subject.completed}/{subject.total}
                </span>
              </div>
              <Progress value={subject.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
