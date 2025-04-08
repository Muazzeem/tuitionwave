
import React from 'react';
import Header from '@/components/Header';
import SearchSection from '@/components/SearchSection';
import TutorDetails from '@/components/TutorDetails';
import ReviewSection from '@/components/ReviewSection';
import Footer from '@/components/Footer';

const TutorProfile: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SearchSection />
      <main>
        <TutorDetails />
        <ReviewSection />
      </main>
      <Footer />
    </div>
  );
};

export default TutorProfile;
