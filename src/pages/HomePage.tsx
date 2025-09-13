import React from 'react';
import BCSJobPreparation from '@/components/BCSJobPreparation';
import MobileAppDownload from '@/components/MobileAppDownload';
import Footer from '@/components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <BCSJobPreparation />
        <MobileAppDownload />
      <Footer />
    </div>
  );
};

export default HomePage;
