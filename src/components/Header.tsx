
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="border-b py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Tuition Wave
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>
          <Link to="/job-preparation" className="text-gray-700 hover:text-blue-600 font-medium">
            Job Preparation
          </Link>
        </nav>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
          Tutor Zone
        </Button>
      </div>
    </header>
  );
};

export default Header;
