
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, GraduationCap, DollarSign, Users, Calendar, Share2, Link2, Facebook, Twitter, MessageCircle } from 'lucide-react';
import { Tutor } from '@/types/tutor';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';

import { Helmet, HelmetProvider } from 'react-helmet-async';



const TutorShareProfile: React.FC = () => {
  const { uid } = useParams();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTutorData = async () => {
      if (!uid) return;
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tutors/${uid}`);
        if (!response.ok) throw new Error('Failed to fetch tutor data');
        const data = await response.json();
        setTutor(data);
      } catch (err) {
        setError('Unable to load tutor profile');
        console.error('Error fetching tutor:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTutorData();
  }, [uid]);

  const getTeachingTypeBadge = () => {
    switch (tutor?.teaching_type_display) {
      case "ONLINE":
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">🌐 Online</Badge>;
      case "OFFLINE":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">🏠 Home Visit</Badge>;
      case "BOTH":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">🌐 Online & Home</Badge>;
      default:
        return null;
    }
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const tutorName = typeof tutor?.full_name === 'string' ? tutor.full_name : 'Professional Tutor';
    const title = encodeURIComponent(`${tutorName} - Professional Tutor`);
    const description = encodeURIComponent(
      `${tutorName} from ${tutor?.institute?.name}. ${tutor?.teaching_type_display} tutoring available. Rating: ${tutor?.avg_rating || 'New'}/5. ${tutor?.expected_salary?.display_range || 'Contact for pricing'}/month.`
    );

    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${title}%20${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  // Generate enhanced meta tags for social sharing
  const generateMetaTags = () => {
    if (!tutor) return null;
    const tutorName = typeof tutor.full_name === 'string' ? tutor.full_name : 'Professional Tutor';
    const title = `${tutorName} | Tuition Wave`;
    const instituteName = tutor.institute?.name || 'Educational Institution';
    const salaryRange = tutor.expected_salary?.display_range || 'Contact for pricing';
    const description = `Connect with ${tutorName}, a professional tutor from ${instituteName}. Offering ${tutor.teaching_type_display} tutoring services. Rating: ${tutor.avg_rating || 'New'}/5 stars. Monthly fee: ${salaryRange}. Book now for quality education!`;
    
    const location = tutor.upazila?.[0]
      ? `${tutor.upazila[0].name}, ${tutor.upazila[0].district.name}`
      : 'Available nationwide';

    return (
      <div>
        <HelmetProvider>
          <Helmet>
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={`tutor, ${tutorName}, ${instituteName}, ${location}, online tutoring, home tutoring, education, teaching`} />
            <link rel="canonical" href="https://www.tacobell.com/" />
          </Helmet>
        </HelmetProvider>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tutor profile...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-4">{error || 'The tutor profile you are looking for does not exist.'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const tutorName = typeof tutor.full_name === 'string' ? tutor.full_name : 'Professional Tutor';

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {generateMetaTags()}
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Share Actions */}
          <div className="mb-6 flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => handleShare('facebook')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Facebook className="w-4 h-4" />
              Facebook
            </button>

            <button
              onClick={() => handleShare('twitter')}
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </button>

            <button
              onClick={() => handleShare('whatsapp')}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>

            <button
              onClick={() => handleShare('linkedin')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors"
            >
              <Share2 className="w-4 h-4" />
              LinkedIn
            </button>
          </div>

          {/* Profile Card */}
          <div ref={cardRef} className="border border-primary-800 rounded-xl p-5 shadow-xl overflow-hidden mb-4 dark:bg-background">
            <div className="md:flex">
              {/* Profile Image */}
              <div className="md:w-1/3">
                <div className="aspect-square md:aspect-auto md:h-full relative">
                  <img
                    src={tutor.profile_picture}
                    alt={`${tutorName} - Professional Tutor`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">{getTeachingTypeBadge()}</div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="md:w-2/3 p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-100 mb-2 capitalize">{tutorName}</h1>
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap className="w-5 h-5 text-blue-500" />
                      <span className="text-blue-600 font-medium">{tutor.institute?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold text-gray-900">{tutor.avg_rating || 0}</span>
                    </div>
                    <span className="text-gray-100 text-sm">({tutor.review_count || 0} reviews)</span>
                  </div>
                </div>

                {/* Location */}
                {tutor.upazila && tutor.upazila.length > 0 ? (
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-100">
                      {tutor.upazila[0].name}, {tutor.upazila[0].district.name}, {tutor.upazila[0].district.division.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">Not specified</span>
                  </div>
                )}

                {/* Pricing */}
                <div className="bg-green-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900">Pricing</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-green-700 font-bold text-lg">
                      {tutor.expected_salary?.display_range || 'Contact for pricing'}/month
                    </p>
                    {tutor.expected_hourly_charge?.display_range && (
                      <p className="text-green-600">{tutor.expected_hourly_charge.display_range}/hour</p>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-100">{tutor.teaching_type_display}</span>
                  </div>
                  {tutor.active_days && tutor.active_days.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-100">{tutor.active_days.length} days/week</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TutorShareProfile;
