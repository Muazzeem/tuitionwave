import React, { useState, useEffect } from "react";
import { Star, MapPin, Clock, BookOpen, GraduationCap, Users, FileText, Lock, AlertCircle, ArrowLeft, User, ShieldAlert } from "lucide-react";
import { useParams } from "react-router-dom";
import ReviewSection from "./ReviewSection";
import { getAccessToken } from "@/utils/auth";

const TutorDetails: React.FC = () => {
  const accessToken = getAccessToken();
  const [loading, setLoading] = useState<boolean>(true);
  const [tutor, setTutor] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    if (id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/tutors/private-profile/?uid=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setTutor(data);
          console.log(data);
          setError(data.error);
        })
        .catch((error) => console.error("Error fetching tutor details:", error))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading tutor details...</p>
        </div>
      </div>
    );
  }

  // Error state - Enhanced UI
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-400 to-red-500 px-8 py-6">
              <div className="flex items-center gap-4 text-white">
                <div className="p-3 bg-white/20 rounded-full">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Access Restricted</h1>
                  <p className="text-orange-100 mt-1">Unable to view tutor profile</p>
                </div>
              </div>
            </div>

            {/* Error Content */}
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle className="w-12 h-12 text-orange-500" />
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Contract Required
                </h2>
                
                <p className="text-gray-500 text-lg mb-2">
                  {error}
                </p>
              </div>

              {/* Available Actions */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  What you can do:
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">Browse Public Profile</p>
                      <p className="text-sm text-gray-600">View basic information and teaching subjects</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">Send Contract Request</p>
                      <p className="text-sm text-gray-600">Request to connect with this tutor</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium text-gray-900">Find Similar Tutors</p>
                      <p className="text-sm text-gray-600">Explore other tutors in your area</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.history.back()}
                  className="flex items-center justify-center gap-2 px-10 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No tutor data
  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tutor Not Found</h2>
          <p className="text-gray-600 mb-6">The tutor you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Format birth date nicely
  const birthDate = new Date(tutor.birth_date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const InfoCard = ({ icon: Icon, title, children, className = "" }) => (
    <div className={`bg-white dark:bg-gray-900 dark:border-gray-700 rounded-lg p-6 shadow-none border border-gray-100 hover:shadow-sm transition-shadow ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-300">{title}</h3>
      </div>
      <div className="space-y-2 dark:text-gray-300">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value, highlight = false }) => (
    <div className="flex justify-between items-start">
      <span className="text-gray-600 text-sm font-medium dark:text-gray-300">{label}:</span>
      <span className={`text-sm text-right ml-4 ${highlight ? 'text-blue-600 font-semibold' : 'text-gray-900 dark:text-gray-300'}`}>
        {value}
      </span>
    </div>
  );

  // Main tutor details view
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-5 mb-4">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-700 rounded-xl shadow-none border border-gray-100 overflow-hidden sticky top-4">
              {/* Profile Image */}
              <div className="aspect-square relative">
                <img
                  src={tutor.profile_picture_url}
                  alt="Tutor Profile"
                  className="w-25 h-25 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Profile Info */}
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-300">{tutor.full_name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-semibold text-gray-900">{tutor.avg_rating || 0}</span>
                  </div>
                  <span className="text-gray-500 text-sm dark:text-gray-300">({tutor.review_count || 0} reviews)</span>
                </div>

                {/* Quick Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{tutor.user?.address}, {tutor.user?.division?.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm">{tutor.institute?.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{tutor.teaching_type_display}</span>
                  </div>
                </div>

                {/* Pricing Highlight */}
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Pricing</h4>
                  <div className="space-y-1">
                    <p className="text-blue-700 font-semibold">{tutor.expected_salary?.display_range}/month</p>
                    <p className="text-blue-600 text-sm">{tutor.expected_hourly_charge?.display_range}/hour</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {tutor.user.is_verified === false && (

                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <ShieldAlert className="w-12 h-12 text-red-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Tutor is not verified</h2>
                    <p className="text-gray-600 mb-6">The tutor you're looking for doesn't verified their profile. 
                      Tuition Wave will be remove this profile soon.
                    </p>
                    <button 
                      onClick={() => window.history.back()}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Go Back
                    </button>
                  </div>
                </div>

            )}
            {/* Personal Information */}
            <InfoCard icon={Users} title="Personal Information">
              <InfoItem label="Gender" value={tutor.gender_display} />
              <InfoItem label="Birth Date" value={birthDate} />
              <InfoItem label="Address" value={tutor.user?.address} />
            </InfoCard>

            {/* Education */}
            <InfoCard icon={GraduationCap} title="Educational Background">
              <InfoItem label="Degree" value={tutor.degree?.name} />
              <InfoItem label="Institute" value={tutor.institute?.name} />
              <InfoItem label="Department" value={tutor.department?.name} />
              <InfoItem label="Status" value={tutor.current_status_display} />
            </InfoCard>

            {/* Subjects */}
            <InfoCard icon={BookOpen} title="Teaching Subjects">
              <div className="flex flex-wrap gap-2">
                {tutor?.subjects?.map((subj, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                  >
                    {subj.subject}
                  </span>
                ))}
              </div>
            </InfoCard>

            {/* Location Preferences */}
            <InfoCard icon={MapPin} title="Teaching Locations">
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2 dark:text-gray-300">Preferred Districts</h5>
                  <div className="flex flex-wrap gap-2">
                    {tutor?.user?.preferred_districts?.map((dist, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {dist.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2 dark:text-gray-300">Preferred Areas</h5>
                  <div className="flex flex-wrap gap-2">
                    {tutor?.user?.preferred_areas?.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                      >
                        {area.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </InfoCard>

            {/* Availability */}
            <InfoCard icon={Clock} title="Availability & Schedule">
              <InfoItem label="Active Days" value={tutor?.active_days?.map((day) => day.day).join(", ")} />
              <InfoItem label="Days per Week" value={tutor?.active_days?.length || 0} />
              <InfoItem label="Preferred Time" value={tutor.preferred_time} />
            </InfoCard>

            {tutor.nid_document && (
              <InfoCard icon={FileText} title="Verification Documents">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Tutor ID Card</span>
                  </div>
                  <a
                    rel="noopener noreferrer"
                    className="text-green-600 text-sm font-bold transition-colors"
                  >
                    Verified
                  </a>
                </div>
              </InfoCard>
            )}
          </div>
        </div>
        <ReviewSection id={id} condition={"True"} />
      </div>
    </div>
  );
};

export default TutorDetails;