import React, { useEffect } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "@/components/StatsCards";
import TopTutors from "@/components/TopTutors";
import RecentRequests from "@/components/RecentRequests";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import SocialMediaCards from "@/components/SocialMediaCard";
import ErrorPage from "@/components/PermissionCard";
import { ShieldX, RefreshCw, UserPlus } from "lucide-react";

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
        {userProfile.is_tutor ? (
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
          <SocialMediaCards />
          </div>
        ) : (
          <ErrorPage
            icon={ShieldX}
            title="Access Denied"
            subtitle="Insufficient Permissions"
            message="You don't have the necessary permissions to access this dashboard.
              To continue, please register as a tutor or contact your administrator."
            primaryAction={{
              label: "Become a Tutor",
              onClick: () => console.log("Navigate to candidate registration"),
              icon: UserPlus,
            }}
            secondaryAction={{
              label: "Try Again",
              onClick: () => window.location.reload(),
              icon: RefreshCw,
            }}
            supportEmail="support@company.com"
          />
        )}
      </ScrollArea>
    </div>
  );
};

export default Dashboard;