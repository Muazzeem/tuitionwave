import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Clock, FileText, Target, ChevronDown, Search, Filter, Calendar, CheckCircle, XCircle, PlayCircle, Users } from "lucide-react";
import JobPreparationService from "@/services/JobPreparationService";
import { Category, Subject, Topic } from "@/types/jobPreparation";

interface ExamSummary {
    selectedSubjects: Subject[];
    selectedTopics: Topic[];
    questionLimit: number;
    durationMinutes: number;
}

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
    const [questionLimit, setQuestionLimit] = useState(20);
    const [durationMinutes, setDurationMinutes] = useState(30);
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
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

    // Filter subjects and topics based on search query
    const filteredSubjects = useMemo(() => {
        if (!searchQuery || !subjectsData?.results) return subjectsData?.results || [];
        return subjectsData.results.filter(subject =>
            subject.subject_title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [subjectsData, searchQuery]);

    const filteredTopics = useMemo(() => {
        if (!searchQuery || !topicsData?.results) return topicsData?.results || [];
        return topicsData.results.filter(topic =>
            topic.topic_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [topicsData, searchQuery]);

    // Filter and paginate exam records
    const filteredExams = useMemo(() => {
        let filtered = examRecords;
        if (examFilter !== 'all') {
            filtered = examRecords.filter(exam => exam.status === examFilter);
        }
        return filtered;
    }, [examRecords, examFilter]);

    const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
    const paginatedExams = filteredExams.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
                className="flex min-h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors cursor-pointer hover:bg-accent/5 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => !disabled && setOpenDropdown(openDropdown === keyField ? null : keyField)}
            >
                <div className="flex items-center justify-between w-full">
                    <span className={selectedItems.length === 0 ? "text-muted-foreground" : ""}>
                        {selectedItems.length === 0 ? placeholder : `${selectedItems.length} selected`}
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === keyField ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {openDropdown === keyField && !disabled && (
                <div className="absolute z-50 min-w-full mt-1 overflow-hidden rounded-md border bg-popover shadow-lg animate-in fade-in-0 zoom-in-95">
                    <div className="p-2 border-b">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={`Search ${labelField.toLowerCase()}...`}
                                className="pl-8 h-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto p-1">
                        {isLoading ? (
                            <div className="px-2 py-2 text-sm text-center">Loading...</div>
                        ) : options.length === 0 ? (
                            <div className="px-2 py-2 text-sm text-muted-foreground text-center">No options found</div>
                        ) : (
                            options.map(item => {
                                const isSelected = selectedItems.some(selected => selected[keyField] === item[keyField]);
                                return (
                                    <div
                                        key={item[keyField]}
                                        className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggle(item);
                                        }}
                                    >
                                        <div className="flex items-center space-x-2 w-full">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => {}}
                                                className="rounded border-2"
                                            />
                                            <div className="flex justify-between items-center w-full">
                                                <span className="font-medium">{item[labelField]}</span>
                                                {countField && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        {item[countField]} Q
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'running':
                return <PlayCircle className="h-4 w-4 text-blue-500" />;
            case 'active':
                return <Clock className="h-4 w-4 text-orange-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            completed: 'bg-green-100 text-green-800 border-green-200',
            failed: 'bg-red-100 text-red-800 border-red-200',
            running: 'bg-blue-100 text-blue-800 border-blue-200',
            active: 'bg-orange-100 text-orange-800 border-orange-200'
        };
        return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            setOpenDropdown(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                            {/* Exam Configuration */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Exam Configuration
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Category */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Category</Label>
                                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
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

                                        {/* Question Limit */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Questions</Label>
                                            <Input
                                                type="number"
                                                value={questionLimit}
                                                onChange={(e) => setQuestionLimit(parseInt(e.target.value) || 20)}
                                                min="1"
                                                max="100"
                                                placeholder="20"
                                            />
                                        </div>

                                        {/* Duration */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Duration (minutes)</Label>
                                            <Input
                                                type="number"
                                                value={durationMinutes}
                                                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 30)}
                                                min="1"
                                                max="300"
                                                placeholder="30"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Subjects */}
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium flex items-center gap-2">
                                                <FileText className="h-4 w-4" />
                                                Subjects
                                            </Label>
                                            <CustomMultiSelect
                                                placeholder="Select subjects"
                                                options={filteredSubjects}
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
                                            <Label className="text-sm font-medium flex items-center gap-2">
                                                <Target className="h-4 w-4" />
                                                Topics (Optional)
                                            </Label>
                                            <CustomMultiSelect
                                                placeholder="Select topics"
                                                options={filteredTopics}
                                                selectedItems={selectedTopics}
                                                onToggle={handleTopicToggle}
                                                isLoading={topicsLoading}
                                                keyField="uid"
                                                labelField="topic_name"
                                                countField="total_questions"
                                                disabled={selectedSubjects.length === 0}
                                            />
                                        </div>
                                    </div>

                                    {/* Selected Items Display */}
                                    {(selectedSubjects.length > 0 || selectedTopics.length > 0) && (
                                        <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                                            <h4 className="font-medium text-sm">Selected Items</h4>
                                            
                                            {selectedSubjects.length > 0 && (
                                                <div>
                                                    <Label className="text-xs text-muted-foreground mb-2 block">
                                                        Subjects ({selectedSubjects.length})
                                                    </Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedSubjects.map(subject => (
                                                            <Badge
                                                                key={subject.uid}
                                                                variant="secondary"
                                                                className="flex items-center gap-1"
                                                            >
                                                                {subject.subject_title}
                                                                <X
                                                                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                                                                    onClick={() => removeSubject(subject.uid)}
                                                                />
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {selectedTopics.length > 0 && (
                                                <div>
                                                    <Label className="text-xs text-muted-foreground mb-2 block">
                                                        Topics ({selectedTopics.length})
                                                    </Label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedTopics.map(topic => (
                                                            <Badge
                                                                key={topic.uid}
                                                                variant="outline"
                                                                className="flex items-center gap-1"
                                                            >
                                                                {topic.topic_name}
                                                                <X
                                                                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                                                                    onClick={() => removeTopic(topic.uid)}
                                                                />
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <Button
                                            onClick={() => setShowSummaryModal(true)}
                                            disabled={selectedSubjects.length === 0 && selectedTopics.length === 0}
                                            size="lg"
                                        >
                                            Create Exam
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="history" className="space-y-6">
                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    <Label className="text-sm font-medium">Filter by Status:</Label>
                                    <Select value={examFilter} onValueChange={(value: any) => setExamFilter(value)}>
                                        <SelectTrigger className="w-32">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="running">Running</SelectItem>
                                            <SelectItem value="completed">Passed</SelectItem>
                                            <SelectItem value="failed">Failed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Showing {filteredExams.length} exams
                                </div>
                            </div>

                            {/* Exam Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {paginatedExams.map((exam) => (
                                    <Card key={exam.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4">
                                            <div className="space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <h3 className="font-medium line-clamp-2">{exam.title}</h3>
                                                    <div className="flex items-center gap-1">
                                                        {getStatusIcon(exam.status)}
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <Badge 
                                                        variant="outline" 
                                                        className={`text-xs ${getStatusBadge(exam.status)}`}
                                                    >
                                                        {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                                                    </Badge>
                                                    
                                                    <div className="text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Users className="h-3 w-3" />
                                                            {exam.category}
                                                        </div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <FileText className="h-3 w-3" />
                                                            {exam.questionsCount} Questions
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-3 w-3" />
                                                            {exam.duration} Minutes
                                                        </div>
                                                    </div>
                                                </div>

                                                {exam.score !== undefined && (
                                                    <div className="pt-2 border-t">
                                                        <div className="text-sm">
                                                            <span className="text-muted-foreground">Score: </span>
                                                            <span className={`font-medium ${exam.score >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {exam.score}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="pt-2 border-t">
                                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {exam.completedAt ? `Completed: ${exam.completedAt}` : `Created: ${exam.createdAt}`}
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 pt-2">
                                                    {exam.status === 'active' && (
                                                        <Button size="sm" className="flex-1">
                                                            Start Exam
                                                        </Button>
                                                    )}
                                                    {exam.status === 'running' && (
                                                        <Button size="sm" variant="outline" className="flex-1">
                                                            Continue
                                                        </Button>
                                                    )}
                                                    {(exam.status === 'completed' || exam.status === 'failed') && (
                                                        <Button size="sm" variant="outline" className="flex-1">
                                                            View Results
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            {/* Empty State */}
                            {filteredExams.length === 0 && (
                                <div className="text-center py-12">
                                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">
                                        {examFilter === 'all' ? 'No exams found' : `No ${examFilter} exams found`}
                                    </p>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious 
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(Math.max(1, currentPage - 1));
                                                    }}
                                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                                />
                                            </PaginationItem>
                                            
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setCurrentPage(page);
                                                        }}
                                                        isActive={currentPage === page}
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                            
                                            <PaginationItem>
                                                <PaginationNext 
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(Math.min(totalPages, currentPage + 1));
                                                    }}
                                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>

                    {/* Summary Modal */}
                    <Dialog open={showSummaryModal} onOpenChange={setShowSummaryModal}>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Target className="h-5 w-5" />
                                    Exam Summary
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4 py-4">
                                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">{questionLimit}</div>
                                        <div className="text-sm text-muted-foreground">Questions</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-primary">{durationMinutes}</div>
                                        <div className="text-sm text-muted-foreground">Minutes</div>
                                    </div>
                                </div>

                                {examSummary.selectedSubjects.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            Selected Subjects ({examSummary.selectedSubjects.length})
                                        </h4>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {examSummary.selectedSubjects.map(subject => (
                                                <div key={subject.uid} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                                                    <span className="text-sm">{subject.subject_title}</span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {subject.total_questions} Q
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {examSummary.selectedTopics.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <Target className="h-4 w-4" />
                                            Selected Topics ({examSummary.selectedTopics.length})
                                        </h4>
                                        <div className="space-y-2 max-h-32 overflow-y-auto">
                                            {examSummary.selectedTopics.map(topic => (
                                                <div key={topic.uid} className="flex justify-between items-center p-2 bg-muted/20 rounded">
                                                    <span className="text-sm">{topic.topic_name}</span>
                                                    <Badge variant="secondary" className="text-xs">
                                                        {topic.total_questions} Q
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowSummaryModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button onClick={handleCreateExam}>
                                    Start Exam
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </ScrollArea>
        </div>
    );
}