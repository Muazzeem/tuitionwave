import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import custom components
import DaySelector from "./DaySelector";
import SubjectSelector from "./SubjectSelector";
import FormField from "./FormField";
import LocationFields from "./LocationFields";

// Import custom hooks
import { useTutorDetails } from "./useTutorDetails";
import { useFormValidation } from "./useFormValidation";
import { useLocationData } from "./useLocationData";
import { getAccessToken } from "@/utils/auth";
import ReviewSection from "../ReviewSection";
import DashboardHeader from "../DashboardHeader";

interface DrawerState {
  isOpen: boolean;
}

const CreateContract: React.FC<{ uid: string; drawer: DrawerState, teaching_type: string }> = ({ uid, drawer, teaching_type }) => {
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
  const { tutor, activeDays, activeDayMapping } = useTutorDetails(uid, drawer.isOpen);
  const { errors, showValidationError, setShowValidationError, validateForm, clearFieldError } = useFormValidation();
  const {
    divisions,
    districts,
    upazilas,
    areas,
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    selectedArea,
    loadingDivisions,
    loadingDistricts,
    loadingUpazilas,
    loadingAreas,
    handleDivisionChange,
    handleDistrictChange,
    handleUpazilaChange,
    handleAreaChange,
    fetchDivisions
  } = useLocationData();

  // Define studentCity and studentArea based on location selections
  const studentCity = selectedUpazila;
  const studentArea = selectedArea;

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

  useEffect(() => {
    fetchDivisions();
  }, [fetchDivisions]);

  useEffect(() => {
    if (!shouldShowDepartment() && studentDepartment) {
      setStudentDepartment("");
      clearFieldError('studentDepartment');
    }
  }, [studentClass, studentDepartment, clearFieldError]);

  useEffect(() => {
    if (!shouldShowAddress() && studentAddress) {
      setStudentAddress("");
      clearFieldError('studentAddress');
    }
  }, [tuitionType, teaching_type, studentAddress, clearFieldError]);

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

  const handleDaysChange = (days: string[]) => {
    setSelectedDays(days);
    clearFieldError('selectedDays');
  };

  // Form submission
  const handleMakeRequest = async () => {
    const isValid = validateForm({
      selectedDays,
      selectedSubjects,
      selectedUpazila,
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

    const payload = {
      student_upazila: selectedUpazila,
      student_area: studentArea,
      student_institution: studentInstitution,
      student_class: studentClass,
      student_department: shouldShowDepartment() ? studentDepartment : "",
      tuition_type: tuitionType.toUpperCase(),
      family_members: memberCount,
      student_gender: preferredGender,
      proposed_salary: parseFloat(selectedAmount),
      tutor: uid,
      subjects: subjectIds,
      active_days: dayIds,
      version_bangla_english: versionBanglaEnglish,
      student_address: shouldShowAddress() ? studentAddress : "",
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
      selectedUpazila,
      studentArea,
      studentInstitution,
      studentClass,
      studentDepartment: shouldShowDepartment() ? studentDepartment : "",
      tuitionType,
      memberCount,
      preferredGender,
      selectedAmount,
      versionBanglaEnglish,
      studentAddress: shouldShowAddress() ? studentAddress : ""
    });

    if (isValid) {
      setShowApproveConfirm(true);
      setShowValidationError(false);
    } else {
      setShowValidationError(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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
    <div className="bg-gray-50 dark:bg-gray-900">
      <DashboardHeader userName="Settings" />
      <ScrollArea type="always" style={{ height: 'calc(100vh - 100px)' }}>
        <div className="p-4 max-w-4xl mx-auto">
          <Card className="bg-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden">
                  <img
                    src={tutor?.profile_picture}
                    alt="Tutor Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{tutor?.full_name || 'Loading...'}</h2>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validation Error Alert */}
          {showValidationError && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                Please fill in all required fields before submitting your request.
              </AlertDescription>
            </Alert>
          )}

          <Card className="border-0 shadow-md">
            <CardContent className="p-4 space-y-6">

              {/* Schedule Selection */}
              <div>
                <DaySelector
                  activeDays={activeDays}
                  selectedDays={selectedDays}
                  onChange={handleDaysChange}
                  error={errors.selectedDays}
                />
              </div>

              {/* Subject Selection */}
              <div>
                <SubjectSelector
                  subjects={tutor?.subjects || []}
                  selectedSubjects={selectedSubjects}
                  onChange={(value) => handleFieldChange('selectedSubjects', value)}
                  error={errors.selectedSubjects}
                />
              </div>

              <div>
                <div className="space-y-4">
                  <div>
                    <LocationFields
                      selectedDivision={selectedDivision}
                      selectedDistrict={selectedDistrict}
                      selectedUpazila={selectedUpazila}
                      selectedArea={selectedArea}
                      onDivisionChange={(value) => {
                        handleDivisionChange(value);
                      }}
                      onDistrictChange={(value) => {
                        handleDistrictChange(value);
                      }}
                      onUpazilaChange={(value) => {
                        handleUpazilaChange(value);
                      }}
                      onAreaChange={(value) => {
                        handleAreaChange(value);
                      }}
                      divisions={divisions}
                      districts={districts}
                      upazilas={upazilas}
                      areas={areas}
                      loadingDivisions={loadingDivisions}
                      loadingDistricts={loadingDistricts}
                      loadingUpazilas={loadingUpazilas}
                      loadingAreas={loadingAreas}
                      divisionRequired={true}
                      districtRequired={true}
                      upazilaRequired={true}
                    />
                  </div>

                  {/* Institution and Class */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  {/* Department and Version */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shouldShowDepartment() && (
                      <FormField
                        id="studentDepartment"
                        label="Department"
                        type="select"
                        value={studentDepartment}
                        onChange={(value) => handleFieldChange('studentDepartment', value)}
                        error={errors.studentDepartment}
                        options={departmentOptions}
                      />
                    )}

                    <FormField
                      id="versionBanglaEnglish"
                      label="Version"
                      type="select"
                      value={versionBanglaEnglish}
                      onChange={(value) => handleFieldChange('versionBanglaEnglish', value)}
                      error={errors.versionBanglaEnglish}
                      required
                      options={versionOptions}
                    />
                  </div>
                </div>
              </div>

              {/* Tuition Preferences */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {/* Tuition Type */}
                  <div>
                    {teaching_type === 'BOTH' ? (
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
                    ) : (
                      <FormField
                        disabled
                        id="tuitionType"
                        label="Tuition Type"
                        type="text"
                        value={teaching_type}
                        onChange={(value) => handleFieldChange('tuitionType', value)}
                        placeholder="Enter Tuition Type"
                        error={errors.tuitionType}
                        required
                      />
                    )}
                  </div>

                  {/* Members */}
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

                  {/* Preferred Gender */}
                  <FormField
                    id="gender"
                    label="Preferred Gender"
                    type="select"
                    value={preferredGender}
                    onChange={(value) => handleFieldChange('preferredGender', value)}
                    error={errors.preferredGender}
                    required
                    options={genderOptions}
                  />
                </div>

                {/* Address if required */}
                {shouldShowAddress() && (
                  <div className="mt-4">
                    <FormField
                      id="studentAddress"
                      label="Home Address"
                      type="textarea"
                      value={studentAddress}
                      onChange={(value) => handleFieldChange('studentAddress', value)}
                      placeholder="Enter full home address"
                      error={errors.studentAddress}
                      required
                      rows={2}
                    />
                  </div>
                )}
              </div>

              {/* Payment Information */}
              <div>
                <div className="max-w-md">
                  <FormField
                    id="iWantToPay"
                    label="Proposed Monthly Salary (BDT)"
                    type="number"
                    value={selectedAmount}
                    onChange={(value) => handleFieldChange('selectedAmount', value)}
                    placeholder="Enter amount"
                    error={errors.selectedAmount}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This is your proposed salary. The final amount may be negotiated.
                  </p>
                </div>
              </div>

            </CardContent>

            {userProfile?.user_type === "GUARDIAN" && (
              <div className="p-4 mb-14">
                <div className="max-w-3xl mx-auto">
                  <Button
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                    onClick={handleSendRequest}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      "Send Tuition Request"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
        <ConfirmationDialog
          isOpen={showApproveConfirm}
          onClose={() => setShowApproveConfirm(false)}
          onConfirm={handleMakeRequest}
          title="Send Request to Tutor?"
          description="Are you sure you want to send this tuition request? The tutor will receive your details and contact information."
          variant="confirmation"
        />
        <ReviewSection id={uid} condition={"True"} />
      </ScrollArea>
    </div>
  );
};

export default CreateContract;