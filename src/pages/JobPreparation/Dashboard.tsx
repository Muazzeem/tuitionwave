
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp, 
  Users, 
  Award,
  Calendar,
  BarChart3,
  CheckCircle,
  XCircle,
  PlayCircle
} from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import ExamStatusCards from '@/components/JobPreparation/ExamStatusCards';
import PerformanceChart from '@/components/JobPreparation/PerformanceChart';
import RankingSystem from '@/components/JobPreparation/RankingSystem';
import RecentActivities from '@/components/JobPreparation/RecentActivities';
import StudyProgress from '@/components/JobPreparation/StudyProgress';
import QuickStats from '@/components/JobPreparation/QuickStats';

export default function JobPreparationDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, this would come from API
  const dashboardData = {
    totalExams: 45,
    completedExams: 32,
    averageScore: 78.5,
    currentRank: 156,
    totalStudents: 2847,
    studyStreak: 12,
    weeklyGoal: 5,
    weeklyCompleted: 3
  };

  return (
    <div className="min-h-screen bg-background w-full dark:bg-gray-900">
      <DashboardHeader userName="BCS Candidate" />
      
      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">BCS Preparation Dashboard</h1>
              <p className="text-muted-foreground mt-1">Track your progress and improve your performance</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {dashboardData.studyStreak} day streak
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                Rank #{dashboardData.currentRank}
              </Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className='mt-5'>
            <QuickStats data={dashboardData} />
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-5">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="ranking">Ranking</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-5">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ExamStatusCards />
                </div>
                <div className="space-y-6">
                  <StudyProgress />
                  <Card className='dark:bg-gray-800 dark:border-gray-700'>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Weekly Goal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{dashboardData.weeklyCompleted}/{dashboardData.weeklyGoal} exams</span>
                        </div>
                        <Progress value={(dashboardData.weeklyCompleted / dashboardData.weeklyGoal) * 100} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6 mt-5">
              <PerformanceChart />
            </TabsContent>

            <TabsContent value="ranking" className="space-y-6 mt-5">
              <RankingSystem />
            </TabsContent>

            <TabsContent value="activities" className="space-y-6 mt-5">
              <RecentActivities />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  );
}
