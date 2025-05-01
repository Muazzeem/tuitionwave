import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Star, Calendar } from "lucide-react";
import { Tutor } from "@/types/tutor";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";



const TutorDetails: React.FC = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    if (id) {
      fetch(`http://127.0.0.1:8000/api/tutors/${id}`, {
      })
        .then((response) => response.json())
        .then((data) => {
          setTutor(data)
        })
        .catch((error) => console.error("Error fetching tutor details:", error))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleNext = () => {
    navigate("/create-contract");
  };

  if (loading || !tutor) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={
              tutor.profile_picture_url ||
              "/lovable-uploads/cf92a62d-174b-4e20-bb37-7b5e32ca556c.png"
            }
            alt="Tutor Profile"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>

        <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900">
              Maya
            </h2>
          <div>
            <div className="flex items-center gap-2 mb-5 mt-2">
              <div className="flex items-center text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-1 text-black">4.7</span>
              </div>
              <span className="text-gray-500">(54 reviews)</span>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-3 text-gray-900">
              Monthly Fee Range
            </h3>
            <p className="text-xl font-semibold text-blue-600">
              {tutor.expected_salary?.display_range}
            </p>
          </div>

          {(
            <div className="space-y-4">
              {userProfile?.user_type === "GUARDIAN" && (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 mt-10 p-6"
                  onClick={handleNext}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Make A Request"}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDetails;