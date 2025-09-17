import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { getAccessToken } from "@/utils/auth";

interface ExamRecord {
  uid: string;
  subject_names: string[];
  topic_names: string[];
  status: "completed" | "in_progress" | "not_started" | "expired";
  pass_status: string | null;
  percentage: number;
  created_at: string;
  exam_type_display: string;
}

const getExamAction = (status: string, uid: string) => {
  if (status === "completed") return { label: "View Results", to: `/job-preparation/exam/${uid}/results` };
  if (status === "in_progress") return { label: "View", to: `/job-preparation/exam/${uid}` };
  return { label: "View", to: `/job-preparation/practice?tab=history` };
};

const StatusIcon = ({ pass_status }: { pass_status: ExamRecord["pass_status"] }) => {
  if (pass_status === "pass") return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (pass_status === "fail") return <XCircle className="h-4 w-4 text-red-500" />;
  return null;
};

const perfLabel = (p: number) =>
  p >= 80 ? "Excellent" : p >= 60 ? "Good" : p >= 40 ? "Fair" : "Needs Work";

/* -------- Skeleton -------- */
function ExamListSkeleton() {
  return (
    <Card className="w-full bg-background border-0 rounded-2xl">
      <CardHeader className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 rounded-xl border border-background-600 bg-background-800/40 px-4 py-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </div>
                <Skeleton className="h-4 w-36 mt-2" />
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right space-y-2">
                  <Skeleton className="h-5 w-14 ml-auto" />
                  <Skeleton className="h-3 w-20 ml-auto" />
                </div>
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function ExamStatusCards() {
  const [exams, setExams] = useState<ExamRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const accessToken = getAccessToken();
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/exams/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch exams");
        const data = await res.json();
        setExams(data.results || []);
      } catch {
        setError("Failed to fetch exams.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <ExamListSkeleton />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <Card className="w-full bg-background border-0 rounded-2xl lg:min-h-96 hidden md:block">
        <CardHeader className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-lg">Recent Exam Activities</CardTitle>
            <button className="px-3 py-1 rounded-full text-xs text-white bg-background-700 border border-background-500">
              See All
            </button>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5">
          <div className="space-y-3">
            {exams.slice(0, 4).map((exam) => {
              const action = getExamAction(exam.status, exam.uid);
              const title = exam.subject_names?.length ? exam.subject_names[0] : exam.exam_type_display;
              const dt = new Date(exam.created_at);
              const date = dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
              const time = dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

              return (
                <div
                  key={exam.uid}
                  className="flex items-center justify-between gap-4 rounded-xl border border-background-600 bg-background-600/40 px-4 py-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium truncate">{title}</p>
                      <StatusIcon pass_status={exam.pass_status} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {date} &nbsp; {time}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="text-white font-semibold">
                        {Number(exam.percentage).toFixed(2)}%
                      </div>
                      <div className="text-xs text-muted-foreground">{perfLabel(exam.percentage)}</div>
                    </div>

                    <Link to={action.to}>
                      <Button className="rounded-full px-5 h-9 bg-primary-600 hover:bg-primary-500 text-white">
                        {action.label}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-2 block md:hidden">
        <h2 className="text-lg font-semibold text-white">Recent Exam Activities</h2>
        <button className="px-3 py-1 rounded-full text-xs text-white bg-background-700 border border-background-500">
          See All
        </button>
      </div>

      <div className="sm:px-5 pb-4 overflow-x-auto block md:hidden">
        <div className="flex gap-4">
          {exams.map((exam) => {
            const action = getExamAction(exam.status, exam.uid);
            const title = exam.subject_names?.length ? exam.subject_names[0] : exam.exam_type_display;
            const dt = new Date(exam.created_at);
            const date = dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const time = dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

            return (
              <article
                key={exam.uid}
                className="w-72 shrink-0 rounded-2xl border border-slate-800 bg-background p-4"
              >
                {/* Progress pill */}
                <div className="mb-3 flex flex-col items-center justify-center rounded-xl bg-[#2F3B54] text-slate-200 px-3 py-2 w-full">
                  <span className="text-xl font-semibold">
                    {Number(exam.percentage).toFixed(2)}%
                  </span>
                  <span className="text-sm text-gray-400">Your Progress</span>
                </div>

                {/* Title */}
                <h3 className="text-slate-100 text-base font-semibold leading-snug line-clamp-2 text-center">
                  {title}
                </h3>

                {/* Status icon + performance */}
                <div className="mt-2 flex justify-center items-center gap-2">
                  <StatusIcon pass_status={exam.pass_status} />
                  <span className="text-xs text-muted-foreground">{perfLabel(exam.percentage)}</span>
                </div>

                {/* Date */}
                <p className="mt-2 text-xs text-slate-400 text-center">
                  {date} &nbsp; {time}
                </p>

                {/* CTA */}
                <div className="mt-4">
                  <Link to={action.to}>
                    <Button className="w-full rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-3 py-2">
                      {action.label}
                    </Button>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
