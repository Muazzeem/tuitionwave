
import { useState } from 'react';

interface ValidationErrors {
  selectedDays?: string;
  selectedSubjects?: string;
  selectedUpazila?: string;
  studentInstitution?: string;
  studentClass?: string;
  studentDepartment?: string;
  tuitionType?: string;
  memberCount?: string;
  preferredGender?: string;
  selectedAmount?: string;
  versionBanglaEnglish?: string;
  studentAddress?: string;
}

interface FormValues {
  selectedDays: string[];
  selectedSubjects: string[];
  selectedUpazila: string;
  studentArea: string;
  studentInstitution: string;
  studentClass: string;
  studentDepartment: string;
  tuitionType: string;
  memberCount: string;
  preferredGender: string;
  selectedAmount: string;
  versionBanglaEnglish: string;
  studentAddress: string;
}

export const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showValidationError, setShowValidationError] = useState(false);

  const clearFieldError = (field: keyof ValidationErrors) => {
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (values: FormValues) => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate all required fields
    if (values.selectedDays.length === 0) {
      newErrors.selectedDays = "Please select at least one day";
      isValid = false;
    }

    if (values.selectedSubjects.length === 0) {
      newErrors.selectedSubjects = "Please select at least one subject";
      isValid = false;
    }

    if (!values.selectedUpazila) {
      newErrors.selectedUpazila = "City is required";
      isValid = false;
    }

    if (!values.studentInstitution.trim()) {
      newErrors.studentInstitution = "Institution is required";
      isValid = false;
    }

    if (!values.studentClass) {
      newErrors.studentClass = "Class is required";
      isValid = false;
    }

    if (!values.tuitionType) {
      newErrors.tuitionType = "Tuition type is required";
      isValid = false;
    }

    if (!values.memberCount) {
      newErrors.memberCount = "Member count is required";
      isValid = false;
    }

    if (!values.preferredGender) {
      newErrors.preferredGender = "Gender preference is required";
      isValid = false;
    }

    if (!values.selectedAmount || parseFloat(values.selectedAmount) <= 0) {
      newErrors.selectedAmount = "Please enter a valid amount";
      isValid = false;
    }

    if (!values.versionBanglaEnglish) { 
      newErrors.versionBanglaEnglish = "Version is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return {
    errors,
    setErrors,
    showValidationError,
    setShowValidationError,
    validateForm,
    clearFieldError
  };
};
