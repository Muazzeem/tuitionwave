import React from 'react';
import { Bell } from 'lucide-react';

interface HeaderProps {
    userName: string;
}

const DashboardHeader: React.FC<HeaderProps> = ({ userName }) => {
    return (
        <div className="flex justify-between items-center py-4 px-6 border-b border-gray-200 bg-white">
            <h1 className="text-xl font-bold">Welcome Back, {userName}!</h1>

            <div className="flex items-center gap-4">
                <button className="text-gray-500 hover:text-gray-700">
                    <Bell size={20} />
                </button>

                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
                        <img
                            src="https://randomuser.me/api/portraits/men/43.jpg"
                            alt="User avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <span className="text-sm font-medium">Guardian Name</span>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;