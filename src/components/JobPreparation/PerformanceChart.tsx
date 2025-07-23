
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function PerformanceChart() {
  const performanceData = [
    { month: 'Jan', score: 65, exams: 8 },
    { month: 'Feb', score: 72, exams: 12 },
    { month: 'Mar', score: 78, exams: 15 },
    { month: 'Apr', score: 75, exams: 10 },
    { month: 'May', score: 82, exams: 18 },
    { month: 'Jun', score: 85, exams: 20 }
  ];

  const subjectPerformance = [
    { subject: 'বাংলা', score: 85, total: 100 },
    { subject: 'English', score: 78, total: 100 },
    { subject: 'গণিত', score: 72, total: 100 },
    { subject: 'সাধারণ জ্ঞান', score: 80, total: 100 },
    { subject: 'বিজ্ঞান', score: 76, total: 100 }
  ];

  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--primary))",
    },
    exams: {
      label: "Exams",
      color: "hsl(var(--secondary))",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className='dark:bg-gray-900 dark:border-gray-700'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Score Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="var(--color-score)" 
                  strokeWidth={2}
                  dot={{ fill: "var(--color-score)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className='dark:bg-gray-900 dark:border-gray-700'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Subject Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={subjectPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="score" 
                  fill="var(--color-score)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
