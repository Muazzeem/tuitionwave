import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Target, FileText, X, Search } from "lucide-react";
import { Category, Subject, Topic } from "@/types/jobPreparation";
import CustomMultiSelect from './CustomMultiSelect';
import { Badge } from "@/components/ui/badge";

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
  onTopicRemove,
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

  return (
    <div className="relative">
      <Card className='dark:bg-gray-800 dark:border-gray-700'>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Exam Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    categories.map(category => (
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
            {/* Subjects Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Subjects</Label>
              <CustomMultiSelect
                placeholder="Select subjects"
                options={subjectOptions}
                selectedItems={selectedSubjectOptions}
                onToggle={handleSubjectToggle}
                onRemove={onSubjectRemove}
                isLoading={subjectsLoading}
                disabled={!selectedCategory}
              />
            </div>
          </div>
          {selectedSubjects.length > 0 && (
            <div className="space-y-4">
              <Label className="text-sm font-medium">Selected Subjects & Topics</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedSubjects.map(subject => (
                  <Accordion type="multiple" className="w-full" key={subject.uid}>
                    <AccordionItem
                      value={subject.uid}
                      className="border border-gray-200 dark:border-gray-700 rounded-md dark:bg-gray-900 dark:border-gray-700"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex items-center justify-between w-full mr-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">{subject.subject_title}</span>
                            <Badge variant="secondary" className="ml-2">
                              {subject.total_questions} Questions
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSubjectRemove(subject.uid);
                            }}
                            className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </AccordionTrigger>

                      {/* Scrollable Accordion Content */}
                      <AccordionContent className="px-4 pb-4 max-h-[300px] overflow-y-auto">
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Topics (Optional)</Label>

                          {/* Search Box for Topics */}
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Search topics..."
                              className="pl-8 h-9"
                              value={topicSearchQueries[subject.uid] || ''}
                              onChange={(e) => handleTopicSearch(subject.uid, e.target.value)}
                            />
                          </div>

                          {topicsLoading[subject.uid] ? (
                            <div className="text-sm text-muted-foreground">Loading topics...</div>
                          ) : (
                            <div className="space-y-2">
                              {getFilteredTopics(subject.uid).length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {getFilteredTopics(subject.uid).map(topic => (
                                      <Badge
                                        key={topic.uid}
                                        variant={isTopicSelected(topic.uid) ? "default" : "outline"}
                                        className={`cursor-pointer transition-colors hover:scale-105 ${isTopicSelected(topic.uid)
                                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                          : 'hover:bg-accent hover:text-accent-foreground'
                                          }`}
                                        onClick={() => handleTopicToggle(topic)}
                                      >
                                        {topic.topic_name}
                                        <span className="ml-1 text-xs opacity-70">
                                          ({topic.total_questions})
                                        </span>
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-sm text-muted-foreground">
                                  {topicSearchQueries[subject.uid]
                                    ? 'No topics found'
                                    : 'No topics available'}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Create Exam Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={onCreateExam}
          disabled={selectedSubjects.length === 0}
          size="lg"
          className="shadow-lg hover:shadow-xl transition-shadow text-white"
        >
          Create Exam
        </Button>
      </div>
    </div>
  );
}