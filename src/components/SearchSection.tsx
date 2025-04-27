
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const SearchSection: React.FC = () => {
  return (
    <div className="search-section text-white py-16 md:py-24 relative">
      <div className="absolute inset-0 bg-blue-900 z-0">
        <img
          src="/lovable-uploads/cover-image.jpg"
          alt="Tutor helping student"
          className="w-full h-full object-cover opacity-40 mix-blend-overlay"
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">QUICK SEARCH FOR TUTORS</h1>
          <p className="text-xl">FIND A RIGHT TUTOR IN YOUR AREA.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-gray-800 font-medium text-lg mb-4">SEARCH TUTOR</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Institution</label>
              <Input
                placeholder="Dhaka University"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">City</label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                <option>Dhaka</option>
                <option>Chittagong</option>
                <option>Sylhet</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Subject</label>
              <select className="w-full h-10 px-3 rounded-md border border-input bg-background">
                <option>English</option>
                <option>Mathematics</option>
                <option>Science</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="gender" className="h-4 w-4" />
                <span className="text-gray-600">Male</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="gender" className="h-4 w-4" />
                <span className="text-gray-600">Female</span>
              </label>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700">
              SEARCH TUTOR
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
