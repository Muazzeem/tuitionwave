
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-6">
              <span className="text-2xl font-bold text-blue-600">Tuitionwave</span>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Tuitionwave is a platform where parents, students and tutors can easily connect with each other. We provide qualified Home/Online tutors to help your child with studies and helping them perform better in exams. We are a group of 2,50,000+ Tutors and 30,000+ satisfied parents/students in Dhaka, Chattogram, Rajshahi, Sylhet, Khulna, Barishal, Rangpur, Mymensingh cities for different academic and professional subjects.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Short links</h3>
            <ul className="space-y-2">
              <li><Link to="/features" className="text-gray-600 hover:text-blue-600">Features</Link></li>
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-blue-600">How it works</Link></li>
              <li><Link to="/security" className="text-gray-600 hover:text-blue-600">Security</Link></li>
              <li><Link to="/testimonial" className="text-gray-600 hover:text-blue-600">Testimonial</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Other pages</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="text-gray-600 hover:text-blue-600">Privacy policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-blue-600">Terms & conditions</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-blue-600">FAQ</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <ul className="flex space-x-6">
              <li><Link to="/" className="text-gray-600 hover:text-blue-600">Home</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link></li>
            </ul>
          </div>
          <div className="text-gray-500 text-sm">
            2023 © Tuitionwave. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
