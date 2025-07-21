
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X, Clock, FileText, Target } from "lucide-react";
import JobPreparationService from "@/services/JobPreparationService";
import { Category, Subject, Topic } from "@/types/jobPreparation";

interface ExamSummary {
  selectedSubjects: Subject[];
  selectedTopics: Topic[];
  questionLimit: number;
  durationMinutes: number;
  totalQuestions: number;
}

export default function ExamPractice() {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
    const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
    const [subjectSearchTerm, setSubjectSearchTerm] = useState("");
    const [topicSearchTerm, setTopicSearchTerm] = useState("");
    const [questionLimit, setQuestionLimit] = useState(20);
    const [durationMinutes, setDurationMinutes] = useState(30);
    const [showSummary, setShowSummary] = useState(false);

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

    // Fetch topics for selected subjects
    const { data: topicsData, isLoading: topicsLoading } = useQuery({
        queryKey: ['topics', selectedSubjects.map(s => s.uid)],
        queryFn: async () => {
            if (selectedSubjects.length === 0) return { results: [] };
            
            const topicsPromises = selectedSubjects.map(subject => 
                JobPreparationService.getTopics(subject.uid)
            );
            const topicsResults = await Promise.all(topicsPromises);
            
            // Combine all topics from different subjects
            const allTopics = topicsResults.flatMap(result => result.results);
            return { results: allTopics };
        },
        enabled: selectedSubjects.length > 0,
    });

    // Reset selections when category changes
    useEffect(() => {
        setSelectedSubjects([]);
        setSelectedTopics([]);
    }, [selectedCategory]);

    // Reset topics when subjects change
    useEffect(() => {
        setSelectedTopics([]);
    }, [selectedSubjects]);

    // Filter subjects based on search
    const filteredSubjects = subjectsData?.results.filter(subject =>
        subject.subject_title.toLowerCase().includes(subjectSearchTerm.toLowerCase())
    ) || [];

    // Filter topics based on search
    const filteredTopics = topicsData?.results.filter(topic =>
        topic.topic_name.toLowerCase().includes(topicSearchTerm.toLowerCase())
    ) || [];

    // Handle subject selection
    const handleSubjectToggle = (subject: Subject) => {
        setSelectedSubjects(prev => {
            const isSelected = prev.find(s => s.uid === subject.uid);
            if (isSelected) {
                return prev.filter(s => s.uid !== subject.uid);
            } else {
                return [...prev, subject];
            }
        });
    };

    // Handle topic selection
    const handleTopicToggle = (topic: Topic) => {
        setSelectedTopics(prev => {
            const isSelected = prev.find(t => t.uid === topic.uid);
            if (isSelected) {
                return prev.filter(t => t.uid !== topic.uid);
            } else {
                return [...prev, topic];
            }
        });
    };

    // Remove selected subject
    const removeSubject = (subjectUid: string) => {
        setSelectedSubjects(prev => prev.filter(s => s.uid !== subjectUid));
    };

    // Remove selected topic
    const removeTopic = (topicUid: string) => {
        setSelectedTopics(prev => prev.filter(t => t.uid !== topicUid));
    };

    // Calculate total questions
    const calculateTotalQuestions = () => {
        const subjectQuestions = selectedSubjects.reduce((total, subject) => total + subject.total_questions, 0);
        const topicQuestions = selectedTopics.reduce((total, topic) => total + topic.total_questions, 0);
        return subjectQuestions + topicQuestions;
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
        
        // For now, just show success message
        alert('Exam created successfully!');
    };

    const examSummary: ExamSummary = {
        selectedSubjects,
        selectedTopics,
        questionLimit,
        durationMinutes,
        totalQuestions: calculateTotalQuestions()
    };

    if (showSummary) {
        return (
            <div className="flex-1 overflow-auto dark:bg-gray-900">
                <DashboardHeader userName="John" />
                <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold dark:text-white">Exam Summary</h2>
                            <Button 
                                variant="outline" 
                                onClick={() => setShowSummary(false)}
                                className="dark:border-gray-600"
                            >
                                Back to Edit
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Exam Details */}
                            <Card className="dark:bg-gray-800 dark:border-gray-700">
                                <CardHeader>
                                    <CardTitle className="dark:text-white flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Exam Configuration
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Questions:</span>
                                        <Badge variant="secondary">{examSummary.questionLimit}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Duration:</span>
                                        <Badge variant="secondary">{examSummary.durationMinutes} minutes</Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Target className="h-4 w-4 text-gray-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Available Questions:</span>
                                        <Badge variant="outline">{examSummary.totalQuestions}</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Selected Items */}
                            <Card className="dark:bg-gray-800 dark:border-gray-700">
                                <CardHeader>
                                    <CardTitle className="dark:text-white">Selected Items</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {examSummary.selectedSubjects.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                                                Subjects ({examSummary.selectedSubjects.length})
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {examSummary.selectedSubjects.map(subject => (
                                                    <Badge key={subject.uid} variant="default" className="text-xs">
                                                        {subject.subject_title}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {examSummary.selectedTopics.length > 0 && (
                                        <div>
                                            <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 mb-2">
                                                Topics ({examSummary.selectedTopics.length})
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {examSummary.selectedTopics.map(topic => (
                                                    <Badge key={topic.uid} variant="secondary" className="text-xs">
                                                        {topic.topic_name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <Button 
                                variant="outline" 
                                onClick={() => setShowSummary(false)}
                                className="dark:border-gray-600"
                            >
                                Edit Configuration
                            </Button>
                            <Button 
                                onClick={handleCreateExam}
                                className="bg-blue-600 hover:bg-blue-700"
                                disabled={examSummary.selectedSubjects.length === 0 && examSummary.selectedTopics.length === 0}
                            >
                                Create Exam
                            </Button>
                        </div>
                    </div>
                </ScrollArea>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-auto dark:bg-gray-900">
            <DashboardHeader userName="John" />

            <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-6 dark:text-white">Create Practice Exam</h2>
                </div>

                <div className="p-4 md:p-6 space-y-6">
                    {/* Basic Configuration */}
                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                        <CardHeader>
                            <CardTitle className="dark:text-white text-lg">Basic Configuration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium dark:text-gray-300">Category</Label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                                            {categoriesLoading ? (
                                                <SelectItem value="loading" disabled>Loading...</SelectItem>
                                            ) : (
                                                categoriesData?.results.map(category => (
                                                    <SelectItem key={category.uid} value={category.uid}>
                                                        {category.category_name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium dark:text-gray-300">Question Limit</Label>
                                    <Input
                                        type="number"
                                        value={questionLimit}
                                        onChange={(e) => setQuestionLimit(parseInt(e.target.value) || 20)}
                                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        min="1"
                                        max="100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium dark:text-gray-300">Duration (minutes)</Label>
                                    <Input
                                        type="number"
                                        value={durationMinutes}
                                        onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 30)}
                                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        min="1"
                                        max="300"
                                    />
                                </div>

                                <div className="flex items-end">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Total: {calculateTotalQuestions()} questions available
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Subjects Selection */}
                    {selectedCategory && (
                        <Card className="dark:bg-gray-800 dark:border-gray-700">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="dark:text-white text-lg">Select Subjects</CardTitle>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search subjects..."
                                            value={subjectSearchTerm}
                                            onChange={(e) => setSubjectSearchTerm(e.target.value)}
                                            className="pl-10 w-64 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Selected Subjects */}
                                {selectedSubjects.length > 0 && (
                                    <div className="mb-4">
                                        <Label className="text-sm font-medium dark:text-gray-300 mb-2 block">
                                            Selected Subjects ({selectedSubjects.length})
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSubjects.map(subject => (
                                                <Badge key={subject.uid} variant="default" className="flex items-center gap-1">
                                                    {subject.subject_title}
                                                    <button
                                                        onClick={() => removeSubject(subject.uid)}
                                                        className="ml-1 hover:bg-red-500 rounded-full p-0.5"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Available Subjects */}
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {subjectsLoading ? (
                                        <div className="text-center py-4 text-gray-500">Loading subjects...</div>
                                    ) : filteredSubjects.length === 0 ? (
                                        <div className="text-center py-4 text-gray-500">No subjects found</div>
                                    ) : (
                                        filteredSubjects.map(subject => (
                                            <div key={subject.uid} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                                                <Checkbox
                                                    id={subject.uid}
                                                    checked={selectedSubjects.some(s => s.uid === subject.uid)}
                                                    onCheckedChange={() => handleSubjectToggle(subject)}
                                                />
                                                <label 
                                                    htmlFor={subject.uid} 
                                                    className="flex-1 cursor-pointer text-sm dark:text-gray-300"
                                                >
                                                    {subject.subject_title}
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({subject.total_questions} questions)
                                                    </span>
                                                </label>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Topics Selection */}
                    {selectedSubjects.length > 0 && (
                        <Card className="dark:bg-gray-800 dark:border-gray-700">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="dark:text-white text-lg">Select Topics (Optional)</CardTitle>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search topics..."
                                            value={topicSearchTerm}
                                            onChange={(e) => setTopicSearchTerm(e.target.value)}
                                            className="pl-10 w-64 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Selected Topics */}
                                {selectedTopics.length > 0 && (
                                    <div className="mb-4">
                                        <Label className="text-sm font-medium dark:text-gray-300 mb-2 block">
                                            Selected Topics ({selectedTopics.length})
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTopics.map(topic => (
                                                <Badge key={topic.uid} variant="secondary" className="flex items-center gap-1">
                                                    {topic.topic_name}
                                                    <button
                                                        onClick={() => removeTopic(topic.uid)}
                                                        className="ml-1 hover:bg-red-500 rounded-full p-0.5"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Available Topics */}
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {topicsLoading ? (
                                        <div className="text-center py-4 text-gray-500">Loading topics...</div>
                                    ) : filteredTopics.length === 0 ? (
                                        <div className="text-center py-4 text-gray-500">No topics found</div>
                                    ) : (
                                        filteredTopics.map(topic => (
                                            <div key={topic.uid} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                                                <Checkbox
                                                    id={topic.uid}
                                                    checked={selectedTopics.some(t => t.uid === topic.uid)}
                                                    onCheckedChange={() => handleTopicToggle(topic)}
                                                />
                                                <label 
                                                    htmlFor={topic.uid} 
                                                    className="flex-1 cursor-pointer text-sm dark:text-gray-300"
                                                >
                                                    {topic.topic_name}
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        ({topic.total_questions} questions)
                                                    </span>
                                                </label>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Create Button */}
                    <div className="flex justify-end">
                        <Button 
                            onClick={() => setShowSummary(true)}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={selectedSubjects.length === 0 && selectedTopics.length === 0}
                        >
                            Review & Create Exam
                        </Button>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
