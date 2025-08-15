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
      <Card className="dark:bg-background dark:border-gray-900 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            Score Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          {performanceData.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No trend data yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete a few exams to see your progress over time
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-sm mx-auto">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  📈 Your performance graph will appear here as you take more exams
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-700 dark:text-green-300 font-medium">
                    Latest Score: {performanceData[performanceData.length - 1]?.score || 0}
                  </span>
                  <span className="text-green-600 dark:text-green-400">
                    {performanceData.length} data points
                  </span>
                </div>
              </div>

                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="var(--color-score)"
                        strokeWidth={3}
                        dot={{
                          fill: 'var(--color-score)',
                          strokeWidth: 2,
                          stroke: 'white',
                          r: 5
                        }}
                        activeDot={{
                          r: 7,
                          stroke: 'var(--color-score)',
                          strokeWidth: 2,
                          fill: 'white'
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>

              <div className="mt-3 text-center">
                <p className="text-xs text-muted-foreground">
                  🎯 Keep taking exams to track your improvement
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="dark:bg-background dark:border-gray-900 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Subject Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subjectPerformance.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No subject data yet</h3>
              <p className="text-muted-foreground mb-4">
                Take exams in different subjects to see your performance breakdown
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 max-w-sm mx-auto">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  📚 Your subject strengths will be displayed here
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-purple-700 dark:text-purple-300 font-medium">
                    Best Subject: {subjectPerformance.reduce((prev, current) => (prev.score > current.score) ? prev : current)?.subject || 'N/A'}
                  </span>
                  <span className="text-purple-600 dark:text-purple-400">
                    {subjectPerformance.length} subjects
                  </span>
                </div>
              </div>

                <ChartContainer config={chartConfig}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={subjectPerformance} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                      <XAxis
                        dataKey="subject"
                        tick={{ fontSize: 11 }}
                        stroke="#6b7280"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Bar
                        dataKey="score"
                        fill="var(--color-score)"
                        radius={[6, 6, 0, 0]}
                        stroke="white"
                        strokeWidth={1}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

              <div className="mt-3 text-center">
                <p className="text-xs text-muted-foreground">
                  📊 Identify your strongest and weakest subjects
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
