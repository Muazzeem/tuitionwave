import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  FileText,
  X,
  Search,
  Clock,
  Hash,
  BookOpen,
  ChevronRight,
  Settings,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus
} from "lucide-react";

// Types
interface Category {
  uid: string;
  category_name: string;
}

interface Subject {
  uid: string;
  subject_title: string;
  total_questions: number;
}

interface Topic {
  uid: string;
  topic_name: string;
  total_questions: number;
}

interface ExamConfigurationProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubjects: Subject[];
  selectedTopics: Topic[];
  questionLimit: number;
  setQuestionLimit: (limit: number) => void;
  durationMinutes: number;
  setDurationMinutes: (duration: number) => void;
  categories: Category[];
  subjects: Subject[];
  subjectTopics: Record<string, Topic[]>;
  categoriesLoading: boolean;
  subjectsLoading: boolean;
  topicsLoading: Record<string, boolean>;
  onSubjectToggle: (subject: Subject) => void;
  onTopicToggle: (topic: Topic) => void;
  onSubjectRemove: (uid: string) => void;
  onTopicRemove: (topicUid: string) => void;
  onCreateExam: () => void;
}

// Custom MultiSelect Component
interface MultiSelectOption {
  uid: string;
  label: string;
  count?: number;
}

interface CustomMultiSelectProps {
  placeholder: string;
  options: MultiSelectOption[];
  selectedItems: MultiSelectOption[];
  onToggle: (item: MultiSelectOption) => void;
  onRemove: (uid: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

function CustomMultiSelect({
  placeholder,
  options,
  selectedItems,
  onToggle,
  isLoading,
  disabled
}: CustomMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSelected = (uid: string) => selectedItems.some(item => item.uid === uid);

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || isLoading}
        className="w-full justify-between border-primary-800 h-10 px-3 bg-background text-white hover:text-white
        hover:bg-background
        "
      >
        <span className="text-sm text-muted-foreground">
          {selectedItems.length > 0
            ? `${selectedItems.length} subject${selectedItems.length !== 1 ? 's' : ''} selected`
            : placeholder
          }
        </span>
        <ChevronRight className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 border-0 rounded-md shadow-lg bg-gray-900">
          <div className="max-h-48 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Loading...</span>
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">
                {searchQuery ? 'No subjects found' : 'No subjects available'}
              </div>
            ) : (
              filteredOptions.map(option => (
                <div
                  key={option.uid}
                  className="flex items-center justify-between p-3 hover:bg-gray-700 cursor-pointer border-b last:border-b-0 border-gray-700 text-white"
                  onClick={() => {
                    onToggle(option);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${isSelected(option.uid)
                      ? 'bg-primary border-primary'
                      : 'border-muted-foreground'
                      }`}>
                      {isSelected(option.uid) && (
                        <CheckCircle className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  {option.count && (
                    <Badge variant="secondary" className="text-xs">
                      {option.count}
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExamConfiguration({
  selectedCategory,
  setSelectedCategory,
  selectedSubjects,
  selectedTopics,
  questionLimit,
  setQuestionLimit,
  durationMinutes,
  setDurationMinutes,
  categories,
  subjects,
  subjectTopics,
  categoriesLoading,
  subjectsLoading,
  topicsLoading,
  onSubjectToggle,
  onTopicToggle,
  onSubjectRemove,
  onCreateExam
}: ExamConfigurationProps) {
  const [topicSearchQueries, setTopicSearchQueries] = useState<Record<string, string>>({});

  const subjectOptions = subjects.map(subject => ({
    uid: subject.uid,
    label: subject.subject_title,
    count: subject.total_questions
  }));

  const selectedSubjectOptions = selectedSubjects.map(subject => ({
    uid: subject.uid,
    label: subject.subject_title,
    count: subject.total_questions
  }));

  const handleSubjectToggle = (item: { uid: string; label: string; count?: number }) => {
    const subject = subjects.find(s => s.uid === item.uid);
    if (subject) {
      onSubjectToggle(subject);
    }
  };

  const handleTopicToggle = (topic: Topic) => {
    onTopicToggle(topic);
  };

  const isTopicSelected = (topicUid: string) => {
    return selectedTopics.some(topic => topic.uid === topicUid);
  };

  const handleTopicSearch = (subjectUid: string, query: string) => {
    setTopicSearchQueries(prev => ({
      ...prev,
      [subjectUid]: query
    }));
  };

  const getFilteredTopics = (subjectUid: string) => {
    const topics = subjectTopics[subjectUid] || [];
    const searchQuery = topicSearchQueries[subjectUid] || '';

    if (!searchQuery) return topics;

    return topics.filter(topic =>
      topic.topic_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getTotalSelectedQuestions = () => {
    if (selectedTopics.length > 0) {
      return selectedTopics.reduce((total, topic) => total + topic.total_questions, 0);
    }
    return selectedSubjects.reduce((total, subject) => total + subject.total_questions, 0);
  };

  const getConfigurationStatus = () => {
    if (!selectedCategory) return { status: 'incomplete', message: 'Select a category to start' };
    if (selectedSubjects.length === 0) return { status: 'incomplete', message: 'Select at least one subject' };
    if (questionLimit <= 0) return { status: 'incomplete', message: 'Set question limit' };
    if (durationMinutes <= 0) return { status: 'incomplete', message: 'Set exam duration' };

    const totalQuestions = getTotalSelectedQuestions();
    if (questionLimit > totalQuestions) {
      return {
        status: 'warning',
        message: `Question limit exceeds available questions (${totalQuestions})`
      };
    }

    return { status: 'complete', message: 'Configuration complete' };
  };

  const configStatus = getConfigurationStatus();
  const canCreateExam = configStatus.status === 'complete' || configStatus.status === 'warning';

  return (
    <div className="space-y-6">
      {/* Main Configuration */}
      <Card className="overflow-hidden bg-background border-gray-900 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Target className="h-5 w-5 text-primary" />
            Exam Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Basic Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Category */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2 text-white">
                <BookOpen className="h-4 w-4" />
                Category
              </Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-11 bg-background border border-primary-800 transition-colors text-white">
                  <SelectValue placeholder="Choose category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-0">
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading categories...
                      </div>
                    </SelectItem>
                  ) : (
                    categories.map(category => (
                      <SelectItem key={category.uid} value={category.uid} className="text-white">
                        {category.category_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Question Limit */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2 text-white">
                <Hash className="h-4 w-4" />
                Questions
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={questionLimit || ''}
                  onChange={(e) => setQuestionLimit(parseInt(e.target.value) || 0)}
                  min="1"
                  max="200"
                  placeholder="Enter number (max 200)"
                  className="h-11 pr-12 bg-background border border-primary-800 transition-colors text-white"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2 text-white">
                <Clock className="h-4 w-4" />
                Duration
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  value={durationMinutes || ''}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 0)}
                  min="1"
                  max="300"
                  placeholder="Minutes"
                  className="h-11 pr-12 bg-background hover:border-primary/50 transition-colors text-white border-primary-800"
                />
              </div>
            </div>

            {/* Subjects Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold flex items-center gap-2 text-white">
                <Plus className="h-4 w-4" />
                Subjects
              </Label>
              <CustomMultiSelect
                placeholder="Add subjects"
                options={subjectOptions}
                selectedItems={selectedSubjectOptions}
                onToggle={handleSubjectToggle}
                onRemove={onSubjectRemove}
                isLoading={subjectsLoading}
                disabled={!selectedCategory}
              />
            </div>
          </div>

          {/* Summary Stats */}
          {selectedSubjects.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 from-blue-900/10 to-indigo-900/10 rounded-lg p-1 border border-blue-200 border-blue-800">
              <div className="grid grid-cols-4 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 text-blue-400">
                    {selectedSubjects.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Subject{selectedSubjects.length !== 1 ? 's' : ''}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-indigo-600 text-indigo-400">
                    {selectedTopics.length}
                  </div>
                  <div className="text-xs text-muted-foreground">Topic{selectedTopics.length !== 1 ? 's' : ''}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 text-purple-400">
                    {getTotalSelectedQuestions()}
                  </div>
                  <div className="text-xs text-muted-foreground">Available Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-600 text-pink-400">
                    {durationMinutes || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">Minutes</div>
                </div>
              </div>
            </div>
          )}

          {/* Selected Subjects & Topics */}
          {selectedSubjects.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-md font-semibold text-white">Selected Subjects & Topics</Label>
                <Badge variant="outline" className="text-xs text-white">
                  {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {selectedSubjects.map(subject => (
                  <Card key={subject.uid} className="overflow-hidden hover:shadow-md transition-shadow bg-gray-900/50 border-0">
                    <Accordion type="multiple" className="w-full hover:text-white text-white">
                      <AccordionItem value={subject.uid} className="border-none">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-900 transition-colors">
                          <div className="flex items-center justify-between w-full mr-4">
                            <div className="flex items-center gap-3">
                              <div className="p-1.5 bg-primary/10 rounded-md">
                                <FileText className="h-4 w-4 text-primary" />
                              </div>
                              <div className="text-left">
                                <div className="font-medium text-sm text-white">{subject.subject_title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {subject.total_questions} questions available
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSubjectRemove(subject.uid);
                              }}
                              className="h-8 w-8 p-0 hover:bg-red-100 hover:bg-red-900/50 text-muted-foreground hover:text-red-600"
                            >
                              <X className="h-4 w-4 text-white" />
                            </Button>
                          </div>
                        </AccordionTrigger>

                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide text-white mt-4">
                                Topics (Optional)
                              </Label>
                              {selectedTopics.filter(t =>
                                subjectTopics[subject.uid]?.some(st => st.uid === t.uid)
                              ).length > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {selectedTopics.filter(t =>
                                      subjectTopics[subject.uid]?.some(st => st.uid === t.uid)
                                    ).length} selected
                                  </Badge>
                                )}
                            </div>

                            {/* Topic Search */}
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search topics..."
                                className="pl-10 h-9 bg-background border-0 text-white"
                                value={topicSearchQueries[subject.uid] || ''}
                                onChange={(e) => handleTopicSearch(subject.uid, e.target.value)}
                              />
                            </div>

                            {/* Topics List */}
                            <div className="max-h-40 overflow-y-auto space-y-2">
                              {topicsLoading[subject.uid] ? (
                                <div className="flex items-center justify-center py-4">
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                  <span className="text-sm text-muted-foreground">Loading topics...</span>
                                </div>
                              ) : getFilteredTopics(subject.uid).length > 0 ? (
                                <div className="space-y-1">
                                  {getFilteredTopics(subject.uid).map(topic => (
                                    <div
                                      key={topic.uid}
                                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-all hover:bg-accent/50 ${isTopicSelected(topic.uid)
                                        ? 'bg-primary/10 border border-primary/20'
                                        : 'hover:bg-accent/30'
                                        }`}
                                      onClick={() => handleTopicToggle(topic)}
                                    >
                                      <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded border-2 flex items-center justify-center ${isTopicSelected(topic.uid)
                                          ? 'bg-primary border-primary'
                                          : 'border-muted-foreground'
                                          }`}>
                                          {isTopicSelected(topic.uid) && (
                                            <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full" />
                                          )}
                                        </div>
                                        <span className="text-sm font-medium text-white">{topic.topic_name}</span>
                                      </div>
                                      <Badge variant="outline" className="text-xs border-0 bg-background text-white">
                                        {topic.total_questions}
                                      </Badge>
                                    </div>
                                  ))}
                                  </div>
                                ) : (
                                    <div className="text-center py-6 text-sm text-muted-foreground">
                                  {topicSearchQueries[subject.uid]
                                        ? 'No topics match your search'
                                        : 'No topics available for this subject'}
                                </div>
                              )}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Action Area */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-gray-700">
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">
                Ready to create your exam?
              </p>
              <p className="text-xs text-muted-foreground">
                {canCreateExam
                  ? `${questionLimit} questions • ${durationMinutes} minutes • ${selectedSubjects.length} subject${selectedSubjects.length !== 1 ? 's' : ''}`
                  : 'Complete the configuration above to continue'
                }
              </p>
            </div>

            <Button
              onClick={onCreateExam}
              disabled={!canCreateExam}
              size="lg"
              className={`min-w-32 font-semibold transition-all text-white ${canCreateExam
                ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl hover:scale-105'
                : ''
                }`}
            >
              {canCreateExam ? (
                <>
                  <Target className="h-4 w-4 mr-2" />
                  Create Exam
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Configure First
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
