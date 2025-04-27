import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = () => {
    const { userProfile } = useAuth();
    const location = useLocation();
    const [isExpanded, setIsExpanded] = useState(true);

    const userType = userProfile?.user_type?.toLowerCase();

    const menuItems = [
        { icon: Home, text: 'Dashboard', path: '/dashboard' },
        { icon: Search, text: 'Find Tutor', path: '/' },
        { icon: User, text: 'Contract Requests', path: '/requests' },
        { icon: User, text: 'My Tutor', path: '/my-tutor' },
        { icon: MessageSquare, text: 'Message', path: '/message' }
    ];

    const updatedMenuItems = menuItems.map(item => {
        if (['Dashboard', 'Contract Requests'].includes(item.text)) {
          return {
            ...item,
            path: `/${userType}${item.path}`
          };
        }
        return item;
      });

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`${isExpanded ? 'w-56' : 'w-16'} bg-white border-r border-gray-200 flex flex-col h-screen transition-all duration-500 relative`}>
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                {isExpanded && <h1 className="text-xl font-bold">Tuition Wave</h1>}
                <button
                    onClick={toggleSidebar}
                    className="p-1 rounded-full hover:bg-gray-100"
                >
                    {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1">
                    {updatedMenuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        const IconComponent = item.icon;

                        return (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-4 py-2 text-sm ${isActive
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-700 hover:bg-blue-100'
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

            <div className="p-4 border-t border-gray-200">
                <button className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full ${!isExpanded && 'justify-center'}`} title={!isExpanded ? "Logout" : ""}>
                    <LogOut size={18} className={isExpanded ? "mr-2" : ""} />
                    {isExpanded && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;