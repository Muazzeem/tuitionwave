
import DashboardHeader from '@/components/DashboardHeader';
import StatsCards from '@/components/StatsCards';
import RecentRequests from '@/components/RecentRequests';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import SocialMediaCards from '@/components/SocialMediaCard';

export default function GuardianDashboard() {
    const { userProfile } = useAuth();
    useEffect(() => {
        document.title = "Tuition Wave | Guardian Dashboard";
    }, []);
    
    return (
        <div className="flex-1 overflow-auto bg-gray-900 min-h-screen">
            <DashboardHeader userName={userProfile?.first_name || 'Guardian'} />

            <ScrollArea type="always" style={{ height: "calc(100vh - 100px)" }}>
                <div className="p-6">
                    <h2 className="text-3xl font-bold text-foreground text-white">Guardian Dashboard</h2>
                    <p className="text-muted-foreground mb-6">Manage your Guardian profile and requests</p>
                    <StatsCards />

                    <div className="grid grid-cols-1 gap-6 mt-6">
                        <div>
                            <RecentRequests />
                        </div>
                    </div>
                    <SocialMediaCards />
                </div>
                <div className="pb-20"></div>
            </ScrollArea>
        </div>
    );
}
