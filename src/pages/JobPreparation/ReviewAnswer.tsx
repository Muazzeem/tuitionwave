import DashboardHeader from "@/components/DashboardHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { ExamResults } from "@/types/jobPreparation";
import { getAccessToken } from "@/utils/auth";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ChevronLeft } from "lucide-react";
import ReviewAnswers from "./ReviewAnswers";

export default function ReviewAnswer() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const accessToken = getAccessToken();
  const [examResults, setExamResults] = useState<ExamResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamResults = async () => {
      if (!examId) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/exams/${examId}/results`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch exam results");
        }

        const data: ExamResults = await response.json();
        setExamResults(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load exam results.",
          variant: "destructive",
        });
        navigate("/exam-practice");
      } finally {
        setLoading(false);
      }
    };

    fetchExamResults();
  }, [examId, accessToken, toast, navigate]);


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <ScrollArea type="always" style={{ height: "calc(100vh - 100px)" }}>
                <div className="min-h-screen bg-gray-900 w-full">
                    <DashboardHeader userName="John" />
                    <div className="flex items-center justify-center w-full h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                            <p className="text-xl text-gray-200 font-medium">Loading results...</p>
                        </div>
                    </div>
                </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <DashboardHeader userName="John" />

      <ScrollArea type="always" style={{ height: "calc(100vh - 100px)" }}>
        <div className="container mx-auto p-0">
          <div className="sm:sticky top-0 z-10 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80">
            <div className="py-4 p-2">
              <div className="grid grid-cols-[auto_1fr_auto] items-center">
                <button
                  type="button"
                  onClick={() => navigate(`/job-preparation/exam/${examId}/results`)}
                  aria-label="Back to results"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 hover:bg-primary-700 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>

                <div className="text-center justify-self-center">
                  <h1 className="text-lg md:text-3xl font-bold mb-1 font-unbounded">
                    Review Answers
                  </h1>
                <p className="text-gray-400 hidden sm:block">
                    Track Your Progress And Improve Your Performance
                  </p>
                </div>

                <div className="h-8 w-8" aria-hidden="true" />
              </div>
            </div>
            <div className="border-b border-white/10" />
          </div>

          <div className="pt-5">
            <ReviewAnswers
              examResults={examResults}
              onBackToResults={() =>
                navigate(`/job-preparation/exam/${examId}/results`)
              }
              onPracticeMore={() =>
                navigate("/job-preparation/practice?tab=create")
              }
              onGoToDashboard={() => navigate("/job-preparation/dashboard")}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
