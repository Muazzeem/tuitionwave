import React from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "@/components/StatsCards";
import TopTutors from "@/components/TopTutors";
import RecentRequests from "@/components/RecentRequests";
import NIDUpload from "@/components/Registration/NIDUpload";
import { useAuth } from "@/contexts/AuthContext";
import ProfileCompletionAlert from "@/components/ProfileCompletionAlert";
import { useProfileCompletion } from "@/components/ProfileCompletionContext";
import PricingCards from "@/components/PricingCards";
import { ScrollArea } from "@/components/ui/scroll-area";

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const { completionData } = useProfileCompletion();

  return (
    <div className="flex-1 overflow-auto dark:bg-gray-900">
      <DashboardHeader userName="John" />

      <ScrollArea type="always" style={{ height: 800 }}>

      {userProfile?.user_type === "TEACHER" && completionData.completion_percentage < 50 && (
        <div className="p-6">
          <ProfileCompletionAlert />
        </div>
      )}

      {userProfile?.user_type === "TEACHER" && !userProfile?.is_verified && userProfile?.has_nid &&(
        <PricingCards />
      )}

      {!userProfile?.has_nid && (
        <NIDUpload />
      )}

      {completionData.completion_percentage >= 50 && userProfile?.is_verified && userProfile?.has_nid && (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6 dark:text-white">Dashboard</h2>

          <StatsCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-3">
              <RecentRequests />
            </div>
            <div>
              {/* <TopTutors /> */}
            </div>
          </div>
        </div>
      )}
      </ScrollArea>
    </div>
  );
};

export default Dashboard;