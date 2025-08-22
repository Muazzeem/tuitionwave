
import React from 'react';
import Header from '@/components/Header';
import BCSJobPreparation from '@/components/BCSJobPreparation';
import SearchSection from '@/components/SearchSection';
import TutorSearchResults from '@/components/TutorSearchResults';
import MobileAppDownload from '@/components/MobileAppDownload';
import Footer from '@/components/Footer';
import { ScrollArea } from '@/components/ui/scroll-area';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Header />
      <ScrollArea type="always" style={{ height: 'calc(100vh - 80px)' }}>
        <BCSJobPreparation />
        <SearchSection />
        <TutorSearchResults />
        {/* <RecommendedTutors /> */}
        <hr className="border-gray-200 dark:border-gray-700" />
        <MobileAppDownload />
        <Footer />
      </ScrollArea>
    </div>
  );
};

export default HomePage;
