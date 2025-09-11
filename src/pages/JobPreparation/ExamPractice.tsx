import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/DashboardHeader";
import ExamConfiguration from "@/components/ExamPractice/ExamConfiguration";
import ExamSummaryModal from "@/components/ExamPractice/ExamSummaryModal";
import ExamHistory from "@/components/ExamPractice/ExamHistory";
import JobPreparationService from "@/services/JobPreparationService";
import { Subject, Topic } from "@/types/jobPreparation";
import { getAccessToken } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  PlusCircle,
  History,
  Target,
  Sparkles,
  TrendingUp
} from "lucide-react";

export default function ExamPractice() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [subjectTopics, setSubjectTopics] = useState<Record<string, Topic[]>>({});
  const [topicsLoading, setTopicsLoading] = useState<Record<string, boolean>>({});
  const [questionLimit, setQuestionLimit] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get("tab") || "create";
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    document.title = "Tuition Wave | Exam Preparation";
  }, []);

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => JobPreparationService.getCategories(),
  });

  // Fetch subjects when category is selected
  const { data: subjectsData, isLoading: subjectsLoading } = useQuery({
    queryKey: ['subjects', selectedCategory],
    queryFn: () => JobPreparationService.getSubjects(selectedCategory),
    enabled: !!selectedCategory,
  });

  // Function to fetch topics for a specific subject
  const fetchTopicsForSubject = async (subjectUid: string) => {
    setTopicsLoading(prev => ({ ...prev, [subjectUid]: true }));
    try {
      const topicsData = await JobPreparationService.getTopics(subjectUid);
      setSubjectTopics(prev => ({ ...prev, [subjectUid]: topicsData.results }));
    } catch (error) {
      console.error('Error fetching topics:', error);
      setSubjectTopics(prev => ({ ...prev, [subjectUid]: [] }));
    } finally {
      setTopicsLoading(prev => ({ ...prev, [subjectUid]: false }));
    }
  };

  useEffect(() => {
    setActiveTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    setSelectedSubjects([]);
    setSelectedTopics([]);
    setSubjectTopics({});
    setTopicsLoading({});
  }, [selectedCategory]);

  // Handle subject selection
  const handleSubjectToggle = (subject: Subject) => {
    setSelectedSubjects(prev => {
      const isSelected = prev.some(s => s.uid === subject.uid);
      if (isSelected) {
        setSelectedTopics(prevTopics =>
          prevTopics.filter(topic => topic.subject.uid !== subject.uid)
        );
        setSubjectTopics(prevSubjectTopics => {
          const newSubjectTopics = { ...prevSubjectTopics };
          delete newSubjectTopics[subject.uid];
          return newSubjectTopics;
        });
        return prev.filter(s => s.uid !== subject.uid);
      } else {
        fetchTopicsForSubject(subject.uid);
        return [...prev, subject];
      }
    });
  };

  // Handle topic selection
  const handleTopicToggle = (topic: Topic) => {
    setSelectedTopics(prev => {
      const isSelected = prev.some(t => t.uid === topic.uid);
      if (isSelected) {
        return prev.filter(t => t.uid !== topic.uid);
      } else {
        return [...prev, topic];
      }
    });
  };

  // Remove selected subject
  const handleSubjectRemove = (subjectUid: string) => {
    setSelectedSubjects(prev => prev.filter(s => s.uid !== subjectUid));
    setSelectedTopics(prev => prev.filter(t => t.subject.uid !== subjectUid));
    setSubjectTopics(prev => {
      const newSubjectTopics = { ...prev };
      delete newSubjectTopics[subjectUid];
      return newSubjectTopics;
    });
  };

  // Remove selected topic
  const handleTopicRemove = (topicUid: string) => {
    setSelectedTopics(prev => prev.filter(t => t.uid !== topicUid));
  };

  // Handle create exam
  const handleCreateExam = async () => {
    const examData = {
      exam_type: "custom",
      question_limit: questionLimit,
      duration_minutes: durationMinutes,
      subjects: selectedSubjects.map(s => s.uid),
      topics: selectedTopics.map(t => t.uid)
    };

    const accessToken = getAccessToken();
    const baseUrl = import.meta.env.VITE_API_URL;
    const url = `${baseUrl}/api/exams/create/`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create exam. Status: ${response.status}`);
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Exam created successfully!",
      });

      setShowSummaryModal(false);
      navigate(`/job-preparation/practice?tab=history`);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong while creating the exam.",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  // Quick stats for display
  const getQuickStats = () => {
    return {
      selectedSubjects: selectedSubjects.length,
      selectedTopics: selectedTopics.length,
      questionLimit: questionLimit || 0,
      duration: durationMinutes || 0
    };
  };

  const stats = getQuickStats();

  return (
    <div className="flex-1 overflow-auto bg-gray-900 min-h-screen">
      <DashboardHeader userName="John" />

      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-4 md:p-6 space-y-6">
          {/* Enhanced Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg p-2 hidden md:block">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-bold text-foreground text-white">Job Preparation</h2>
                <p className="text-muted-foreground hidden md:block">Create custom exams or review your performance history</p>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 border-gray-700 w-fit">
              <TabsList className="grid grid-cols-2 bg-transparent gap-1 mb-0 md:mb-1 p-0">
                <TabsTrigger
                  value="create"
                  className="flex p-1 md:p-3 gap-2 items-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-primary-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all"
                >
                  <PlusCircle className="h-4 w-4" />
                  <span className="font-medium">Create New Exam</span>
                  {activeTab === 'create' && (
                    <Sparkles className="h-4 w-4 animate-pulse" />
                  )}
                </TabsTrigger>

                <TabsTrigger
                  value="history"
                  className="flex items-center gap-2 p-1 md:p-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-primary-500 data-[state=active]:text-white data-[state=active]:shadow-sm rounded-lg transition-all"
                >
                  <History className="h-4 w-4" />
                  <span className="font-medium">Exam History</span>
                  {activeTab === 'history' && (
                    <TrendingUp className="h-4 w-4" />
                  )}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="create" className="space-y-6 mt-6">
              <ExamConfiguration
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSubjects={selectedSubjects}
                selectedTopics={selectedTopics}
                questionLimit={questionLimit}
                setQuestionLimit={setQuestionLimit}
                durationMinutes={durationMinutes}
                setDurationMinutes={setDurationMinutes}
                categories={categoriesData?.results || []}
                subjects={subjectsData?.results || []}
                subjectTopics={subjectTopics}
                categoriesLoading={categoriesLoading}
                subjectsLoading={subjectsLoading}
                topicsLoading={topicsLoading}
                onSubjectToggle={handleSubjectToggle}
                onTopicToggle={handleTopicToggle}
                onSubjectRemove={handleSubjectRemove}
                onTopicRemove={handleTopicRemove}
                onCreateExam={() => setShowSummaryModal(true)}
              />
            </TabsContent>

            <TabsContent value="history" className="space-y-6 mt-6">
              <ExamHistory
                useInternalApi={true}
              />
            </TabsContent>
          </Tabs>

          <ExamSummaryModal
            isOpen={showSummaryModal}
            onClose={() => setShowSummaryModal(false)}
            onConfirm={handleCreateExam}
            selectedSubjects={selectedSubjects}
            selectedTopics={selectedTopics}
            questionLimit={questionLimit}
            durationMinutes={durationMinutes}
          />
        </div>
      </ScrollArea>
    </div>
  );
}