
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, FileText } from "lucide-react";
import { Category, Subject, Topic } from "@/types/jobPreparation";
import CustomMultiSelect from './CustomMultiSelect';

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
  topics: Topic[];
  categoriesLoading: boolean;
  subjectsLoading: boolean;
  topicsLoading: boolean;
  onSubjectToggle: (subject: Subject) => void;
  onTopicToggle: (topic: Topic) => void;
  onSubjectRemove: (uid: string) => void;
  onTopicRemove: (uid: string) => void;
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
  topics,
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

  const topicOptions = topics.map(topic => ({
    uid: topic.uid,
    label: topic.topic_name,
    count: topic.total_questions
  }));

  const selectedSubjectOptions = selectedSubjects.map(subject => ({
    uid: subject.uid,
    label: subject.subject_title,
    count: subject.total_questions
  }));

  const selectedTopicOptions = selectedTopics.map(topic => ({
    uid: topic.uid,
    label: topic.topic_name,
    count: topic.total_questions
  }));

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subjects */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Subjects
            </Label>
            <CustomMultiSelect
              placeholder="Select subjects"
              options={subjectOptions}
              selectedItems={selectedSubjectOptions}
              onToggle={onSubjectToggle}
              onRemove={onSubjectRemove}
              isLoading={subjectsLoading}
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
              options={topicOptions}
              selectedItems={selectedTopicOptions}
              onToggle={onTopicToggle}
              onRemove={onTopicRemove}
              isLoading={topicsLoading}
              disabled={selectedSubjects.length === 0}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={onCreateExam}
            disabled={selectedSubjects.length === 0 && selectedTopics.length === 0}
            size="lg"
          >
            Create Exam
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
