import React from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "@/components/StatsCards";
import TopTutors from "@/components/TopTutors";
import RecentRequests from "@/components/RecentRequests";
import TutorIDUpload from "@/components/Registration/TutorIDUpload";
import { useAuth } from "@/contexts/AuthContext";
import PricingCards from "@/components/PricingCards";
import { ScrollArea } from "@/components/ui/scroll-area";

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();

  return (
    <div className="flex-1 overflow-auto dark:bg-gray-900">
      <DashboardHeader userName="John" />

      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>

      {userProfile?.user_type === "TEACHER" && !userProfile?.is_verified && userProfile?.has_document &&(
        <PricingCards />
      )}

      {!userProfile?.has_document && (
        <TutorIDUpload />
      )}

      {userProfile?.is_verified && userProfile?.has_document && (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 dark:text-white">Dashboard</h2>

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
      )}
      </ScrollArea>
    </div>
  );
};

export default Dashboard;