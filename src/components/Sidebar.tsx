
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = () => {
    const { userProfile, clearProfile } = useAuth();
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(false);

    const userType = userProfile?.user_type?.toLowerCase() === 'teacher' ? 'teacher' : 'guardian';
    
    const menuItems = [
        { icon: Home, text: 'Dashboard', path: `/${userType}/dashboard` },
        ...(userType !== 'teacher' ? [{ icon: Search, text: 'Find Tutor', path: '/find-tutors' }] : []), // Hide for teachers
        { icon: User, text: 'Contract Requests', path: `/${userType}/requests` },
        { icon: MessageSquare, text: 'Message', path: '/message' },
        { icon: User, text: 'Profile', path: `/profile/${userType}` },
    ];

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };
    
    const handleLogout = () => {
        clearProfile();
        window.location.href = "/";
    };

    return (
        <div className={`${isExpanded ? 'w-50' : 'w-13'} bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen transition-all duration-500 relative z-10`}>
            <div className="p-3 flex justify-between items-center align-middle">
                {isExpanded && <h1 className="text-xl font-bold mt-2 dark:text-white">
                    <Link to="/" className="flex items-center">
                    Tuition Wave
                    </Link>
                    </h1>}
                <button
                    onClick={toggleSidebar}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hidden md:block lg:block"
                >
                    {isExpanded ? 
                        <ChevronLeft size={18} className="text-gray-700 dark:text-gray-300" /> : 
                        <ChevronRight size={18} className="text-gray-700 dark:text-gray-300" />
                    }
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
                        const IconComponent = item.icon;

                        return (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-1 lg:px-4 md:px-4 py-2 text-sm ${isActive
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                                        } ${!isExpanded && 'justify-center'}`}
                                    title={!isExpanded ? item.text : ""}
                                >
                                    <IconComponent size={18} className={isExpanded ? "mr-2" : ""} />
                                    {isExpanded && <span>{item.text}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button 
                    onClick={handleLogout}
                    className={`flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full ${!isExpanded && 'justify-center'}`} 
                    title={!isExpanded ? "Logout" : ""}
                >
                    <LogOut size={18} className={isExpanded ? "mr-2" : ""} />
                    {isExpanded && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
