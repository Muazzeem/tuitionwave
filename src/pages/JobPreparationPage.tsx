
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CalendarClock, BookOpen, Award, Users } from 'lucide-react';

const JobPreparationPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          {/* Coming Soon Banner */}
          <div className="relative overflow-hidden rounded-lg bg-blue-600 dark:bg-blue-700 mb-12">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500 dark:bg-blue-600 opacity-20"></div>
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-500 dark:bg-blue-600 opacity-20"></div>
            
            <div className="relative p-8 md:p-12 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Job Preparation</h1>
              <div className="inline-block bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-full mb-4 animate-pulse">
                Coming Soon!
              </div>
              <p className="text-white text-lg md:text-xl max-w-3xl mx-auto">
                Our comprehensive job preparation service is under development. Soon you'll be able to access resources to help you prepare for interviews, build your resume, and develop essential career skills.
              </p>
            </div>
          </div>
          
          {/* Features Preview */}
          <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800 dark:text-white">What to Expect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="text-blue-600 dark:text-blue-400 mr-4">
                  <BookOpen size={36} />
                </div>
                <h3 className="text-xl font-medium text-gray-800 dark:text-white">Interview Preparation</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Access practice questions, mock interviews, and expert tips to help you succeed in job interviews across various industries.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="text-blue-600 dark:text-blue-400 mr-4">
                  <CalendarClock size={36} />
                </div>
                <h3 className="text-xl font-medium text-gray-800 dark:text-white">Career Planning</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Get guidance on career paths, industry trends, and professional development opportunities to plan your career trajectory.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="text-blue-600 dark:text-blue-400 mr-4">
                  <Award size={36} />
                </div>
                <h3 className="text-xl font-medium text-gray-800 dark:text-white">Resume Building</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Learn how to create standout resumes and cover letters that highlight your skills and experience effectively.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="text-blue-600 dark:text-blue-400 mr-4">
                  <Users size={36} />
                </div>
                <h3 className="text-xl font-medium text-gray-800 dark:text-white">Networking Skills</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Develop strategies for building professional relationships, leveraging social media, and expanding your career network.
              </p>
            </div>
          </div>
          
          {/* Newsletter Signup */}
          <div className="mt-16 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Stay Updated</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Sign up to be notified when our Job Preparation services launch. Be the first to access our resources and tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md transition-colors">
                Notify Me
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobPreparationPage;
