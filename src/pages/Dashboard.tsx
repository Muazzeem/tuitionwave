import React, { useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "@/components/StatsCards";
import TopTutors from "@/components/TopTutors";
import RecentRequests from "@/components/RecentRequests";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";


const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();

  useEffect(() => {
    document.title = "Tuition Wave | Tutor Dashboard";
  }, []);

  useEffect(() => {
    console.log(userProfile);
  }, [userProfile]);
  
  return (
    <div className="flex-1 overflow-auto dark:bg-gray-900">
      <DashboardHeader userName="John" />

      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-6">
          <h2 className="text-3xl font-bold text-foreground">Tutor Dashboard</h2>
          <p className="text-muted-foreground mb-6">Manage your tutor profile and requests</p>

          <StatsCards />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            <div className="lg:col-span-8">
              <RecentRequests />
            </div>
            <div className="lg:col-span-4">
              <TopTutors />
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Dashboard;