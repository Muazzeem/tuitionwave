import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Clock, FileText, Target, ChevronDown } from "lucide-react";
import JobPreparationService from "@/services/JobPreparationService";
import { Category, Subject, Topic } from "@/types/jobPreparation";

interface ExamSummary {
    selectedSubjects: Subject[];
    selectedTopics: Topic[];
    questionLimit: number;
    durationMinutes: number;
}

export default function ExamPractice() {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
    const [selectedTopics, setSelectedTopics] = useState<Topic[]>([]);
    const [questionLimit, setQuestionLimit] = useState(20);
    const [durationMinutes, setDurationMinutes] = useState(30);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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

    // Handle subject selection (multiple)
    const handleSubjectToggle = (subject: Subject) => {
        setSelectedSubjects(prev => {
            const isSelected = prev.some(s => s.uid === subject.uid);
            if (isSelected) {
                return prev.filter(s => s.uid !== subject.uid);
            } else {
                return [...prev, subject];
            }
        });
    };

    // Handle topic selection (multiple)
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
    const removeSubject = (subjectUid: string) => {
        setSelectedSubjects(prev => prev.filter(s => s.uid !== subjectUid));
    };

    // Remove selected topic
    const removeTopic = (topicUid: string) => {
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

    const examSummary: ExamSummary = {
        selectedSubjects,
        selectedTopics,
        questionLimit,
        durationMinutes,
    };

    const CustomMultiSelect = ({
        placeholder,
        options,
        selectedItems,
        onToggle,
        isLoading,
        keyField,
        labelField,
        countField,
        disabled
    }: {
        placeholder: string;
        options: any[];
        selectedItems: any[];
        onToggle: (item: any) => void;
        isLoading: boolean;
        keyField: string;
        labelField: string;
        countField?: string;
        disabled?: boolean;
    }) => (
        <div className="relative">
            <div
                className="flex min-h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white cursor-pointer"
                onClick={() => !disabled && setOpenDropdown(openDropdown === keyField ? null : keyField)}
            >
                <div className="flex items-center justify-between w-full">
                    <span className={selectedItems.length === 0 ? "text-muted-foreground" : ""}>
                        {selectedItems.length === 0 ? placeholder : `${selectedItems.length} selected`}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </div>
            </div>

            {openDropdown === keyField && !disabled && (
                <div className="absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 mt-1 w-full max-h-60 overflow-y-auto dark:bg-gray-700 dark:border-gray-600">
                    {isLoading ? (
                        <div className="px-2 py-1.5 text-sm">Loading...</div>
                    ) : options.length === 0 ? (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">No options available</div>
                    ) : (
                        options.map(item => {
                            const isSelected = selectedItems.some(selected => selected[keyField] === item[keyField]);
                            return (
                                <div
                                    key={item[keyField]}
                                    className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground dark:hover:bg-gray-600"
                                    onClick={() => onToggle(item)}
                                >
                                    <div className="flex items-center space-x-2 w-full">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => { }}
                                            className="rounded"
                                        />
                                        <div className="flex justify-between items-center w-full">
                                            <span className="dark:text-white">{item[labelField]}</span>
                                            {countField && (
                                                <span className="text-xs text-gray-500 ml-2">
                                                    ({item[countField]} questions)
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            setOpenDropdown(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex-1 overflow-auto dark:bg-gray-900">
            <DashboardHeader userName="John" />

            <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-6 dark:text-white">Create Practice Exam</h2>

                    {/* Single Row Configuration */}
                    <Card className="dark:bg-gray-800 dark:border-gray-700">
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                                {/* Category */}
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

                                {/* Subjects */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium dark:text-gray-300">
                                        <FileText className="h-4 w-4 inline mr-1" />
                                        Subjects
                                    </Label>
                                    <CustomMultiSelect
                                        placeholder="Select subjects"
                                        options={subjectsData?.results || []}
                                        selectedItems={selectedSubjects}
                                        onToggle={handleSubjectToggle}
                                        isLoading={subjectsLoading}
                                        keyField="uid"
                                        labelField="subject_title"
                                        countField="total_questions"
                                        disabled={!selectedCategory}
                                    />
                                </div>

                                {/* Topics */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium dark:text-gray-300">
                                        <Target className="h-4 w-4 inline mr-1" />
                                        Topics (Optional)
                                    </Label>
                                    <CustomMultiSelect
                                        placeholder="Select topics"
                                        options={topicsData?.results || []}
                                        selectedItems={selectedTopics}
                                        onToggle={handleTopicToggle}
                                        isLoading={topicsLoading}
                                        keyField="uid"
                                        labelField="topic_name"
                                        countField="total_questions"
                                        disabled={selectedSubjects.length === 0}
                                    />
                                </div>

                                {/* Question Limit */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium dark:text-gray-300">Questions</Label>
                                    <Input
                                        type="number"
                                        value={questionLimit}
                                        onChange={(e) => setQuestionLimit(parseInt(e.target.value) || 20)}
                                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        min="1"
                                        max="100"
                                        placeholder="20"
                                    />
                                </div>

                                {/* Duration */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium dark:text-gray-300">
                                        <Clock className="h-4 w-4 inline mr-1" />
                                        Duration (min)
                                    </Label>
                                    <Input
                                        type="number"
                                        value={durationMinutes}
                                        onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 30)}
                                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        min="1"
                                        max="300"
                                        placeholder="30"
                                    />
                                </div>

                                {/* Create Button */}
                                <div>
                                    <Button
                                        onClick={() => setShowSummaryModal(true)}
                                        className="bg-blue-600 hover:bg-blue-700 w-full"
                                        disabled={selectedSubjects.length === 0 && selectedTopics.length === 0}
                                    >
                                        Create Exam
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Selected Items Display */}
                    {(selectedSubjects.length > 0 || selectedTopics.length > 0) && (
                        <Card className="dark:bg-gray-800 dark:border-gray-700 mt-6">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold dark:text-white mb-4">Selected Items</h3>

                                {/* Selected Subjects */}
                                {selectedSubjects.length > 0 && (
                                    <div className="mb-4">
                                        <Label className="text-sm font-medium dark:text-gray-300 mb-2 block">
                                            Subjects ({selectedSubjects.length})
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedSubjects.map(subject => (
                                                <Badge
                                                    key={subject.uid}
                                                    variant="default"
                                                    className="flex items-center gap-2 text-xs py-1 px-2"
                                                >
                                                    {subject.subject_title}
                                                    <X
                                                        className="h-3 w-3 cursor-pointer hover:text-red-300"
                                                        onClick={() => removeSubject(subject.uid)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Selected Topics */}
                                {selectedTopics.length > 0 && (
                                    <div>
                                        <Label className="text-sm font-medium dark:text-gray-300 mb-2 block">
                                            Topics ({selectedTopics.length})
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedTopics.map(topic => (
                                                <Badge
                                                    key={topic.uid}
                                                    variant="secondary"
                                                    className="flex items-center gap-2 text-xs py-1 px-2"
                                                >
                                                    {topic.topic_name}
                                                    <X
                                                        className="h-3 w-3 cursor-pointer hover:text-red-300"
                                                        onClick={() => removeTopic(topic.uid)}
                                                    />
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </ScrollArea>

            {/* Summary Modal */}
            <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}>
                <DialogContent className="dark:bg-gray-800 dark:border-gray-700 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="dark:text-white">Exam Summary</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Exam Configuration */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Questions</Label>
                                <div className="text-lg font-semibold dark:text-white">{examSummary.questionLimit}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</Label>
                                <div className="text-lg font-semibold dark:text-white">{examSummary.durationMinutes} minutes</div>
                            </div>
                        </div>

                        {/* Selected Items */}
                        <div className="space-y-4">
                            {examSummary.selectedSubjects.length > 0 && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Subjects ({examSummary.selectedSubjects.length})
                                    </Label>
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
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Topics ({examSummary.selectedTopics.length})
                                    </Label>
                                    <div className="flex flex-wrap gap-2">
                                        {examSummary.selectedTopics.map(topic => (
                                            <Badge key={topic.uid} variant="secondary" className="text-xs">
                                                {topic.topic_name}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setShowSummaryModal(false)}
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
                </DialogContent>
            </Dialog>
        </div>
    );
}