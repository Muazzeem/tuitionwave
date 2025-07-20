import React, { useState } from "react";
import { ChevronDown, User, LogOut, Settings, Package } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router-dom";

interface HeaderProps {
  userName: string;
}

const getUserTypeFromUrl = (pathname: string): string => {
  const segments = pathname.toLowerCase().split('/');

  if (segments.includes('teacher')) {
    return 'TEACHER';
  }

  return 'GUARDIAN';
};

const DashboardHeader: React.FC<HeaderProps> = ({ userName }) => {
  const { userProfile, clearProfile } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const userTypeFromUrl = getUserTypeFromUrl(location.pathname);

  const handleMarkAllNotificationsRead = () => {
    console.log("All notifications marked as read");
  };

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    clearProfile();
    window.location.href = "/";
  };

  return (
    <div className="flex justify-space-between items-center py-2 px-4 sm:px-6 border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-xl font-bold truncate">
          <span className="hidden sm:inline">Welcome Back, </span>
          <span className="sm:hidden">Hi, </span>
          {userProfile?.first_name}!
        </h1>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-6">
        <Link
          to="/dashboard/guardian"
          className={`text-sm transition-colors duration-200 ${
            userTypeFromUrl === 'GUARDIAN'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
          }`}
        >
          Guardian Panel
        </Link>

        <Link
          to="/dashboard/teacher"
          className={`text-sm transition-colors duration-200 ${
            userTypeFromUrl === 'TEACHER'
              ? 'text-blue-600 dark:text-blue-400 font-bold'
              : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
          }`}
        >
          Tutor Panel
        </Link>

        <Link
          to="/job-preparation"
          className="text-sm text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200"
        >
          Job Preparation
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        {/* <NotificationDropdown onMarkAllRead={handleMarkAllNotificationsRead} /> */}

        <div className="relative">
          <div
            className="flex items-center gap-1 sm:gap-2 cursor-pointer rounded-lg hover:bg-gray-100 p-1 sm:p-2 dark:hover:bg-gray-700"
            onClick={toggleDropdown}
          >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <img
                  src={userProfile?.profile_picture}
                  alt="User avatar"
                  className="h-full w-full object-cover rounded-full border-2 border-yellow-500 crown-image"
                />
                {userProfile.is_verified && (
                  <div className="crown-icon absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm">
                    👑
                  </div>
                )}
              </div>

            <span className="text-xs sm:text-sm font-medium hidden sm:inline">
              {userProfile?.first_name}
            </span>
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">

              { userTypeFromUrl === 'TEACHER' && (
                  <>
                    <Link
                      to={`/teacher/profile/`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      <User className="h-4 w-4 mr-2 dark:text-white" />
                      <span className="text-gray-700 dark:text-white">Profile</span>
                    </Link>
                    <Link to="/teacher/settings/"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      <Settings className="h-4 w-4 mr-2 dark:text-white" />
                      <span className="dark:text-white">Settings</span>
                    </Link>
                    <Link
                      to="/package/teacher"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                      <Package className="h-4 w-4 mr-2 dark:text-white" />
                      <span className="dark:text-white">Package</span>
                    </Link>
                  </>
              )}

              <hr className="my-1 border-gray-200" />
              <Link to="#"
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;