import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, Calendar } from "lucide-react";
import { Tutor } from "@/types/tutor";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Define all days of the week
const ALL_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const TutorDetails: React.FC = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<string>("5000");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [activeDayMapping, setActiveDayMapping] = useState<Record<string, number>>({});
  const [studentClass, setStudentClass] = useState<string>("");
  const [studentInstitution, setStudentInstitution] = useState<string>("");
  const [studentDepartment, setStudentDepartment] = useState<string>("Bangla");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [institutions, setInstitutions] = useState<
      { id: number; name: string }[]
    >([]);

  useEffect(() => {
    setLoading(true);
    if (id) {
      fetch(`http://127.0.0.1:8000/api/tutors/${id}`, {
      })
        .then((response) => response.json())
        .then((data) => {
          setTutor(data);
          
          // Extract active days and create day-to-id mapping from tutor data
          const daysList: string[] = [];
          const daysMap: Record<string, number> = {};
          
          data.active_days.forEach((dayInfo: { id: number, day: string }) => {
            daysList.push(dayInfo.day);
            daysMap[dayInfo.day] = dayInfo.id;
          });
          
          setActiveDays(daysList);
          setActiveDayMapping(daysMap);
        })
        .catch((error) => console.error("Error fetching tutor details:", error))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // Handler for day selection that only allows active days to be selected
  const handleDaySelection = (values: string[]) => {
    // Filter out any days that aren't active but were somehow selected
    const validSelections = values.filter((day) => activeDays.includes(day));
    setSelectedDays(validSelections);
  };

  const handleMakeRequest = async () => {
    if (!tutor) return;
    
    if (!studentClass) {
      toast({
        title: "Error",
        description: "Please enter student class.",
        variant: "destructive"
      });
      return;
    }
    
    if (!studentInstitution) {
      toast({
        title: "Error",
        description: "Please enter student institution.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedDays.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one day.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedSubjects.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one subject.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    
    // Get the IDs of selected subjects
    const subjectIds = tutor.subjects
      .filter(subjectInfo => selectedSubjects.includes(subjectInfo.subject))
      .map(subjectInfo => subjectInfo.id);
    
    // Get the IDs of selected days using the dynamic mapping
    const dayIds = selectedDays.map(day => activeDayMapping[day]);

    // Create contract request payload
    const payload = {
      student_class: studentClass,
      student_department: studentDepartment,
      student_institution: studentInstitution,
      proposed_salary: parseInt(selectedAmount, 10),
      tutor: 1,
      subjects: subjectIds,
      active_days: dayIds,
      message: customMessage
    };

    console.log("Sending contract request:", payload);

    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch("http://127.0.0.1:8000/api/contracts/", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create contract");
      }

      toast({
        title: "Success",
        description: "Your tutor request has been submitted successfully.",
      });
      navigate("/all-requests");
    } catch (err) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
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

          <div className="space-y-3 mt-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Education: {tutor.degree?.name} in {tutor.department?.name}
            </h2>
            <p className="text-gray-600">From {tutor.institute?.name}</p>
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Available {tutor.days_per_week} days per week</span>
            </div>
          </div>

          {(
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-3 text-gray-900 mt-3">Student Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Student Class</label>
                    <Input
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                      className="w-full"
                      placeholder="Enter student class (e.g. 9)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Student Institution</label>
                    <Input
                      value={studentInstitution}
                      onChange={(e) => setStudentInstitution(e.target.value)}
                      className="w-full"
                      placeholder="Enter student institution"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-gray-900">Select Days</h3>
                <ToggleGroup
                  type="multiple"
                  value={selectedDays}
                  onValueChange={handleDaySelection}
                  className="flex flex-wrap gap-2 justify-start"
                >
                  {ALL_DAYS.map((day) => {
                    const isActive = activeDays.includes(day);
                    return (
                      <ToggleGroupItem
                        key={day}
                        value={day}
                        aria-label={day}
                        disabled={!isActive}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                          "border-2 border-gray-200 hover:bg-blue-50",
                          "data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600",
                          !isActive && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {day}
                      </ToggleGroupItem>
                    );
                  })}
                </ToggleGroup>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-gray-900">Select Subject</h3>
                <ToggleGroup
                  type="multiple"
                  value={selectedSubjects}
                  onValueChange={setSelectedSubjects}
                  className="flex flex-wrap gap-2 justify-start"
                >
                  {tutor.subjects?.map((subjectInfo) => (
                    <ToggleGroupItem
                      key={subjectInfo.id}
                      value={subjectInfo.subject}
                      aria-label={subjectInfo.subject}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                        "border-2 border-gray-200 hover:bg-blue-50",
                        "data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600"
                      )}
                    >
                      {subjectInfo.subject}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-gray-900">
                  Monthly Fee Range
                </h3>
                <p className="text-xl font-semibold text-blue-600">
                  {tutor.expected_salary?.display_range}
                </p>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-gray-900">I want to Pay</h3>
                <Input
                  type="number"
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(e.target.value)}
                  className="w-full"
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <h3 className="font-medium mb-3 text-gray-900">Custom Notes</h3>
                <Textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full min-h-[120px]"
                  placeholder="Write any custom message or special requirements"
                />
              </div>
              {userProfile?.user_type === "GUARDIAN" && (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                  onClick={handleMakeRequest}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Make Request"}
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