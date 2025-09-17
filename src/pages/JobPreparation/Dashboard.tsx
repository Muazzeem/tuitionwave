
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import ExamStatusCards from '@/components/JobPreparation/ExamStatusCards';
import PerformanceChart from '@/components/JobPreparation/PerformanceChart';
import RankingSystem from '@/components/JobPreparation/RankingSystem';
import StudyProgress from '@/components/JobPreparation/StudyProgress';
import QuickStats from '@/components/JobPreparation/QuickStats';
import SocialMediaCards from '@/components/SocialMediaCard';
import { useAuth } from '@/contexts/AuthContext';
import RoutineTable from '@/components/JobPreparation/Routine';
import WeeklyGoal from '@/components/JobPreparation/WeeklyGoal';
import LiveModelTests from '@/components/JobPreparation/RecetModelTest';


export default function JobPreparationDashboard() {
  const { userProfile, clearProfile } = useAuth();
  useEffect(() => {
    document.title = "Tuition Wave | Candidate Dashboard";
  }, []);

  const [activeTab, setActiveTab] = useState<"overview" | "performance" | "ranking">("overview");

  const tabs: { value: typeof activeTab; label: string }[] = [
    { value: "overview", label: "Overview" },
    { value: "performance", label: "Performance" },
    { value: "ranking", label: "Ranking" },
  ];

  return (
    <div className="flex-1 overflow-auto bg-gray-900 min-h-screen">
      <DashboardHeader userName="BCS Candidate" />
      
      {/* {userProfile.is_student ? ( */}
        <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-4 md:p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="text-xl md:text-3xl font-bold text-foreground text-white font-unbounded">Dashboard</h2>
                <p className="text-muted-foreground hidden md:block">
                  Track your progress and improve your performance
                </p>
              </div>
              </div>
            </div>

            <div className='mt-5'>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
              <div className="col-span-12 lg:col-span-8">
                <LiveModelTests />
              </div>
              <div className="col-span-12 lg:col-span-4">
                <QuickStats />
              </div>
            </div>
          </div>
          <div className="mt-5">
            {/* Buttons instead of Tabs */}

            <div className="mt-5 flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-3 py-1 md:px-5 md:py-2 rounded-full text-sm font-medium transition-colors border
              ${activeTab === tab.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "text-gray-300 border-gray-500 hover:bg-gray-700 hover:text-white"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            {activeTab === "overview" && (
              <div className="space-y-6 mt-5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ExamStatusCards />
                    <div className='mt-5'>
                      <RoutineTable />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <WeeklyGoal />
                    <div className='mt-5'>
                      <SocialMediaCards />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "performance" && (
              <div className="space-y-6 mt-5">
                <PerformanceChart />
              </div>
            )}

            {activeTab === "ranking" && (
              <div className="space-y-6 mt-5">
                <RankingSystem />
              </div>
            )}
          </div>
        </div>
        <div className="pb-20"></div>
      </ScrollArea>
    </div>
  );
}
