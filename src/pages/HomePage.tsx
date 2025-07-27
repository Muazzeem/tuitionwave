
import React from 'react';
import Header from '@/components/Header';
import BCSJobPreparation from '@/components/BCSJobPreparation';
import SearchSection from '@/components/SearchSection';
import TutorSearchResults from '@/components/TutorSearchResults';
import RecommendedTutors from '@/components/RecommendedTutors';
import MobileAppDownload from '@/components/MobileAppDownload';
import Footer from '@/components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Header />
      <BCSJobPreparation />
      <SearchSection />
      <TutorSearchResults />
      <RecommendedTutors />
      <hr className="border-gray-200 dark:border-gray-700" />
      <MobileAppDownload />
      <Footer />
    </div>
  );
};

export default HomePage;
