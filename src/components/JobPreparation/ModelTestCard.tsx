import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, Trophy, Eye } from 'lucide-react';

interface ModelTestCardProps {
  exam: {
    uid: string;
    title: string;
    description: string;
    duration: string;
    totalQuestions: number;
    category: string;
    status: string;
    user_exam?: {
      percentage: number;
      status: string;
    } | null;
    passing_marks: number;
    scheduled_date?: string;
    expired_date?: string;
  };
  onStartExam: (exam: any) => void;
  getStatusInfo: (exam: any) => {
    icon: any;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    action: string;
    disabled: boolean;
    buttonClass: string;
  };
  processingExams: Set<string>;
}

const ModelTestCard: React.FC<ModelTestCardProps> = ({
  exam,
  onStartExam,
  getStatusInfo,
  processingExams
}) => {
  const statusInfo = getStatusInfo(exam);
  const isProcessing = processingExams.has(exam.uid);
  const userProgress = exam.user_exam?.percentage || 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-slate-800 bg-slate-900/50 backdrop-blur-sm">
      <CardContent className="p-6">
        {/* Progress Section */}
        <div className="mb-4 flex items-center justify-center">
          <div className="rounded-xl bg-slate-800/60 px-4 py-3 text-center min-w-[120px]">
            <div className="text-2xl font-bold text-white">
              {userProgress.toFixed(1)}%
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Your Progress
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 text-center line-clamp-2 min-h-[3.5rem]">
          {exam.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 mb-4 text-center line-clamp-3 min-h-[4rem]">
          {exam.description}
        </p>

        {/* Status Badges */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          <Badge 
            className={`${statusInfo.bgColor} ${statusInfo.borderColor} ${statusInfo.color} border text-xs font-medium`}
          >
            <statusInfo.icon className="w-3 h-3 mr-1" />
            {statusInfo.label}
          </Badge>
          <Badge className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs">
            {exam.category}
          </Badge>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-4 mb-6 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{exam.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>{exam.totalQuestions} Questions</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            <span>Pass Mark: {exam.passing_marks}</span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={() => onStartExam(exam)}
          disabled={statusInfo.disabled || isProcessing}
          className={`w-full ${statusInfo.buttonClass} transition-all duration-200`}
          size="sm"
        >
          {isProcessing ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {statusInfo.action === 'View Results' && <Eye className="w-4 h-4 mr-2" />}
              {statusInfo.action}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ModelTestCard;