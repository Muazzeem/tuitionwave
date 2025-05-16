
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle } from 'lucide-react';

const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      title: "Create an Account",
      description: "Sign up as a student/guardian or as a tutor. Complete your profile with accurate information to get started."
    },
    {
      title: "Find the Perfect Match",
      description: "Students can search for tutors based on subject, location, rating, and availability. Browse profiles and reviews to find your ideal tutor."
    },
    {
      title: "Send a Tuition Request",
      description: "Once you find a tutor you like, send them a request detailing your learning needs, schedule preferences, and any other requirements."
    },
    {
      title: "Confirm and Connect",
      description: "When the tutor accepts your request, you'll be notified. You can then discuss specifics and arrange your first session."
    },
    {
      title: "Start Learning",
      description: "Begin your learning journey with your tutor. Regular sessions help build understanding and improve academic performance."
    },
    {
      title: "Review and Feedback",
      description: "After sessions, provide feedback to help others and improve the platform experience. Good reviews help great tutors stand out."
    }
  ];

  const features = [
    {
      title: "Verified Tutors",
      description: "All tutors undergo a verification process including document checks and background verification."
    },
    {
      title: "Flexible Learning",
      description: "Choose between online sessions or in-person tutoring based on your preferences and needs."
    },
    {
      title: "Secure Messaging",
      description: "Our platform provides a secure way to communicate with tutors before and during your tutoring contract."
    },
    {
      title: "Transparent Reviews",
      description: "See honest feedback from students who have worked with each tutor to guide your decision."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2 text-center text-gray-800 dark:text-white">How Tuitionwave Works</h1>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Our platform connects qualified tutors with students seeking educational support in a simple, secure, and efficient way.
          </p>
          
          {/* Steps Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800 dark:text-white">Step-by-Step Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((step, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-full h-8 w-8 flex items-center justify-center mr-3">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-medium text-gray-800 dark:text-white">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Features Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center text-gray-800 dark:text-white">Why Choose Tuitionwave</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="mr-4 text-green-500 dark:text-green-400">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="bg-blue-600 dark:bg-blue-700 text-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Join thousands of students who have found the perfect tutor and improved their academic performance on Tuitionwave.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/find-tutors" className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-full font-medium">
                Find a Tutor
              </a>
              <a href="/auth/registration" className="bg-transparent border border-white hover:bg-blue-700 dark:hover:bg-blue-800 px-6 py-3 rounded-full font-medium">
                Sign Up Now
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
