import React from 'react';
import { Helmet } from 'react-helmet-async';
import BCSJobPreparation from '@/components/BCSJobPreparation';
import MobileAppDownload from '@/components/MobileAppDownload';
import Footer from '@/components/Footer';

const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Tuition Wave - Find Expert Tutors & Excel in Job Preparation</title>
        <meta name="description" content="Bangladesh's leading platform for finding qualified tutors and comprehensive job preparation including BCS, Bank, Medical, and University admission tests." />
        <meta name="keywords" content="tutors Bangladesh, home tutor, job preparation, BCS preparation, bank job, medical admission, university admission" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:title" content="Tuition Wave - Find Expert Tutors & Excel in Job Preparation" />
        <meta property="og:description" content="Bangladesh's leading platform for finding qualified tutors and comprehensive job preparation including BCS, Bank, Medical, and University admission tests." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tuitionwave.com" />
        <meta property="og:image" content="https://tuitionwave.com/lovable-uploads/cover-image.jpg" />
        <meta property="og:image:alt" content="Tuition Wave - Premium Tutoring and Job Preparation Platform" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Tuition Wave" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tuition Wave - Find Expert Tutors & Excel in Job Preparation" />
        <meta name="twitter:description" content="Bangladesh's leading platform for finding qualified tutors and comprehensive job preparation including BCS, Bank, Medical, and University admission tests." />
        <meta name="twitter:image" content="https://tuitionwave.com/lovable-uploads/cover-image.jpg" />
        <meta name="twitter:image:alt" content="Tuition Wave - Premium Tutoring and Job Preparation Platform" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Tuition Wave" />
        <link rel="canonical" href="https://tuitionwave.com" />
        <script type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Tuition Wave",
            "url": "https://tuitionwave.com",
            "description": "Bangladesh's leading platform for finding qualified tutors and comprehensive job preparation",
            "sameAs": [
              "https://facebook.com/tuitionwave",
              "https://instagram.com/tuitionwave"
            ],
            "service": [
              {
                "@type": "Service",
                "name": "Home Tutoring",
                "description": "Connect with qualified tutors for personalized home education"
              },
              {
                "@type": "Service", 
                "name": "Job Preparation",
                "description": "Comprehensive preparation for BCS, Bank, Medical and University admission tests"
              }
            ]
          }`}
        </script>
      </Helmet>
      <div className="min-h-screen flex flex-col bg-gray-900">
      <BCSJobPreparation />
        <MobileAppDownload />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
