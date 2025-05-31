import React, { useState, useEffect } from "react";
import { Star, MapPin, Calendar, Clock, BookOpen, GraduationCap, Users, FileText, ChevronLeft, Phone, Mail } from "lucide-react";
import { useParams } from "react-router-dom";
import ReviewSection from "./ReviewSection";

const TutorDetails: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tutor, setTutor] = useState(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { id } = useParams();
  useEffect(() => {
    setLoading(true);
    if (id) {
      fetch(`${import.meta.env.VITE_API_URL}/api/tutors/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setTutor(data);
          console.log(data);
        })
        .catch((error) => console.error("Error fetching tutor details:", error))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading || !tutor) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }


  const handleNext = () => {
    setSubmitting(true);
    setTimeout(() => {
      alert("Request sent successfully!");
      setSubmitting(false);
    }, 1500);
  };

  const handleBack = () => {
    console.log("Navigate back");
  };

  if (loading || !tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading tutor details...</p>
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
    <div className={`bg-white rounded-lg p-6 shadow-none border border-gray-100 hover:shadow-sm transition-shadow ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  const InfoItem = ({ label, value, highlight = false }) => (
    <div className="flex justify-between items-start">
      <span className="text-gray-600 text-sm font-medium">{label}:</span>
      <span className={`text-sm text-right ml-4 ${highlight ? 'text-blue-600 font-semibold' : 'text-gray-900'}`}>
        {value}
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-none border border-gray-100 overflow-hidden sticky top-4">
              {/* Profile Image */}
              <div className="aspect-square relative">
                <img
                  src={tutor.profile_picture}
                  alt="Tutor Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Profile Info */}
              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{tutor.full_name}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-semibold text-gray-900">4.7</span>
                  </div>
                  <span className="text-gray-500 text-sm">(54 reviews)</span>
                </div>

                {/* Quick Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{tutor.address}, {tutor.city?.district?.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm">{tutor.institute?.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
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
            {/* Personal Information */}
            <InfoCard icon={Users} title="Personal Information">
              <InfoItem label="Gender" value={tutor.gender_display} />
              <InfoItem label="Birth Date" value={birthDate} />
              <InfoItem label="Address" value={tutor.address} />
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
                {tutor.subjects.map((subj, index) => (
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
                  <h5 className="font-medium text-gray-900 mb-2">Preferred Districts</h5>
                  <div className="flex flex-wrap gap-2">
                    {tutor?.preferred_districts?.map((dist, index) => (
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
                  <h5 className="font-medium text-gray-900 mb-2">Preferred Areas</h5>
                  <div className="flex flex-wrap gap-2">
                    {tutor?.preferred_areas?.map((area, index) => (
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
              <InfoItem label="Active Days" value={tutor.active_days.map((day) => day.day).join(", ")} />
              <InfoItem label="Days per Week" value={tutor.days_per_week} />
              <InfoItem label="Preferred Time" value={tutor.preferred_time} />
            </InfoCard>

            {/* Documents */}
            {tutor.nid_document && (
              <InfoCard icon={FileText} title="Verification Documents">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">National ID Document</span>
                  </div>
                  <a
                    href={tutor.nid_document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                  >
                    View Document
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