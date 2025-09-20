import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, User, LogOut, ChevronLeft, ChevronRight, ScrollText, Landmark, BookOpenCheck, NotebookPen, Package } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const getUserTypeFromUrl = (pathname: string): string | undefined => {
  const segments = pathname.toLowerCase().split('/');
  if (segments.includes('job-preparation')) {
    return 'STUDENT';
  }
  if (segments.includes('teacher')) {
    return 'TEACHER';
  }
  return 'GUARDIAN';
};

const Sidebar = () => {
  const { clearProfile, userProfile } = useAuth();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(true);
  const userTypeFromUrl = getUserTypeFromUrl(location.pathname);

  const guardianItems = [
    { icon: Home, text: 'Dashboard', path: `/dashboard/guardian` },
    { icon: Search, text: 'Find Tutor', path: '/guardian/find-tutors' },
    { icon: ScrollText, text: 'Contracts', path: `/guardian/requests` },
    { icon: MessageSquare, text: 'Message', path: '/guardian/message' },
    { icon: User, text: 'Profile', path: `/guardian/profile/` },
  ];

  const studentMenuItems = [
    { icon: Home, text: 'Dashboard', path: `/job-preparation/dashboard` },
    { icon: BookOpenCheck, text: 'Model Test', path: '/job-preparation/model-test' },
    { icon: Landmark, text: 'Question Bank', path: '/job-preparation/questions' },
    { icon: NotebookPen, text: 'Self Test', path: '/job-preparation/practice' },
    { icon: Package, text: 'Packages', path: '/job-preparation/packages' },
  ];

  const tutorMenuItems = [
    { icon: Home, text: 'Dashboard', path: `/dashboard/teacher` },
    { icon: ScrollText, text: 'Contracts', path: `/teacher/requests` },
    { icon: MessageSquare, text: 'Message', path: '/teacher/message' },
    { icon: User, text: 'Profile', path: `/teacher/profile/` },
    { icon: Package, text: 'Packages', path: '/teacher/packages' },
  ];

  // Check user permissions and determine available menu items
  const getAvailableMenuItems = () => {
    if (userTypeFromUrl === 'STUDENT') {
      return studentMenuItems;
    } else if (userTypeFromUrl === 'TEACHER') {
      return tutorMenuItems;
    } else {
      return guardianItems;
    }
  };

  const currentMenuItems = getAvailableMenuItems();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    clearProfile();
    window.location.href = "/";
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`${isExpanded ? 'w-60' : 'w-13'} border-0 flex-col h-screen transition-all duration-500 relative z-10 hidden md:flex shadow-lg`} style={{ backgroundColor: "#182641" }}>
        <div className="p-3 flex justify-between items-center align-middle">
          {isExpanded && (
            <img
              src="/lovable-uploads/header_logo.png"
              alt="Tutor search background"
              className="w-auto h-10 object-cover opacity-80"
            />
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-800"
          >
            {isExpanded ? (
              <ChevronLeft size={18} className="text-gray-300" />
            ) : (
                <ChevronRight size={18} className="text-gray-300" />
            )}
          </button>
        </div>

        {(
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {currentMenuItems.map((item, index) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
                const IconComponent = item.icon;

                return (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className={`flex items-center h-12 rounded-lg px-1 lg:px-4 md:px-4 py-2 text-sm ${isActive
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-200 hover:bg-primary-600'
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
        )}

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className={`flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 w-full ${!isExpanded && 'justify-center'
              }`}
            title={!isExpanded ? "Logout" : ""}
          >
            <LogOut size={18} className={isExpanded ? "mr-2" : ""} />
            {isExpanded && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50">
        <nav className="flex justify-around items-center py-2">
          {currentMenuItems.slice(0, 4).map((item, index) => {
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path);
            const IconComponent = item.icon;

            return (
              <Link
                key={index}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 text-xs ${isActive
                  ? "bg-primary-500 text-white shadow-md border-gray-900 rounded-xl"
                  : "text-gray-400"
                  }`}
              >
                <IconComponent size={20} />
                <span className="mt-1 truncate">{item.text}</span>
              </Link>
            );
          })}
        </nav>
      </div>

    </>
  );
};

export default Sidebar;
