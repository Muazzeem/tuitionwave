import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, MessageSquare, User, LogOut, ChevronLeft, ChevronRight, ScrollText, Landmark, BookOpenCheck, NotebookPen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const getUserTypeFromUrl = (pathname: string): string | undefined => {
  const { userProfile } = useAuth();
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
    { icon: BookOpenCheck, text: 'Model Test', path: '/job-preparation/create-model-test' },
    { icon: Landmark, text: 'Question Bank', path: '/job-preparation/questions' },
    { icon: NotebookPen, text: 'Self Test', path: '/job-preparation/practice' }
  ];

  const tutorMenuItems = [
    { icon: Home, text: 'Dashboard', path: `/dashboard/teacher` },
    { icon: ScrollText, text: 'Contracts', path: `/teacher/requests` },
    { icon: MessageSquare, text: 'Message', path: '/teacher/message' },
    { icon: User, text: 'Profile', path: `/teacher/profile/` },
  ];

  // Check user permissions and determine available menu items
  const getAvailableMenuItems = () => {
    if (userTypeFromUrl === 'STUDENT') {
      // Check if user has student permissions
      if (userProfile?.is_student === false) {
        return []; // Return empty array if no student permissions
      }
      return studentMenuItems;
    } else if (userTypeFromUrl === 'TEACHER') {
      // Check if user has tutor permissions
      if (userProfile?.is_tutor === false) {
        return []; // Return empty array if no tutor permissions
      }
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

  // Render permission denied message if no menu items are available
  const renderPermissionDenied = () => (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-4">
          <User className="mx-auto h-12 w-12 text-gray-400" />
        </div>
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2">
          Access Restricted
        </h4>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`${isExpanded ? 'w-60' : 'w-13'} bg-white dark:bg-background border-r border-gray-900 dark:border-gray-900 flex-col h-screen transition-all duration-500 relative z-10 hidden md:flex shadow-lg`}>
        <div className="p-3 flex justify-between items-center align-middle">
          {isExpanded && (
            <h1 className="text-xl font-bold mt-2 dark:text-white">
              <Link to="/" className="flex items-center">
                Tuition Wave
              </Link>
            </h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isExpanded ? (
              <ChevronLeft size={18} className="text-gray-700 dark:text-gray-300" />
            ) : (
              <ChevronRight size={18} className="text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {currentMenuItems.length === 0 ? renderPermissionDenied() : (
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {currentMenuItems.map((item, index) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
                const IconComponent = item.icon;

                return (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-1 lg:px-4 md:px-4 py-2 text-sm ${isActive
                        ? 'bg-primary-500 text-white'
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
        )}

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className={`flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full ${!isExpanded && 'justify-center'
              }`}
            title={!isExpanded ? "Logout" : ""}
          >
            <LogOut size={18} className={isExpanded ? "mr-2" : ""} />
            {isExpanded && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
        {currentMenuItems.length === 0 ? (
          <div className="flex justify-center items-center py-4">
            <p className="text-xs text-gray-600 dark:text-gray-400">Access Restricted</p>
          </div>
        ) : (
            <nav className="flex justify-around items-center py-2">
              {currentMenuItems.slice(0, 4).map((item, index) => {
                const isActive = location.pathname === item.path || location.pathname.startsWith(item.path);
                const IconComponent = item.icon;

                return (
                  <Link
                    key={index}
                    to={item.path}
                    className={`flex flex-col items-center py-2 px-3 text-xs ${isActive ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'
                      }`}
                  >
                    <IconComponent size={20} />
                    <span className="mt-1">{item.text}</span>
                  </Link>
                );
              })}
            </nav>
        )}
      </div>
    </>
  );
};

export default Sidebar;
