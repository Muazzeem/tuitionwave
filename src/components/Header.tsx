import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { userProfile } = useAuth();
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate(`/dashboard`);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="border-b py-4 bg-white dark:bg-gray-900 relative shadow-sm">
      <div className="container mx-auto px-4">
        {/* Desktop and Mobile Top Bar */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <button 
              className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400 flex-shrink-0 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Tuition Wave
            </button>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/">
              <button
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors py-2"
              >
                Home
              </button>
            </Link>
            <Link to="/questions">
              <button
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors py-2"
              >
                Job Preparation
              </button>
            </Link>
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Placeholder */}
            {/* <ThemeToggle /> */}
            
            {userProfile ? (
              <button
                className="bg-primary hover:bg-primary-700 text-white rounded-full px-6 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg border border-gray-900"
                onClick={goToDashboard}
              >
                Go to Dashboard
              </button>
            ) : (
              <Link to="/login">
                <button
                    className="bg-primary hover:bg-primary-700 text-white rounded-full px-6 py-2 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Right Side */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Theme Toggle */}
            {/* <ThemeToggle /> */}
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100 mt-4 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="border-t dark:border-gray-700 pt-4">
            <nav className="flex flex-col space-y-2">
              <Link to="/">
                <button
                  
                  className="text-left text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Home
                </button>
              </Link>
              <Link to="/job-preparation">
                <button
                  className="text-left text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Job Preparation
                </button>
              </Link>
              
              {/* Mobile Auth Button */}
              <div className="pt-4">
                {userProfile ? (
                  <button
                    className="w-full bg-primary-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={goToDashboard}
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <Link to="/login">
                    <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-3 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Login
                    </button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;