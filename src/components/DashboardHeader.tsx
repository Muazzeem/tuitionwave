import React, { useState } from "react";
import { ChevronDown, User, LogOut, Settings, Package, Menu, X } from "lucide-react";
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
  if (segments.includes('job-preparation')) {
    return 'STUDENT';
  }

  return 'GUARDIAN';
};

const DashboardHeader: React.FC<HeaderProps> = ({ userName }) => {
  const { userProfile, clearProfile } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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
    <div className="flex justify-between items-center py-2 px-4 sm:px-6 border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 relative z-20">
      <div className="flex-1 min-w-0">
        {/* <h1 className="text-md sm:text-md font-bold truncate text-gray-900 dark:text-white">
          <span className="hidden sm:inline">Welcome Back, </span>
          <span className="sm:hidden">Hi, </span>
          {userProfile?.first_name}!
        </h1> */}
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 hidden xl:flex items-center gap-3 border p-2 rounded-xl border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <Link
          to="/dashboard/guardian"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            userTypeFromUrl === 'GUARDIAN'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md dark:bg-blue-500 dark:border-blue-500'
              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-blue-400'
          }`}
        >
          Guardian Panel
        </Link>

        <Link
          to="/dashboard/teacher"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            userTypeFromUrl === 'TEACHER'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md dark:bg-blue-500 dark:border-blue-500'
              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-blue-400'
          }`}
        >
          Tutor Panel
        </Link>

        <Link
          to="/job-preparation/dashboard"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            userTypeFromUrl === 'STUDENT'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md dark:bg-blue-500 dark:border-blue-500'
              : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-blue-400'
          }`}
        >
          Candidate Dashboard
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* <ThemeToggle /> */}
        {/* <NotificationDropdown onMarkAllRead={handleMarkAllNotificationsRead} /> */}

        <button
          onClick={toggleMobileMenu}
          className="xl:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="relative">
          <div
            className="flex items-center gap-1 sm:gap-2 cursor-pointer rounded-lg hover:bg-gray-100 p-1 sm:p-2 dark:hover:bg-gray-700"
            onClick={toggleDropdown}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
          >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                <img
                  src={userProfile?.profile_picture || "https://placehold.co/40x40/cccccc/333333?text=U"} // Placeholder if no profile picture
                  alt="User avatar"
                  className="h-full w-full object-cover rounded-full border-2 border-yellow-500 crown-image"
                />
                {userProfile?.is_verified && (
                  <div className="crown-icon absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 text-xs sm:text-sm">
                    👑
                  </div>
                )}
              </div>

            <span className="text-xs sm:text-sm font-medium hidden sm:inline text-gray-900 dark:text-white">
              {userProfile?.first_name}
            </span>
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              { userTypeFromUrl === 'TEACHER' && (
                  <>
                    <Link
                      to={`/teacher/profile/`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-white"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2 dark:text-white" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/teacher/settings/"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-white"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-2 dark:text-white" />
                      <span>Settings</span>
                    </Link>
                    <Link
                      to="/package/teacher"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-white"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Package className="h-4 w-4 mr-2 dark:text-white" />
                      <span>Package</span>
                    </Link>
                  </>
              )}

              <hr className="my-1 border-gray-200 dark:border-gray-600" />
              <Link
                to="#"
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-red-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-95 dark:bg-opacity-95 z-10 flex flex-col items-center justify-center py-8">
          <div className="flex flex-col gap-6">
            <Link
              to="/dashboard/guardian"
              className={`px-6 py-3 rounded-full text-lg font-medium text-center transition-all duration-200 border ${
                userTypeFromUrl === 'GUARDIAN'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md dark:bg-blue-500 dark:border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-blue-400'
              }`}
              onClick={toggleMobileMenu}
            >
              Guardian Panel
            </Link>

            <Link
              to="/dashboard/teacher"
              className={`px-6 py-3 rounded-full text-lg font-medium text-center transition-all duration-200 border ${
                userTypeFromUrl === 'TEACHER'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md dark:bg-blue-500 dark:border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-blue-400'
              }`}
              onClick={toggleMobileMenu}
            >
              Tutor Panel
            </Link>

            <Link
              to="/job-preparation/dashboard"
              className={`px-6 py-3 rounded-full text-lg font-medium text-center transition-all duration-200 border ${
                userTypeFromUrl === 'STUDENT'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md dark:bg-blue-500 dark:border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-blue-400'
              }`}
              onClick={toggleMobileMenu}
            >
              Candidate Dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
