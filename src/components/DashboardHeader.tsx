import React, { useState } from 'react';
import { ChevronDown, User, LogOut, Settings } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

interface HeaderProps {
    userName: string;
}

const DashboardHeader: React.FC<HeaderProps> = ({ userName }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleMarkAllNotificationsRead = () => {
        console.log('All notifications marked as read');
        // You can add additional logic here if needed
    };

    return (
        <div className="flex justify-between items-center py-2 px-6 border-b border-gray-200 bg-white">
            <h1 className="text-xl font-bold">Welcome Back, {userName}!</h1>

            <div className="flex items-center gap-4">
                <NotificationDropdown onMarkAllRead={handleMarkAllNotificationsRead} />

                <div className="relative">
                    <div
                        className="flex items-center gap-2 cursor-pointer rounded-lg hover:bg-gray-100 p-2"
                        onClick={toggleDropdown}
                    >
                        <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
                            <img
                                src="https://randomuser.me/api/portraits/men/43.jpg"
                                alt="User avatar"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <span className="text-sm font-medium">Muazzem Hossain</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                            <a
                                href="/profile"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <User className="h-4 w-4 mr-2" />
                                Profile
                            </a>
                            <a
                                href="/settings"
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </a>
                            <hr className="my-1 border-gray-200" />
                            <a
                                href="/logout"
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;