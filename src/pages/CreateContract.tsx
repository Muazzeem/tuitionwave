import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { AlertCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define all days of the week
const ALL_DAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thr", "Fri"];

interface Subject {
  id: number;
  subject: string;
}

interface ActiveDay {
  id: number;
  day: string;
}

interface TutorDetails {
  full_name?: string;
  subjects?: Subject[];
  active_days?: ActiveDay[];
  rating?: number;
  review_count?: number;
}

interface ValidationErrors {
  selectedDays?: string;
  selectedSubjects?: string;
  studentCity?: string;
  studentArea?: string;
  studentInstitution?: string;
  studentClass?: string;
  studentDepartment?: string;
  tuitionType?: string;
  memberCount?: string;
  preferredGender?: string;
  selectedAmount?: string;
}

const CreateContract: React.FC = () => {
  const { userProfile } = useAuth();
  const { tutorId } = useParams<{ tutorId: string }>();
  const [selectedAmount, setSelectedAmount] = useState<string>("5000.00");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [studentCity, setStudentCity] = useState<string>("");
  const [studentArea, setStudentArea] = useState<string>("");
  const [studentInstitution, setStudentInstitution] = useState<string>("");
  const [studentClass, setStudentClass] = useState<string>("");
  const [studentDepartment, setStudentDepartment] = useState<string>("");
  const [tuitionType, setTuitionType] = useState<string>("");
  const [memberCount, setMemberCount] = useState<string>("");
  const [preferredGender, setPreferredGender] = useState<string>("");
  const [institutions, setInstitutions] = useState<
    { id: number; name: string }[]
  >([]);
  const [activeDayMapping, setActiveDayMapping] = useState<
    Record<string, number>
  >({});
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [tutor, setTutor] = useState<TutorDetails | null>(null);
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showValidationError, setShowValidationError] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  // Use tutorId from route parameters, fallback to a default if not available
  const currentTutorId = tutorId || "c021858d-00ca-4395-907b-1603c6666e88";

  useEffect(() => {
    setLoading(true);
    if (currentTutorId) {
      fetch(`http://127.0.0.1:8000/api/tutors/${currentTutorId}`, {})
        .then((response) => response.json())
        .then((data) => {
          setTutor(data);

          const daysList: string[] = [];
          const daysMap: Record<string, number> = {};

          data?.active_days?.forEach((dayInfo: ActiveDay) => {
            daysList.push(dayInfo.day.slice(0, 3)); // Shorten day names to three letters
            daysMap[dayInfo.day.slice(0, 3)] = dayInfo.id;
          });

          setActiveDays(daysList);
          setActiveDayMapping(daysMap);
        })
        .catch((error) => console.error("Error fetching tutor details:", error))
        .finally(() => setLoading(false));
    }
  }, [currentTutorId]);

  const handleDaySelection = (values: string[]) => {
    const validSelections = values.filter((day) => activeDays.includes(day));
    setSelectedDays(validSelections);
    // Clear any previous error for this field
    if (validSelections.length > 0) {
      setErrors((prev) => ({ ...prev, selectedDays: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate all required fields
    if (selectedDays.length === 0) {
      newErrors.selectedDays = "Please select at least one day";
      isValid = false;
    }

    if (selectedSubjects.length === 0) {
      newErrors.selectedSubjects = "Please select at least one subject";
      isValid = false;
    }

    if (!studentCity.trim()) {
      newErrors.studentCity = "City is required";
      isValid = false;
    }

    if (!studentArea.trim()) {
      newErrors.studentArea = "Area is required";
      isValid = false;
    }

    if (!studentInstitution.trim()) {
      newErrors.studentInstitution = "Institution is required";
      isValid = false;
    }

    if (!studentClass) {
      newErrors.studentClass = "Class is required";
      isValid = false;
    }

    if (!studentDepartment) {
      newErrors.studentDepartment = "Department is required";
      isValid = false;
    }

    if (!tuitionType) {
      newErrors.tuitionType = "Tuition type is required";
      isValid = false;
    }

    if (!memberCount) {
      newErrors.memberCount = "Member count is required";
      isValid = false;
    }

    if (!preferredGender) {
      newErrors.preferredGender = "Gender preference is required";
      isValid = false;
    }

    if (!selectedAmount || parseFloat(selectedAmount) <= 0) {
      newErrors.selectedAmount = "Please enter a valid amount";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleMakeRequest = async () => {
    if (!validateForm()) {
      setShowValidationError(true);
      // Scroll to the top to show the validation error alert
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    const subjectIds = tutor?.subjects
      ?.filter((subjectInfo) => selectedSubjects.includes(subjectInfo.subject))
      .map((subjectInfo) => subjectInfo.id) || [];

    const dayIds = selectedDays.map((day) => activeDayMapping[day]);

    const payload = {
      student_city: studentCity,
      student_area: studentArea,
      student_institution: studentInstitution,
      student_class: studentClass,
      student_department: studentDepartment,
      tuition_type: tuitionType.toUpperCase(),
      members: memberCount,
      gender_preference: preferredGender,
      proposed_salary: parseFloat(selectedAmount),
      tutor: currentTutorId, // Use the dynamic tutor ID
      subjects: subjectIds,
      active_days: dayIds,
      message: customMessage,
    };

    console.log("Sending contract request:", payload);

    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/contracts/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendRequest = () => {
    if (validateForm()) {
      setShowApproveConfirm(true);
      setShowValidationError(false);
    } else {
      setShowValidationError(true);
      // Scroll to the top to show the validation error alert
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFieldChange = (field: keyof ValidationErrors, value: any) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    switch (field) {
      case 'studentCity':
        setStudentCity(value);
        break;
      case 'studentArea':
        setStudentArea(value);
        break;
      case 'studentInstitution':
        setStudentInstitution(value);
        break;
      case 'studentClass':
        setStudentClass(value);
        break;
      case 'studentDepartment':
        setStudentDepartment(value);
        break;
      case 'tuitionType':
        setTuitionType(value);
        break;
      case 'memberCount':
        setMemberCount(value);
        break;
      case 'preferredGender':
        setPreferredGender(value);
        break;
      case 'selectedAmount':
        setSelectedAmount(value);
        break;
      case 'selectedSubjects':
        setSelectedSubjects(value);
        break;
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <DashboardHeader userName={tutor?.full_name || "Tutor Name"} />
      <div className="p-6 container mx-auto">
        <h2 className="text-3xl font-bold mb-6">{tutor?.full_name}</h2>

        {showValidationError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please fill in all required fields before submitting.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2 mb-5 mt-2">
          <div className="flex items-center text-yellow-400">
            {Array.from({ length: Math.floor(tutor?.rating || 4) }).map((_, index) => (
              <Star key={index} className="w-5 h-5 fill-current" />
            ))}
            <span className="ml-1 text-black">{tutor?.rating?.toFixed(1) || "4.0"}</span>
          </div>
          <span className="text-gray-500">({tutor?.review_count || 20} reviews)</span>
        </div>
        
        <div>
          <h3 className="mb-3 text-gray-600 text-md ">Select Days <span className="text-red-500">*</span></h3>
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
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "border-2 border-gray-200 hover:bg-blue-50",
                    "data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600",
                    !isActive && "opacity-70 cursor-not-allowed"
                  )}
                >
                  {day}
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
          {errors.selectedDays && (
            <p className="text-red-500 text-sm mt-1">{errors.selectedDays}</p>
          )}
        </div>

        <div className="mt-5">
          <h3 className="mb-3 text-gray-600 text-md">Select Subject <span className="text-red-500">*</span></h3>
          <ToggleGroup
            type="multiple"
            value={selectedSubjects}
            onValueChange={(value) => handleFieldChange('selectedSubjects', value)}
            className="flex flex-wrap gap-2 justify-start"
          >
            {tutor?.subjects?.map((subjectInfo) => (
              <ToggleGroupItem
                key={subjectInfo.id}
                value={subjectInfo.subject}
                aria-label={subjectInfo.subject}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  "border-2 border-gray-200 hover:bg-blue-50",
                  "data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-600"
                )}
              >
                {subjectInfo.subject}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {errors.selectedSubjects && (
            <p className="text-red-500 text-sm mt-1">{errors.selectedSubjects}</p>
          )}
        </div>

        <div className="grid grid-cols-12 gap-4 mb-6 mt-5">
          <div className="col-span-6">
            <div>
              <Label htmlFor="studentCity" className="block text-sm text-gray-600 mb-1">
                Student City <span className="text-red-500">*</span>
              </Label>
              <Input
                id="studentCity"
                value={studentCity}
                onChange={(e) => handleFieldChange('studentCity', e.target.value)}
                className={cn("w-full", errors.studentCity && "border-red-500")}
                placeholder="Enter City"
              />
              {errors.studentCity && (
                <p className="text-red-500 text-sm mt-1">{errors.studentCity}</p>
              )}
            </div>
          </div>
          <div className="col-span-6">
            <div>
              <Label htmlFor="studentArea" className="block text-sm text-gray-600 mb-1">
                Area <span className="text-red-500">*</span>
              </Label>
              <Input
                id="studentArea"
                value={studentArea}
                onChange={(e) => handleFieldChange('studentArea', e.target.value)}
                className={cn("w-full", errors.studentArea && "border-red-500")}
                placeholder="Enter Area"
              />
              {errors.studentArea && (
                <p className="text-red-500 text-sm mt-1">{errors.studentArea}</p>
              )}
            </div>
          </div>
          <div className="col-span-6">
            <div>
              <Label htmlFor="studentInstitution" className="block text-sm text-gray-600 mb-1">
                Student Institution <span className="text-red-500">*</span>
              </Label>
              <Input
                id="studentInstitution"
                value={studentInstitution}
                onChange={(e) => handleFieldChange('studentInstitution', e.target.value)}
                className={cn("w-full", errors.studentInstitution && "border-red-500")}
                placeholder="Enter Institution"
              />
              {errors.studentInstitution && (
                <p className="text-red-500 text-sm mt-1">{errors.studentInstitution}</p>
              )}
            </div>
          </div>
          <div className="col-span-6">
            <div>
              <Label htmlFor="studentClass" className="block text-sm text-gray-600 mb-1">
                Class <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={studentClass} 
                onValueChange={(value) => handleFieldChange('studentClass', value)}
              >
                <SelectTrigger className={cn("w-full", errors.studentClass && "border-red-500")}>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                  {["O Level", "A Level", "HSC", "SSC", "Undergraduate", "Graduate"].map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.studentClass && (
                <p className="text-red-500 text-sm mt-1">{errors.studentClass}</p>
              )}
            </div>
          </div>
          <div className="col-span-6">
            <div>
              <Label htmlFor="studentDepartment" className="block text-sm text-gray-600 mb-1">
                Department <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={studentDepartment} 
                onValueChange={(value) => handleFieldChange('studentDepartment', value)}
              >
                <SelectTrigger className={cn("w-full", errors.studentDepartment && "border-red-500")}>
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {["Bangla", "English", "Mathematics", "Science", "Physics", "Chemistry", "Biology", "Economics", "Accounting", "Business Studies"].map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.studentDepartment && (
                <p className="text-red-500 text-sm mt-1">{errors.studentDepartment}</p>
              )}
            </div>
          </div>
          <div className="col-span-6">
            <div>
              <Label htmlFor="tuitionType" className="block text-sm text-gray-600 mb-1">
                Tuition Type <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={tuitionType} 
                onValueChange={(value) => handleFieldChange('tuitionType', value)}
              >
                <SelectTrigger className={cn("w-full", errors.tuitionType && "border-red-500")}>
                  <SelectValue placeholder="Select Tuition Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Online">Online</SelectItem>
                </SelectContent>
              </Select>
              {errors.tuitionType && (
                <p className="text-red-500 text-sm mt-1">{errors.tuitionType}</p>
              )}
            </div>
          </div>
          <div className="col-span-6">
            <div>
              <Label htmlFor="members" className="block text-sm text-gray-600 mb-1">
                Members <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={memberCount} 
                onValueChange={(value) => handleFieldChange('memberCount', value)}
              >
                <SelectTrigger className={cn("w-full", errors.memberCount && "border-red-500")}>
                  <SelectValue placeholder="Select Member" />
                </SelectTrigger>
                <SelectContent>
                  {["1", "2", "3", "4", "5+"].map((member) => (
                    <SelectItem key={member} value={member}>{member}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.memberCount && (
                <p className="text-red-500 text-sm mt-1">{errors.memberCount}</p>
              )}
            </div>
          </div>
          <div className="col-span-6">
            <div>
              <Label htmlFor="gender" className="block text-sm text-gray-600 mb-1">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={preferredGender} 
                onValueChange={(value) => handleFieldChange('preferredGender', value)}
              >
                <SelectTrigger className={cn("w-full", errors.preferredGender && "border-red-500")}>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Any">Any</SelectItem>
                </SelectContent>
              </Select>
              {errors.preferredGender && (
                <p className="text-red-500 text-sm mt-1">{errors.preferredGender}</p>
              )}
            </div>
          </div>
          <div className="col-span-12">
            <div>
              <Label htmlFor="iWantToPay" className="block text-sm text-gray-600 mb-1">
                I want to Pay <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                id="iWantToPay"
                value={selectedAmount}
                onChange={(e) => handleFieldChange('selectedAmount', e.target.value)}
                className={cn("w-full", errors.selectedAmount && "border-red-500")}
                placeholder="Enter amount"
              />
              {errors.selectedAmount && (
                <p className="text-red-500 text-sm mt-1">{errors.selectedAmount}</p>
              )}
            </div>
          </div>
          <div className="col-span-12">
            <div>
              <Label htmlFor="customMessage" className="block text-sm text-gray-600 mb-1">
                Custom Message (Optional)
              </Label>
              <Textarea
                id="customMessage"
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full"
                placeholder="Add any additional information or special requirements"
                rows={4}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-full sm:w-auto">
            {userProfile?.user_type === "GUARDIAN" && (
              <Button
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 mt-6 rounded-md"
                onClick={handleSendRequest}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Make Request"}
              </Button>
            )}
          </div>
        </div>
      </div>
      <ConfirmationDialog
        isOpen={showApproveConfirm}
        onClose={() => setShowApproveConfirm(false)}
        onConfirm={handleMakeRequest}
        title="Request Sent to Tutor?"
        description="Are you sure you want to send this request?"
        variant="confirmation"
      />
    </div>
  );
};

export default CreateContract;