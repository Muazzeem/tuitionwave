
import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import ExamStatusCards from '@/components/JobPreparation/ExamStatusCards';
import PerformanceChart from '@/components/JobPreparation/PerformanceChart';
import RankingSystem from '@/components/JobPreparation/RankingSystem';
import StudyProgress from '@/components/JobPreparation/StudyProgress';
import QuickStats from '@/components/JobPreparation/QuickStats';
import SocialMediaCards from '@/components/SocialMediaCard';

export default function JobPreparationDashboard() {
  useEffect(() => {
    document.title = "Tuition Wave | Candidate Dashboard";
  }, []);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, this would come from API
  const dashboardData = {
    totalStudents: 2847,
    studyStreak: 12,
    weeklyGoal: 5,
    weeklyCompleted: 3
  };

  return (
    <div className="flex-1 overflow-auto dark:bg-gray-900">
      <DashboardHeader userName="BCS Candidate" />
      
      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">BCS Preparation Dashboard</h1>
              <p className="text-muted-foreground mt-1">Track your progress and improve your performance</p>
            </div>
          </div>

          <div className='mt-5'>
            <QuickStats />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-5">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="ranking">Ranking</TabsTrigger>
              {/* <TabsTrigger value="activities">Activities</TabsTrigger> */}
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

            {/* <TabsContent value="activities" className="space-y-6 mt-5">
              <RecentActivities />
            </TabsContent> */}
          </Tabs>
          <SocialMediaCards />
        </div>
      </ScrollArea>
    </div>
  );
}
