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
import { getAccessToken } from "@/utils/auth";

interface DrawerState {
  isOpen: boolean;
}

const CreateContract: React.FC<{ uid: string; drawer: DrawerState, teaching_type: string, division: string }> = ({ uid, drawer, teaching_type, division }) => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedAmount, setSelectedAmount] = useState<string>("5000.00");
  const [studentInstitution, setStudentInstitution] = useState<string>("");
  const [studentClass, setStudentClass] = useState<string>("");
  const [studentDepartment, setStudentDepartment] = useState<string>("");
  const [tuitionType, setTuitionType] = useState<string>("");
  const [memberCount, setMemberCount] = useState<string>("");
  const [preferredGender, setPreferredGender] = useState<string>("");
  const [versionBanglaEnglish, setVersionBanglaEnglish] = useState<string>("");
  const [studentAddress, setStudentAddress] = useState<string>("");
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

  // Helper function to check if class is greater than 8
  const shouldShowDepartment = () => {
    if (!studentClass) return false;
    
    // Check if it's a numeric class
    const numericClass = parseInt(studentClass);
    if (!isNaN(numericClass)) {
      return numericClass > 8;
    }
    
    // For non-numeric classes, show department for higher education levels
    const higherEducationLevels = ["A Level", "HSC", "Undergraduate", "Graduate"];
    return higherEducationLevels.includes(studentClass);
  };

  // Helper function to check if address is required
  const shouldShowAddress = () => {
    // If teaching_type prop is 'BOTH', check the selected tuitionType
    if (teaching_type === 'BOTH') {
      return tuitionType === 'Home';
    }
    // If teaching_type prop is 'HOME', always show address
    return teaching_type === 'HOME';
  };

  // Fetch cities and areas when drawer opens
  useEffect(() => {
    if (drawer.isOpen) {
      fetchCities();
      fetchAreas();
    }
  }, [drawer.isOpen, fetchCities, fetchAreas]);

  // Clear department when class changes and department should not be shown
  useEffect(() => {
    if (!shouldShowDepartment() && studentDepartment) {
      setStudentDepartment("");
      clearFieldError('studentDepartment');
    }
  }, [studentClass]);

  // Clear address when tuition type changes and address should not be shown
  useEffect(() => {
    if (!shouldShowAddress() && studentAddress) {
      setStudentAddress("");
      clearFieldError('studentAddress');
    }
  }, [tuitionType, teaching_type]);

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
      case 'versionBanglaEnglish':
        setVersionBanglaEnglish(value);
        break;
      case 'studentAddress':
        setStudentAddress(value);
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
      studentDepartment: shouldShowDepartment() ? studentDepartment : "", // Only validate if shown
      tuitionType,
      memberCount,
      preferredGender,
      selectedAmount,
      versionBanglaEnglish,
      studentAddress: shouldShowAddress() ? studentAddress : "" // Only validate if address is required
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

    // Send the IDs directly without looking up names
    const payload = {
      student_upazila: studentCity, // City ID
      student_area: studentArea, // Area ID
      student_institution: studentInstitution,
      student_class: studentClass,
      student_department: shouldShowDepartment() ? studentDepartment : "", // Only send if applicable
      tuition_type: tuitionType.toUpperCase(),
      family_members: memberCount,
      student_gender: preferredGender,
      proposed_salary: parseFloat(selectedAmount),
      tutor: uid,
      subjects: subjectIds,
      active_days: dayIds,
      version_bangla_english: versionBanglaEnglish,
      student_address: shouldShowAddress() ? studentAddress : "", // Only send if address is required
    };

    console.log("Sending contract request:", payload);

    const accessToken = getAccessToken();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contracts/`, {
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
      navigate(`/${userProfile.user_type.toLocaleLowerCase()}/requests`);
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
      studentDepartment: shouldShowDepartment() ? studentDepartment : "", // Only validate if shown
      tuitionType,
      memberCount,
      preferredGender,
      selectedAmount,
      versionBanglaEnglish,
      studentAddress: shouldShowAddress() ? studentAddress : "" // Only validate if address is required
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

  const versionOptions = [
    { value: "Bangla", label: "Bangla" },
    { value: "English", label: "English" },
    { value: "Both", label: "Both" }
  ];

  const tuitionTypeOptions = [
    { value: "Home", label: "Home" },
    { value: "Online", label: "Online" }
  ];

  const memberOptions = [1, 2, 3, 4].map(member => ({
    value: member,
    label: member
  }));

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Any", label: "Any" }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6">
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
                }}
                cities={cities}
                areas={areas}
                loadingCities={loadingCities}
                loadingAreas={loadingAreas}
                cityError={errors.studentCity}
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
              
              {/* Conditionally render Department field */}
              {shouldShowDepartment() && (
                <div className="col-span-6">
                  <FormField
                    id="studentDepartment"
                    label="Department"
                    type="select"
                    value={studentDepartment}
                    onChange={(value) => handleFieldChange('studentDepartment', value)}
                    error={errors.studentDepartment}
                    options={departmentOptions}
                  />
                </div>
              )}
              
              <div className="col-span-6">
                <FormField
                  id="versionBanglaEnglish"
                  label="Version (Bangla/English)"
                  type="select"
                  value={versionBanglaEnglish}
                  onChange={(value) => handleFieldChange('versionBanglaEnglish', value)}
                  error={errors.versionBanglaEnglish}
                  required
                  options={versionOptions}
                />
              </div>
              
              <div className="col-span-6">
                { teaching_type === 'BOTH' ?
                  (
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
                  ) :
                  (
                    <FormField disabled
                      id="tuitionType"
                      label="Tuition Type"
                      type="text"
                      value={teaching_type}
                      onChange={(value) => handleFieldChange('tuitionType', value)}
                      placeholder="Enter Tuition Type"
                      error={errors.tuitionType}
                      required
                    />
                  )
                }
              </div>

              {/* Conditionally render Address field based on teaching type */}
              {shouldShowAddress() && (
                <div className="col-span-12">
                  <FormField
                    id="studentAddress"
                    label="Address"
                    type="textarea"
                    value={studentAddress}
                    onChange={(value) => handleFieldChange('studentAddress', value)}
                    placeholder="Enter full home address"
                    error={errors.studentAddress}
                    required
                    rows={3}
                  />
                </div>
              )}
              
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
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Fixed Button at Bottom */}
      {userProfile?.user_type === "GUARDIAN" && (
        <div className="border-t bg-background p-4 mb-14">
          <Button
            className="w-full min-h-[55px] dark:text-white"
            onClick={handleSendRequest}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Make Request"}
          </Button>
        </div>
      )}
      
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