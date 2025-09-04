import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/DashboardHeader";
import StatsCards from "@/components/StatsCards";
import TopTutors from "@/components/TopTutors";
import RecentRequests from "@/components/RecentRequests";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import SocialMediaCards from "@/components/SocialMediaCard";
import { ShieldX, RefreshCw, UserPlus } from "lucide-react";
import { getAccessToken } from "@/utils/auth";
import { useToast } from "@/hooks/use-toast";
import PricingCards from "@/components/PricingCards";
import { Tutor } from "@/types/tutor";
import ProfileCompletionAlert from "@/components/ProfileCompletionAlert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  const { userProfile, reloadProfile } = useAuth();
  const [tutor, setTutor] = useState<Tutor>();
  const accessToken = getAccessToken();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Tuition Wave | Tutor Dashboard";
  }, []);

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
    <div className="flex-1 overflow-auto bg-gray-900">
      <DashboardHeader userName="John" />

      <ScrollArea type="always" style={{ height: "calc(100vh - 100px)" }}>
        {tutor && userProfile.is_tutor && (
          <div className="p-4 sm:p-6">
            <h2 className="text-3xl font-bold text-foreground text-white">Tutor Dashboard</h2>
            <p className="text-muted-foreground mb-6">
              Manage your tutor profile and requests
            </p>

            <div className="mb-4 sm:mb-6">
              <ProfileCompletionAlert />
            </div>

            {tutor && tutor.package ? (
              <>
                <StatsCards />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                  <div className="lg:col-span-8">
                    <RecentRequests />
                  </div>
                  <div className="lg:col-span-4">
                    <TopTutors />
                  </div>
                </div>
              </>
            ) : (
              <PricingCards />
            )}

            <SocialMediaCards />
          </div>
        )}
        {userProfile && !userProfile.is_tutor && (
          <div className="p-4 sm:p-6">
            <h2 className="text-3xl font-bold text-foreground text-white">Tutor Dashboard</h2>
            <p className="text-muted-foreground mb-6">
              Manage your tutor profile and requests
            </p>
            <div
              className={`bg-red-50 border-l-4 border-red-500 text-red p-3 md:p-4 mb-4 md:mb-6`}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6 mr-2 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M10 7a1 1 0 011 1v3a1 1 0 11-2 0V8a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M10 14a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <h3 className="font-bold text-red text-base sm:text-lg md:text-xl leading-tight">
                    Complete your tutor profile & unlock your potential!
                  </h3>
                </div>
                <div className="text-left sm:text-right font-bold text-sm sm:text-base md:text-lg flex-shrink-0">
                  10% Complete
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mb-3">
                <div
                  className={`bg-red-600 h-2 sm:h-2.5 rounded-full transition-all duration-300`}
                  style={{ width: `10%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 text-gray-400">
                <div>
                  <p className="mb-2 text-sm sm:text-base leading-relaxed">
                    Showcase your expertise, attract more students, and stand out by finishing your profile setup!
                  </p>
                </div>
                <div>
                  <Link to="/teacher/profile">
                    <Button
                      className="bg-cyan-700 hover:bg-cyan-800 text-white px-6 py-2 rounded-full text-sm font-medium border-0"
                    >
                      Complete Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <PricingCards />

            <SocialMediaCards />
          </div>

        )}
        <div className="pb-20"></div>
      </ScrollArea>
    </div>
  );
};

export default Dashboard;