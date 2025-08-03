
import DashboardHeader from '@/components/DashboardHeader';
import StatsCards from '@/components/StatsCards';
import RecentRequests from '@/components/RecentRequests';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function GuardianDashboard() {
    const { userProfile } = useAuth();
    useEffect(() => {
        document.title = "Tuition Wave | Guardian Dashboard";
    }, []);
    
    return (
        <div className="flex-1 overflow-auto dark:bg-gray-900">
            <DashboardHeader userName={userProfile?.first_name || 'Guardian'} />

            <div className="p-6">
                <h2 className="text-3xl font-bold text-foreground">Guardian Dashboard</h2>
                <p className="text-muted-foreground mb-6">Manage your Guardian profile and requests</p>
                <StatsCards />

                <div className="grid grid-cols-1 gap-6 mt-6">
                    <div>
                        <RecentRequests />
                    </div>
                </div>
            </div>
        </div>
    );
}
