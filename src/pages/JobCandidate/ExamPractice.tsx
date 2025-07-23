
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/DashboardHeader";
import ExamConfiguration from "@/components/ExamPractice/ExamConfiguration";
import ExamSummaryModal from "@/components/ExamPractice/ExamSummaryModal";
import ExamHistory from "@/components/ExamPractice/ExamHistory";
import JobPreparationService from "@/services/JobPreparationService";
import { Category, Subject, Topic } from "@/types/jobPreparation";

interface ExamRecord {
  id: string;
  title: string;
  category: string;
  status: 'active' | 'running' | 'completed' | 'failed';
  questionsCount: number;
  duration: number;
  score?: number;
  completedAt?: string;
  createdAt: string;
}

export default function ExamPractice() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
  const [subjectTopics, setSubjectTopics] = useState<Record<string, Topic[]>>({});
  const [topicsLoading, setTopicsLoading] = useState<Record<string, boolean>>({});
  const [questionLimit, setQuestionLimit] = useState(20);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  
  // Exam list states
  const [examFilter, setExamFilter] = useState<'all' | 'active' | 'running' | 'completed' | 'failed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [examRecords] = useState<ExamRecord[]>([
    {
      id: '1',
      title: 'বাংলা সাহিত্য পরীক্ষা',
      category: 'অনুশীলন (বিসিএস ও অন্যান্য)',
      status: 'completed',
      questionsCount: 20,
      duration: 30,
      score: 85,
      completedAt: '2024-01-15',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'গণিত প্র্যাকটিস',
      category: 'BANK & MBA',
      status: 'running',
      questionsCount: 25,
      duration: 45,
      createdAt: '2024-01-16'
    },
    {
      id: '3',
      title: 'সাধারণ জ্ঞান',
      category: 'অনুশীলন (বিসিএস ও অন্যান্য)',
      status: 'active',
      questionsCount: 30,
      duration: 60,
      createdAt: '2024-01-16'
    },
    {
      id: '4',
      title: 'ইংরেজি ব্যাকরণ',
      category: 'BANK & MBA',
      status: 'failed',
      questionsCount: 15,
      duration: 20,
      score: 45,
      completedAt: '2024-01-14',
      createdAt: '2024-01-14'
    }
  ]);
  const itemsPerPage = 6;

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

  // Reset selections when category changes
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
        // Remove subject and its topics
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
        // Add subject and fetch its topics
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

    console.log('Creating exam with data:', examData);
    // Here you would call your create exam API

    setShowSummaryModal(false);
    alert('Exam created successfully!');
  };

  const filteredExams = examFilter === 'all' 
    ? examRecords 
    : examRecords.filter(exam => exam.status === examFilter);

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader userName="John" />

      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Exam Practice</h2>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Exam</TabsTrigger>
              <TabsTrigger value="history">Exam History</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6">
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

            <TabsContent value="history" className="space-y-6">
              <ExamHistory
                examRecords={examRecords}
                examFilter={examFilter}
                setExamFilter={setExamFilter}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
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
