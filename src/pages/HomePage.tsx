
import React from 'react';
import Header from '@/components/Header';
import SearchSection from '@/components/SearchSection';
import BCSJobPreparation from '@/components/BCSJobPreparation';
import TutorSearchResults from '@/components/TutorSearchResults';
import RecommendedTutors from '@/components/RecommendedTutors';
import MobileAppDownload from '@/components/MobileAppDownload';
import Footer from '@/components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Header />
      <SearchSection />
      <BCSJobPreparation />
      <TutorSearchResults />
      <RecommendedTutors />
      <MobileAppDownload />
      <Footer />
    </div>
  );
};

export default HomePage;
