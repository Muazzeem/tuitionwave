
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import StatsCards from '@/components/StatsCards';
import RecentRequests from '@/components/RecentRequests';
import { useAuth } from '@/contexts/AuthContext';

export default function GuardianDashboard() {
    const { userProfile } = useAuth();
    
    return (
        <div className="flex-1 overflow-auto">
            <DashboardHeader userName={userProfile?.first_name || 'Guardian'} />

            <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Guardian Dashboard</h2>

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
