import { useState, useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Calendar, Loader2 } from "lucide-react";
import { getAccessToken } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

export default function CreateModelTest() {
  const [selectedTab, setSelectedTab] = useState("running");
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const tabs = [
    { id: "running", label: "Running Exams", param: "today=true" },
    { id: "upcoming", label: "Upcoming Exams", param: "upcoming=true" },
    { id: "expired", label: "Expired Exams", param: "past=true" }
  ];

  useEffect(() => {
    const accessToken = getAccessToken();

    const fetchModelTests = async () => {
      try {
        setLoading(true);

        const currentTab = tabs.find(tab => tab.id === selectedTab);
        const apiParam = currentTab?.param || "today=true";

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/model-tests?${apiParam}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const transformedData = data.results.map((test) => {
          const createdDate = new Date(test.created_at);
          const formattedCreatedAt = createdDate.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          });

          return {
            uid: test.uid,
            created_at: formattedCreatedAt,
            title: test.name,
            description: test.description || "No description available",
            time: "09:00 AM - 11:00 AM",
            duration: `${test.duration_minutes} min`,
            participants: "0 participants",
            category: test.category.category_name,
            timeLeft: "01:30:00",
            status: selectedTab,
            totalQuestions: test.total_questions,
            configurations: test.configurations,
            user_exam: test.user_exam || null
          };
        });
        setExamData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching model tests:', err);
        setError('Failed to load model tests. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchModelTests();
  }, [selectedTab]);

  const filteredExams = examData;

  if (error) {
    return (
      <div className="flex-1 overflow-auto dark:bg-gray-900">
        <DashboardHeader userName="John" />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️ Error</div>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  async function createExam(exam: any) {
    const accessToken = getAccessToken();

    if (exam.user_exam) {
      const examInstance = exam.user_exam;

      if (examInstance.status === 'completed') {
        navigate(`/job-preparation/exam/${examInstance.uid}/results`);
      } else if (examInstance.status === 'not_started' || examInstance.status === 'in_progress') {
        navigate(`/job-preparation/exam/${examInstance.uid}`);
      }
    }

    else {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/v1/model-tests/${exam.uid}/generate-exams/`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to generate exam: ${response.status}`);
        }

        const data = await response.json();
        navigate(`/job-preparation/exam/${data.exam_id}`);
      } catch (err) {
        console.error("Error generating exam:", err);
        alert("Failed to create exam. Please try again.");
      }
    }
  }


  return (
    <div className="flex-1 overflow-auto dark:bg-gray-900">
      <DashboardHeader userName="John" />
      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">Model Tests</h1>
            <p className="text-gray-400">Create and practise preliminary model exams</p>
          </div>

          <div className="mb-6">
            <div className="flex space-x-0 dark:bg-gray-800 rounded-lg p-1 w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedTab === tab.id
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white dark:hover:bg-gray-700 hover:bg-blue-500"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6">
            {filteredExams.map((exam) => (
              <Card
                onClick={() => createExam(exam)}
                key={exam.uid}
                className="bg-gray-100 border-gray-200 hover:border-gray-300 transition-colors cursor-pointer
                          dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {exam.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{exam.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                        <span>{exam.created_at}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge
                        variant="default"
                        className="bg-blue-600 text-white dark:bg-blue-700 dark:text-white"
                      >
                        {exam.category}
                      </Badge>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">{exam.duration}</span>
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>{exam.totalQuestions} questions</span>
                        <span className="text-orange-500 font-mono dark:text-orange-400">
                          {exam.timeLeft}
                        </span>
                      </div>

                      {exam.user_exam && (
                        <div className="flex flex-col text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700">
                          <div className="flex justify-between">
                            <span>Exam Status:</span>
                            <span className="font-medium text-blue-600 dark:text-blue-400">
                              {exam.user_exam.status_display}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Score:</span>
                            <span>{exam.user_exam.percentage}%</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {exam.configurations && exam.configurations.length > 0 && (
                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Topics: {exam.configurations.map(config => config.topic_name).join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredExams.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No {selectedTab} exams</div>
              <p className="text-gray-500">Check back later for more exam opportunities</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
