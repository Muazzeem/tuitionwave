
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, MapPin, GraduationCap, DollarSign, Users, Calendar, BookOpen } from 'lucide-react';
import { Tutor } from '@/types/tutor';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';

const TutorShareProfile: React.FC = () => {
  const { uid } = useParams();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTutorData = async () => {
      if (!uid) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tutors/${uid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tutor data');
        }
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

  const getTeachingTypeBadge = () => {
    switch (tutor.teaching_type_display) {
      case "ONLINE":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
            🌐 Online
          </Badge>
        );
      case "OFFLINE":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">
            🏠 Home Visit
          </Badge>
        );
      case "BOTH":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
            🌐 Online & Home
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="md:flex">
              {/* Profile Image */}
              <div className="md:w-1/3">
                <div className="aspect-square md:aspect-auto md:h-full relative">
                  <img
                    src={tutor.profile_picture_url || '/placeholder.svg'}
                    alt={tutor.full_name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    {getTeachingTypeBadge()}
                  </div>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="md:w-2/3 p-6 md:p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
                      {tutor.full_name}
                    </h1>
                    
                    {/* University */}
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap className="w-5 h-5 text-blue-500" />
                      <span className="text-blue-600 font-medium">
                        {tutor.institute?.name}
                      </span>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-semibold text-gray-900">
                        {tutor.avg_rating || 0}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      ({tutor.review_count || 0} reviews)
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">
                    {tutor.user?.address}, {tutor.city?.district?.division?.name}
                  </span>
                </div>

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
                      <p className="text-green-600">
                        {tutor.expected_hourly_charge.display_range}/hour
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {tutor.teaching_type_display}
                    </span>
                  </div>
                  {tutor.active_days && tutor.active_days.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {tutor.active_days.length} days/week
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Subjects Section */}
          {tutor.subjects && tutor.subjects.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Teaching Subjects</h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {tutor.subjects.map((subject, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {subject.subject}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Education */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Education</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Degree:</span>
                  <span className="text-gray-900 font-medium">{tutor.degree?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="text-gray-900 font-medium">{tutor.department?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-gray-900 font-medium">{tutor.current_status_display}</span>
                </div>
              </div>
            </div>

            {/* Availability */}
            {tutor.active_days && tutor.active_days.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Availability</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Days:</span>
                    <span className="text-gray-900 font-medium">
                      {tutor.active_days.map(day => day.day).join(', ')}
                    </span>
                  </div>
                  {tutor.preferred_time && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Preferred Time:</span>
                      <span className="text-gray-900 font-medium">{tutor.preferred_time}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-8 mt-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-2">Interested in learning?</h3>
            <p className="mb-4 opacity-90">Contact {tutor.full_name} to start your learning journey</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Get in Touch
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TutorShareProfile;
