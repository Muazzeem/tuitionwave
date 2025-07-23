
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, FileText, X } from "lucide-react";
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

  return (
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
        </div>

        {/* Subjects Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Subjects
          </Label>
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

        {/* Selected Subjects with Topics */}
        {selectedSubjects.length > 0 && (
          <div className="space-y-4">
            <Label className="text-sm font-medium">Selected Subjects & Topics</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedSubjects.map(subject => (
                <Card key={subject.uid} className="border-2">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {subject.subject_title}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onSubjectRemove(subject.uid)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Badge variant="secondary" className="w-fit">
                      {subject.total_questions} Questions
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Topics (Optional)</Label>
                      {topicsLoading[subject.uid] ? (
                        <div className="text-sm text-muted-foreground">Loading topics...</div>
                      ) : (
                        <div className="space-y-2">
                          {subjectTopics[subject.uid]?.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                              {subjectTopics[subject.uid].map(topic => (
                                <div
                                  key={topic.uid}
                                  className={`flex items-center justify-between p-2 rounded-md border cursor-pointer transition-colors ${
                                    isTopicSelected(topic.uid)
                                      ? 'bg-primary/10 border-primary'
                                      : 'bg-background hover:bg-accent'
                                  }`}
                                  onClick={() => handleTopicToggle(topic)}
                                >
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="checkbox"
                                      checked={isTopicSelected(topic.uid)}
                                      onChange={() => handleTopicToggle(topic)}
                                      className="rounded"
                                    />
                                    <span className="text-sm">{topic.topic_name}</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {topic.total_questions} Q
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground">No topics available</div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={onCreateExam}
            disabled={selectedSubjects.length === 0}
            size="lg"
          >
            Create Exam
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
