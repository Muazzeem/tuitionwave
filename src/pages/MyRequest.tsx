import DashboardHeader from '@/components/DashboardHeader';
import React from 'react';


const MyRequest: React.FC = () => {
    return (
        <div className="flex-1 overflow-auto">
            <DashboardHeader userName="John" />

            <div className="p-6">
                <h2 className="text-xl font-bold mb-6">My Requests</h2>
                <p>This is the My Requests page. You can see your tuition requests here.</p>
            </div>
        </div>
    );
};

export default MyRequest;