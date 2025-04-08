
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="mb-6 flex items-center">
              <span className="text-blue-600 font-bold mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                  <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
                  <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
                </svg>
              </span>
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
              <li><Link to="/404" className="text-gray-600 hover:text-blue-600">404</Link></li>
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
