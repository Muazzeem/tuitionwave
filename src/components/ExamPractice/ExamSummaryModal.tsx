
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, FileText } from "lucide-react";
import { Subject, Topic } from "@/types/jobPreparation";

interface ExamSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedSubjects: Subject[];
  selectedTopics: Topic[];
  questionLimit: number;
  durationMinutes: number;
}

export default function ExamSummaryModal({
  isOpen,
  onClose,
  onConfirm,
  selectedSubjects,
  selectedTopics,
  questionLimit,
  durationMinutes
}: ExamSummaryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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

          {selectedSubjects.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Selected Subjects ({selectedSubjects.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedSubjects.map(subject => (
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

          {selectedTopics.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Selected Topics ({selectedTopics.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedTopics.map(topic => (
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} className='text-white bg-blue-500'>
            Start Exam
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
