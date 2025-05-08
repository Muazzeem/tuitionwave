
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "./ThemeToggle";

const Header: React.FC = () => {
  const { userProfile, clearProfile } = useAuth();

  return (
    <header className="border-b py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Tuition Wave
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium"
          >
            Home
          </Link>
          <Link
            to="/job-preparation"
            className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium"
          >
            Job Preparation
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {userProfile ? (
            <Button
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6"
              onClick={() => {
                clearProfile();
              }}
            >
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
