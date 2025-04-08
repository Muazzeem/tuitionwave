
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-6">Welcome to Tuition Wave</h1>
        <p className="text-xl text-gray-600 mb-8">
          Find the perfect tutor to help you achieve your academic goals.
        </p>
        <Link to="/tutor/mamun">
          <Button className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
            View Sample Tutor Profile
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
