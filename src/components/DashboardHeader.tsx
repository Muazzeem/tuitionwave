
import React, { useState } from "react";
import { ChevronDown, User, LogOut, Settings, Menu } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  userName: string;
}

const DashboardHeader: React.FC<HeaderProps> = ({ userName }) => {
  const { userProfile, clearProfile } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleMarkAllNotificationsRead = () => {
    console.log("All notifications marked as read");
    // You can add additional logic here if needed
  };

  const handleLogout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent default navigation
    clearProfile(); // Clear user profile data
    window.location.href = "/";
  };

  return (
    <div className="flex justify-between items-center py-2 px-4 sm:px-6 border-b border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700">
      {/* Left side - Welcome message */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-xl font-bold truncate">
          <span className="hidden sm:inline">Welcome Back, </span>
          <span className="sm:hidden">Hi, </span>
          {userProfile?.first_name}!
        </h1>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        <NotificationDropdown onMarkAllRead={handleMarkAllNotificationsRead} />

        <div className="relative">
          <div
            className="flex items-center gap-1 sm:gap-2 cursor-pointer rounded-lg hover:bg-gray-100 p-1 sm:p-2 dark:hover:bg-gray-700"
            onClick={toggleDropdown}
          >
            {userProfile.user_type === "TEACHER" ? (
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
            ) : (
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gray-300 overflow-hidden">
                <img
                  src={userProfile?.profile_picture}
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <span className="text-xs sm:text-sm font-medium hidden sm:inline">
              {userProfile?.first_name}
            </span>
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <a
                href={`/profile/${userProfile?.user_type?.toLowerCase()}`}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <User className="h-4 w-4 mr-2" />
                <span className="text-gray-700 dark:text-white">Profile</span>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  {userProfile?.user_type?.toLowerCase() === "guardian"
                    ? "Guardian"
                    : "Teacher"}
                </span>
              </a>
              {
                userProfile?.user_type?.toLowerCase() === "teacher" &&
                <a
                  href="/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span className="dark:text-white ">Settings</span>
                </a>
              }
              <hr className="my-1 border-gray-200" />
              <a
                href="#"
                onClick={handleLogout}
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
