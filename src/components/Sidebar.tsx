import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, Settings, User, LogOut } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const menuItems = [
        { icon: Home, text: 'Dashboard', path: '/dashboard' },
        { icon: Search, text: 'Find Tutor', path: '/' },
        { icon: User, text: 'My Request', path: '/my-request' },
        { icon: User, text: 'My Tutor', path: '/my-tutor' },
        { icon: MessageSquare, text: 'Message', path: '/message' },
        { icon: Settings, text: 'Settings', path: '/settings' },
    ];

    return (
        <div className="w-[160px] bg-white border-r border-gray-200 flex flex-col h-screen">
            <div className="p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold">Tuition Wave</h1>
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        const IconComponent = item.icon;

                        return (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center px-4 py-2 text-sm ${isActive
                                        ? 'bg-tuitionwave-blue text-white'
                                        : 'text-gray-700 hover:bg-tuitionwave-lightblue'
                                        }`}
                                >
                                    <IconComponent size={18} className="mr-2" />
                                    <span>{item.text}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full">
                    <LogOut size={18} className="mr-2" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;