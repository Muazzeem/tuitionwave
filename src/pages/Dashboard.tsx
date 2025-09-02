import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "@/components/StatsCards";
import TopTutors from "@/components/TopTutors";
import RecentRequests from "@/components/RecentRequests";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import SocialMediaCards from "@/components/SocialMediaCard";
import ErrorPage from "@/components/PermissionCard";
import { ShieldX, RefreshCw, UserPlus } from "lucide-react";
import { getAccessToken } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";
import PricingCards from "@/components/PricingCards";
import { Tutor } from "@/types/tutor";
import ProfileCompletionAlert from "@/components/ProfileCompletionAlert";

const Dashboard: React.FC = () => {
  const { userProfile, reloadProfile } = useAuth();
  const [tutor, setTutor] = useState<Tutor>();
  const accessToken = getAccessToken();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Tuition Wave | Tutor Dashboard";
  }, []);

  function requestAsTuror() {
    const url = `${import.meta.env.VITE_API_URL}/api/users/become-a-tutor/`;

    fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        is_tutor: true,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.detail || "Failed to become a tutor");
        }
        return response.json();
      })
      .then((data) => {
        toast({
          title: "Success",
          description: data.message,
        });
        reloadProfile();
      })
      .catch((error) => {
        console.error("Error becoming tutor:", error.message);
      });
  }

  function fetchTutorInfo() {
    fetch(`${import.meta.env.VITE_API_URL}/api/tutors/my-profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTutor(data);
        console.log(data)
      })
      .catch((error) => console.error("Error fetching tutor info:", error));
  }

  useEffect(() => {
    fetchTutorInfo();
  }, []);

  return (
    <div className="flex-1 overflow-auto dark:bg-gray-900">
      <DashboardHeader userName="John" />

      <ScrollArea type="always" style={{ height: "calc(100vh - 100px)" }}>
        {userProfile.is_tutor ? (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-foreground">Tutor Dashboard</h2>
            <p className="text-muted-foreground mb-6">
              Manage your tutor profile and requests
            </p>

            <div className="mb-4 sm:mb-6">
              <ProfileCompletionAlert />
            </div>

            {tutor && tutor.package ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                <StatsCards />
                <div className="lg:col-span-8">
                  <RecentRequests />
                </div>
                <div className="lg:col-span-4">
                  <TopTutors />
                </div>
              </div>
            ) : (
              <PricingCards />
            )}

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
              onClick: () => {
                requestAsTuror();
              },
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