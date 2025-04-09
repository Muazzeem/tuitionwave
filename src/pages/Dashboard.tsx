
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import StatsCards from '@/components/StatsCards';
import TopTutors from '@/components/TopTutors';
import RecentRequests from '@/components/RecentRequests';

const Dashboard: React.FC = () => {
    return (
        <div className="flex-1 overflow-auto">
            <DashboardHeader userName="John" />

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
        </div>
    );
};

export default Dashboard;