
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import custom components
import DaySelector from "./DaySelector";
import SubjectSelector from "./SubjectSelector";
import FormField from "./FormField";
import TutorHeader from "./TutorHeader";
import ValidationAlert from "./ValidationAlert";
import LocationFields from "./LocationFields";

// Import custom hooks
import { useTutorDetails } from "./useTutorDetails";
import { useFormValidation } from "./useFormValidation";
import { useLocationData } from "./useLocationData";

interface DrawerState {
  isOpen: boolean;
}

const CreateContract: React.FC<{ uid: string; drawer: DrawerState }> = ({ uid, drawer }) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedAmount, setSelectedAmount] = useState<string>("5000.00");
  const [customMessage, setCustomMessage] = useState<string>("");
  const [studentInstitution, setStudentInstitution] = useState<string>("");
  const [studentClass, setStudentClass] = useState<string>("");
  const [studentDepartment, setStudentDepartment] = useState<string>("");
  const [tuitionType, setTuitionType] = useState<string>("");
  const [memberCount, setMemberCount] = useState<string>("");
  const [preferredGender, setPreferredGender] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);

  // Custom hooks
  const { tutor, activeDays, activeDayMapping, loading } = useTutorDetails(uid, drawer.isOpen);
  const { errors, showValidationError, setShowValidationError, validateForm, clearFieldError } = useFormValidation();
  const {
    cities,
    areas,
    loadingCities,
    loadingAreas,
    studentCity,
    studentArea,
    fetchCities,
    fetchAreas,
    handleCityChange,
    handleAreaChange
  } = useLocationData();

  // Fetch cities and areas when drawer opens
  useEffect(() => {
    if (drawer.isOpen) {
      fetchCities();
      fetchAreas();
    }
  }, [drawer.isOpen, fetchCities, fetchAreas]);

  // Handle field changes
  const handleFieldChange = (field: string, value: any) => {
    clearFieldError(field as any);
    
    switch (field) {
      case 'selectedSubjects':
        setSelectedSubjects(value);
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
      case 'customMessage':
        setCustomMessage(value);
        break;
    }
  };

  // Handle days selection
  const handleDaysChange = (days: string[]) => {
    setSelectedDays(days);
    clearFieldError('selectedDays');
  };

  // Form submission
  const handleMakeRequest = async () => {
    const isValid = validateForm({
      selectedDays,
      selectedSubjects,
      studentCity,
      studentArea,
      studentInstitution,
      studentClass,
      studentDepartment,
      tuitionType,
      memberCount,
      preferredGender,
      selectedAmount
    });

    if (!isValid) {
      setShowValidationError(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);

    const subjectIds = tutor?.subjects
      ?.filter((subjectInfo) => selectedSubjects.includes(subjectInfo.subject))
      .map((subjectInfo) => subjectInfo.id) || [];

    const dayIds = selectedDays.map((day) => activeDayMapping[day]);

    // Get city and area names for payload
    const selectedCityObj = cities.find(city => city.id.toString() === studentCity);
    const selectedAreaObj = areas.find(area => area.id.toString() === studentArea);

    const payload = {
      student_city: selectedCityObj?.name || "",
      student_area: selectedAreaObj?.name || "",
      student_institution: studentInstitution,
      student_class: studentClass,
      student_department: studentDepartment,
      tuition_type: tuitionType.toUpperCase(),
      members: memberCount,
      gender_preference: preferredGender,
      proposed_salary: parseFloat(selectedAmount),
      tutor: uid,
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
    const isValid = validateForm({
      selectedDays,
      selectedSubjects,
      studentCity,
      studentArea,
      studentInstitution,
      studentClass,
      studentDepartment,
      tuitionType,
      memberCount,
      preferredGender,
      selectedAmount
    });

    if (isValid) {
      setShowApproveConfirm(true);
      setShowValidationError(false);
    } else {
      setShowValidationError(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Generate options for select fields
  const classOptions = [
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(cls => ({
      value: cls.toString(),
      label: cls.toString()
    })),
    ...["O Level", "A Level", "HSC", "SSC", "Undergraduate", "Graduate"].map(cls => ({
      value: cls,
      label: cls
    }))
  ];

  const departmentOptions = [
    "Bangla", "English", "Mathematics", "Science", "Physics", 
    "Chemistry", "Biology", "Economics", "Accounting", "Business Studies"
  ].map(dept => ({
    value: dept,
    label: dept
  }));

  const tuitionTypeOptions = [
    { value: "Home", label: "Home" },
    { value: "Online", label: "Online" }
  ];

  const memberOptions = ["1", "2", "3", "4", "5+"].map(member => ({
    value: member,
    label: member
  }));

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Any", label: "Any" }
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 mb-10">
        <ScrollArea type="always" style={{ height: "97vh" }}>
          <TutorHeader
            name={tutor?.full_name}
            rating={tutor?.rating}
            reviewCount={tutor?.review_count}
          />

          <ValidationAlert show={showValidationError} />

          <DaySelector
            activeDays={activeDays}
            selectedDays={selectedDays}
            onChange={handleDaysChange}
            error={errors.selectedDays}
          />

          <SubjectSelector
            subjects={tutor?.subjects || []}
            selectedSubjects={selectedSubjects}
            onChange={(value) => handleFieldChange('selectedSubjects', value)}
            error={errors.selectedSubjects}
          />

          <div className="grid grid-cols-12 gap-4 mb-6 mt-5">
            <LocationFields
              studentCity={studentCity}
              studentArea={studentArea}
              onCityChange={(value) => {
                handleCityChange(value);
                clearFieldError('studentCity');
              }}
              onAreaChange={(value) => {
                handleAreaChange(value);
                clearFieldError('studentArea');
              }}
              cities={cities}
              areas={areas}
              loadingCities={loadingCities}
              loadingAreas={loadingAreas}
              cityError={errors.studentCity}
              areaError={errors.studentArea}
            />
            
            <div className="col-span-6">
              <FormField
                id="studentInstitution"
                label="Student Institution"
                type="text"
                value={studentInstitution}
                onChange={(value) => handleFieldChange('studentInstitution', value)}
                placeholder="Enter Institution"
                error={errors.studentInstitution}
                required
              />
            </div>
            
            <div className="col-span-6">
              <FormField
                id="studentClass"
                label="Class"
                type="select"
                value={studentClass}
                onChange={(value) => handleFieldChange('studentClass', value)}
                error={errors.studentClass}
                required
                options={classOptions}
              />
            </div>
            
            <div className="col-span-6">
              <FormField
                id="studentDepartment"
                label="Department"
                type="select"
                value={studentDepartment}
                onChange={(value) => handleFieldChange('studentDepartment', value)}
                error={errors.studentDepartment}
                required
                options={departmentOptions}
              />
            </div>
            
            <div className="col-span-6">
              <FormField
                id="tuitionType"
                label="Tuition Type"
                type="select"
                value={tuitionType}
                onChange={(value) => handleFieldChange('tuitionType', value)}
                error={errors.tuitionType}
                required
                options={tuitionTypeOptions}
              />
            </div>
            
            <div className="col-span-6">
              <FormField
                id="members"
                label="Members"
                type="select"
                value={memberCount}
                onChange={(value) => handleFieldChange('memberCount', value)}
                error={errors.memberCount}
                required
                options={memberOptions}
              />
            </div>
            
            <div className="col-span-6">
              <FormField
                id="gender"
                label="Gender"
                type="select"
                value={preferredGender}
                onChange={(value) => handleFieldChange('preferredGender', value)}
                error={errors.preferredGender}
                required
                options={genderOptions}
              />
            </div>
            
            <div className="col-span-12">
              <FormField
                id="iWantToPay"
                label="I want to Pay"
                type="number"
                value={selectedAmount}
                onChange={(value) => handleFieldChange('selectedAmount', value)}
                placeholder="Enter amount"
                error={errors.selectedAmount}
                required
              />
            </div>
            
            <div className="col-span-12">
              <FormField
                id="customMessage"
                label="Custom Message (Optional)"
                type="textarea"
                value={customMessage}
                onChange={(value) => handleFieldChange('customMessage', value)}
                placeholder="Add any additional information or special requirements"
                required={false}
                rows={4}
              />
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
        </ScrollArea>
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
