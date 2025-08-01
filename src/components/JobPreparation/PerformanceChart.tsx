import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';
import { getAccessToken } from '@/utils/auth';

export default function PerformanceChart() {
  const [performanceData, setPerformanceData] = useState([]);
  const [subjectPerformance, setSubjectPerformance] = useState([]);

  useEffect(() => {
    const accessToken = getAccessToken();

    // Fetch monthly performance
    fetch(`${import.meta.env.VITE_API_URL}/api/exams/monthly-performance/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          month: item.month,
          score: item.average_percentage,
          exams: item.exam_count
        }));
        setPerformanceData(formatted);
      })
      .catch((err) => console.error('Monthly performance error:', err));

    fetch(`${import.meta.env.VITE_API_URL}/exam/subject-performance/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((item) => ({
          subject: item.subject_name,
          score: item.average_percentage,
          total: 100
        }));
        setSubjectPerformance(formatted);
      })
      .catch((err) => console.error('Subject performance error:', err));
  }, []);

  const chartConfig = {
    score: {
      label: 'Score',
      color: 'hsl(var(--primary))'
    },
    exams: {
      label: 'Exams',
      color: 'hsl(var(--secondary))'
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="dark:bg-gray-900 dark:border-gray-700">
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
                  dot={{ fill: 'var(--color-score)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="dark:bg-gray-900 dark:border-gray-700">
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
