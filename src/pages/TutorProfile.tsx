
import React from 'react';
import Header from '@/components/Header';
import SearchSection from '@/components/SearchSection';
import TutorDetails from '@/components/TutorDetails';
import Footer from '@/components/Footer';

const TutorProfile: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* <SearchSection /> */}
      <main>
        <TutorDetails />
      </main>
      <Footer />
    </div>
  );
};

export default TutorProfile;
