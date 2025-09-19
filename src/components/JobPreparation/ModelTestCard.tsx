import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, Trophy, Eye, AlertCircle, Timer } from 'lucide-react';

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

// Custom hook for countdown timer
const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!targetDate) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return {
          days,
          hours,
          minutes,
          seconds,
          total: difference,
          expired: false
        };
      } else {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
          expired: true
        };
      }
    };

    // Calculate initial time
    setTimeLeft(calculateTimeLeft());

    // Set up interval to update every second
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Clear interval if expired
      if (newTimeLeft.expired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
};

const CountdownDisplay = ({
  targetDate,
  className = "",
  hideForExpired = false,
  examStatus = "running",
}) => {
  const timeLeft = useCountdown(targetDate);

  if (!timeLeft || !targetDate) return null;
  if (hideForExpired && (timeLeft.expired || examStatus === "expired")) return null;

  const fmt2 = (n: number) => String(n).padStart(2, "0");

  const basePill =
    "flex justify-center items-center gap-4 rounded-2xl h-20 border w-full px-6 bg-[#14282A] border-[#2D5A58]";

  const numWrap = "flex items-center gap-3 font-semibold";

  const Unit = ({ value, suffix }: { value: number | string; suffix: string }) => (
    <span className="text-emerald-300 text-sm font-bold">
      {value}
      <span className="ml-0.5 text-emerald-300/70 text-base">{suffix}</span>
    </span>
  );

  if (timeLeft.expired) {
    return (
      <div className="flex justify-center w-full">
        <div className={`${basePill} border-rose-900 bg-rose-900/10 ${className}`}>
          <AlertCircle className="w-5 h-5 text-rose-300" />
          <span className="text-rose-300 font-semibold">Expired</span>
        </div>
      </div>
    );
  }

  const showDays = timeLeft.days > 0;

  return (
    <div className="flex justify-center w-full">
      <div className={`${basePill} ${className}`}>
        <Timer className="w-5 h-5 text-emerald-300" />
        <div className={`${numWrap}`}>
          {showDays && (
            <>
              <Unit value={fmt2(timeLeft.days)} suffix="d" />
              <span className="text-emerald-300/60">:</span>
            </>
          )}
          <Unit value={fmt2(timeLeft.hours)} suffix="h" />
          <span className="text-emerald-300/60">:</span>
          <Unit value={fmt2(timeLeft.minutes)} suffix="m" />
          <span className="text-emerald-300/60">:</span>
          <Unit value={fmt2(timeLeft.seconds)} suffix="s" />
        </div>
      </div>
    </div>
  );
};




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
    <Card className="group bg-background border-0 rounded-2xl">
      <CardContent className="p-3 pr-4 pl-4">
        {/* Progress Section */}
        {exam.user_exam ? (
          <div className="mb-4 flex items-center justify-center">
            <div className="rounded-xl bg-gray-700 py-3 text-center w-full">
              <div className="text-2xl font-bold text-white">
                {userProgress.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Your Progress
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-3">
            {statusInfo.label === 'Available' ? (
              <CountdownDisplay
                targetDate={exam.expired_date}
                className="border border-[#2B3750] bg-[#0A1A1F] text-[#CFE0F5]"
                hideForExpired={exam.status === "expired"}
                examStatus={exam.status}
              />
            ) : (
              <div className="flex items-center justify-center w-full">
                <div
                  className={`rounded-xl h-20 py-3 text-center w-full ${userProgress === 0 ? "bg-red-400/15" : "bg-gray-700"
                    }`}
                >
                  <div className="text-2xl font-bold text-white">
                    {userProgress.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Your Progress
                  </div>
                </div>
              </div>
            )}
          </div>
        )
        }

        {/* Title */}
        <h3 className="text-lg font-semibold text-white text-center">
          {exam.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 mb-4 text-center line-clamp-3">
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
        <div className='flex justify-center'>
          <Button
            onClick={() => onStartExam(exam)}
            disabled={statusInfo.disabled || isProcessing}
            className={`${statusInfo.buttonClass} transition-all duration-200 rounded-3xl px-5`}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelTestCard;