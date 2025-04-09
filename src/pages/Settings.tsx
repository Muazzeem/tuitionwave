import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';

const Settings: React.FC = () => {
    return (
        <div className="flex-1 overflow-auto">
            <DashboardHeader userName="John" />

            <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Settings</h2>
                <p>This is the Settings page. You can configure your account settings here.</p>
            </div>
        </div>
    );
};

export default Settings;