
import React from 'react';
import Header from '@/components/Header';
import SearchSection from '@/components/SearchSection';
import TutorSearchResults from '@/components/TutorSearchResults';
import RecommendedTutors from '@/components/RecommendedTutors';
import Footer from '@/components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Header />
      <SearchSection />
      <TutorSearchResults />
      <RecommendedTutors />
      <Footer />
    </div>
  );
};

export default HomePage;
