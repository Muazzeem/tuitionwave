
import React from 'react';
import Header from '@/components/Header';
import SearchSection from '@/components/SearchSection';
import TutorDetails from '@/components/TutorDetails';
import Footer from '@/components/Footer';
import { ScrollArea } from '@/components/ui/scroll-area';

const TutorProfile: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* <SearchSection /> */}
      <main>
         <ScrollArea type="always" style={{ height: 900 }}>
            <TutorDetails />
            <Footer />
        </ScrollArea>
      </main>
    </div>
  );
};

export default TutorProfile;
