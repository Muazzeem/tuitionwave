import React from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "@/components/StatsCards";
import TopTutors from "@/components/TopTutors";
import RecentRequests from "@/components/RecentRequests";
import NIDUpload from "@/components/Registration/NIDUpload";
import { useAuth } from "@/contexts/AuthContext";
import ProfileCompletionAlert from "@/components/ProfileCompletionAlert";

import { useProfileCompletion } from "@/components/ProfileCompletionContext";

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const { completionData, loading, error } = useProfileCompletion();

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader userName="John" />

      {userProfile?.user_type === "TEACHER" && (
        <div className="p-6">
          <ProfileCompletionAlert />
        </div>
      )}

      {completionData.completion_percentage >= 80 && (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>

          <StatsCards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <RecentRequests />
            </div>
            <div>
              <TopTutors />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
