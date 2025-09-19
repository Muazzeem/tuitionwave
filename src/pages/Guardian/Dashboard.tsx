
import DashboardHeader from '@/components/DashboardHeader';
import StatsCards from '@/components/StatsCards';
import RecentRequests from '@/components/RecentRequests';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import SocialMediaCards from '@/components/SocialMediaCard';
import TutorsList from '@/components/FindTutors/TutorsList';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function GuardianDashboard() {
    const { userProfile } = useAuth();
    useEffect(() => {
        document.title = "Tuition Wave | Guardian Dashboard";
    }, []);
    
    return (
        <div className="flex-1 overflow-auto bg-gray-900 min-h-screen">
            <DashboardHeader userName={userProfile?.first_name || 'Guardian'} />

            <ScrollArea type="always" style={{ height: "calc(100vh - 100px)" }}>
                <div className="p-2">
                    <h2 className="text-xl md:text-3xl font-bold text-foreground text-white font-unbounded">Guardian Dashboard</h2>
                    <p className="text-muted-foreground mb-6">Manage your Guardian profile and requests</p>
                    <StatsCards />

                    <div className="grid grid-cols-1 gap-6 mt-6">
                        <div className='bg-background border-gray-900 rounded-xl p-3'>
                            <RecentRequests />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                        <div className="col-span-12 md:col-span-8">
                            <div className="rounded-2xl bg-background-900 p-2 md:p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 mb-2">
                                    <h2 className="text-md font-bold text-white font-unbounded">Tutors </h2>
                                    <Link to="/guardian/find-tutors">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="bg-transparent border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 transition-colors hover:text-white text-xs"
                                        >
                                            <u>
                                                View All
                                            </u>
                                        </Button>
                                    </Link>
                                </div>
                                <TutorsList />
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <SocialMediaCards />
                        </div>
                    </div>

                </div>
                <div className="pb-20"></div>
            </ScrollArea>
        </div>
    );
}
