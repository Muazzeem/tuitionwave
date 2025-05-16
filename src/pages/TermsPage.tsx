
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">Terms & Conditions</h1>
          
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">1. Acceptance of Terms</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                By accessing or using the Tuitionwave platform, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
              </p>
              
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">2. Platform Description</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Tuitionwave is a platform that connects tutors with students or guardians seeking educational services. We do not employ tutors directly but provide a service to facilitate these connections.
              </p>
              
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">3. User Accounts</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Users must create an account to access certain features of our platform. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. Users must provide accurate, current, and complete information during the registration process.
              </p>
              
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">4. Tutor Verification</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                While we make efforts to verify tutor credentials, we cannot guarantee the accuracy of all information provided by tutors. Users are encouraged to conduct their own verification as necessary.
              </p>
              
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">5. Services and Fees</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Tuitionwave charges service fees for connecting tutors with students. These fees are clearly displayed before any transaction is completed. Payment arrangements between tutors and students are managed independently and not through our platform.
              </p>
              
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">6. Privacy Policy</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Our Privacy Policy, available on our website, explains how we collect, use, and protect your personal information. By using our services, you agree to our data practices as described in this policy.
              </p>
              
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">7. User Content</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Users may post content such as profiles, reviews, and messages. You retain all rights to your content, but grant us a license to use, modify, display, and distribute it on our platform. Content must not be illegal, misleading, or infringe on others' rights.
              </p>
              
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">8. Limitation of Liability</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Tuitionwave is not liable for any disputes arising between users, the quality of tutoring services, or any losses resulting from using our platform. Our liability is limited to the amount paid by the user for our services.
              </p>
              
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">9. Termination</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                We reserve the right to terminate or suspend user accounts for violations of these Terms & Conditions or for any other reason at our discretion. Users may terminate their accounts at any time.
              </p>
              
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">10. Changes to Terms</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Tuitionwave may modify these Terms & Conditions at any time. Continued use of the platform after changes constitutes acceptance of the updated terms.
              </p>
              
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">11. Governing Law</h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                These Terms & Conditions are governed by the laws of Bangladesh. Any disputes will be subject to the exclusive jurisdiction of the courts in Bangladesh.
              </p>
              
              <p className="mt-8 text-gray-600 dark:text-gray-300">
                Last updated: May 16, 2025
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
