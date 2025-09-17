import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { BarChart3, TrendingUp } from "lucide-react";
import { getAccessToken } from "@/utils/auth";

type MonthlyPoint = { month: string; score: number; exams: number };
type SubjectPoint = { subject: string; score: number };

function ChartsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[0, 1].map((k) => (
        <Card key={k} className="bg-background border-0 rounded-2xl">
          <CardHeader className="px-5 pt-5 pb-3">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <Skeleton className="h-64 w-full rounded-xl" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function PerformanceChart() {
  const [performanceData, setPerformanceData] = useState<MonthlyPoint[]>([]);
  const [subjectPerformance, setSubjectPerformance] = useState<SubjectPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = getAccessToken();

    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/exams/monthly-performance/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((r) => r.json())
        .then((data) =>
          (data || []).map((d: any) => ({
            month: d.month,
            score: d.average_percentage,
            exams: d.exam_count,
          }))
        ),

      fetch(`${import.meta.env.VITE_API_URL}/api/exams/subject-performance/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((r) => r.json())
        .then((data) =>
          (data || []).map((d: any) => ({
            subject: d.subject_name,
            score: d.average_percentage,
          }))
        ),
    ])
      .then(([monthly, subjects]) => {
        setPerformanceData(monthly);
        setSubjectPerformance(subjects);
      })
      .catch(() => setError("Failed to load performance data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ChartsSkeleton />;
  if (error) return <p className="text-red-500">{error}</p>;

  const lineColor = "var(--color-score, #3b82f6)";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Score Trend */}
      <Card className="bg-background border-0 rounded-2xl">
        <CardHeader className="px-5 pt-5 pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            Score Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {performanceData.length === 0 ? (
            <p className="text-muted-foreground text-sm">No trend data yet.</p>
          ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={performanceData}>
                  <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(17,24,39,0.95)",
                      border: "1px solid #374151",
                      borderRadius: 8,
                      color: "#e5e7eb",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={lineColor}
                    strokeWidth={3}
                    dot={{ r: 4, stroke: "#111827", strokeWidth: 2, fill: lineColor }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Subjects Performance */}
      <Card className="bg-background border-0 rounded-2xl">
        <CardHeader className="px-5 pt-5 pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            Subjects Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {subjectPerformance.length === 0 ? (
            <p className="text-muted-foreground text-sm">No subject data yet.</p>
          ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={subjectPerformance} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid stroke="#374151" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="subject"
                    stroke="#9CA3AF"
                    tick={{ fontSize: 11 }}
                    angle={-35}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(17,24,39,0.95)",
                      border: "1px solid #374151",
                      borderRadius: 8,
                      color: "#e5e7eb",
                    }}
                  />
                  <Bar dataKey="score" fill={lineColor} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
